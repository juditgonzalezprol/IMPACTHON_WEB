/**
 * Cálculo de notas del sistema de jurado.
 *
 * Fairness — normalización Z-score por juez:
 * Cada juez tiene su propio "centro" y "dispersión" al puntuar. Para que
 * las notas generales sean comparables entre equipos evaluados por jueces
 * distintos, normalizamos: z = (nota - μⱼ) / σⱼ, y luego remapeamos a
 * la escala global: normalizada = μ_global + σ_global × z, clamped a [0,10].
 *
 * Salvaguardas:
 *  - Juez con < MIN_EVALS_FOR_NORMALIZATION evaluaciones: sin normalización.
 *  - σⱼ ≈ 0 (da la misma nota a todos): solo corrección por offset.
 *
 * Convenciones:
 *  - Una nota puntual (`score`) está en el rango [0, 10].
 *  - Los pesos son números arbitrarios; siempre se normalizan al sumar.
 *  - Una "evaluación" agrupa todas las notas que un juez da a un equipo
 *    en un reto concreto.
 */

/** Mínimo de evaluaciones que un juez necesita para normalizar su sesgo. */
const MIN_EVALS_FOR_NORMALIZATION = 3

/** σ por debajo de la cual se considera que el juez puntúa "plano". */
const MIN_STDDEV = 0.3

export type Criterion = {
  id: string
  name: string
  weight: number
  kind: 'specific' | 'general'
  challenge_id: string | null
}

export type Score = {
  evaluation_id: string
  criterion_id: string
  score: number
}

export type Evaluation = {
  id: string
  team_id: string
  jury_id: string
  challenge_id: string
}

/**
 * Estadísticas pre-calculadas para la normalización de sesgo.
 * Se computan una vez y se pasan a las funciones que lo necesitan.
 */
export type JuryStats = {
  perJury: Map<string, { mean: number; std: number; count: number }>
  globalMean: number
  globalStd: number
}

// ─── helpers ────────────────────────────────────────────────────────

function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length
}

function stddev(values: number[], avg: number): number {
  const variance = values.reduce((acc, v) => acc + (v - avg) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}

// ─── core ───────────────────────────────────────────────────────────

/**
 * Media ponderada de un conjunto de notas según los pesos de cada criterio.
 * Devuelve null si no hay ninguna nota válida.
 */
export function weightedAverage(
  scores: { score: number; weight: number }[]
): number | null {
  const valid = scores.filter(s => Number.isFinite(s.score) && s.weight > 0)
  if (valid.length === 0) return null

  const totalWeight = valid.reduce((acc, s) => acc + s.weight, 0)
  if (totalWeight === 0) return null

  const weighted = valid.reduce((acc, s) => acc + s.score * s.weight, 0)
  return weighted / totalWeight
}

// ─── fairness ───────────────────────────────────────────────────────

/**
 * Pre-calcula las estadísticas de cada juez a partir de TODAS las
 * evaluaciones y notas del sistema. Llamar una sola vez y pasar el
 * resultado a `teamGeneralScoreNormalized`.
 *
 * Para cada juez, computa la media ponderada de criterios generales en
 * cada evaluación, y a partir de esas notas calcula μⱼ y σⱼ.
 */
export function computeJuryStats(args: {
  criteria: Criterion[]
  evaluations: Evaluation[]
  scores: Score[]
}): JuryStats {
  const { criteria, evaluations, scores } = args
  const generalCriteria = criteria.filter(c => c.kind === 'general')

  // Paso 1: nota general cruda de cada evaluación
  const rawByJury = new Map<string, number[]>()
  const allRaw: number[] = []

  for (const ev of evaluations) {
    const evalScores = generalCriteria.map(crit => {
      const s = scores.find(
        sc => sc.evaluation_id === ev.id && sc.criterion_id === crit.id
      )
      return { score: s?.score ?? NaN, weight: crit.weight }
    })
    const avg = weightedAverage(evalScores)
    if (avg === null) continue

    allRaw.push(avg)
    if (!rawByJury.has(ev.jury_id)) rawByJury.set(ev.jury_id, [])
    rawByJury.get(ev.jury_id)!.push(avg)
  }

  // Paso 2: estadísticas globales
  const globalMean = allRaw.length > 0 ? mean(allRaw) : 5.0
  const globalStd = allRaw.length > 1 ? stddev(allRaw, globalMean) : 1.5

  // Paso 3: estadísticas por juez
  const perJury = new Map<string, { mean: number; std: number; count: number }>()
  for (const [juryId, values] of rawByJury) {
    const m = mean(values)
    const s = stddev(values, m)
    perJury.set(juryId, { mean: m, std: s, count: values.length })
  }

  return { perJury, globalMean, globalStd }
}

/**
 * Normaliza una nota cruda de un juez usando z-score.
 *
 * Comportamiento:
 *  - Juez con ≥ MIN_EVALS y σⱼ > MIN_STDDEV:
 *      z = (raw - μⱼ) / σⱼ
 *      normalizada = μ_global + σ_global × z
 *  - Juez con ≥ MIN_EVALS pero σⱼ ≈ 0 (puntúa todo igual):
 *      Solo corrección de offset: normalizada = raw + (μ_global - μⱼ)
 *  - Juez con < MIN_EVALS:
 *      Sin cambio (no hay datos suficientes para estimar su sesgo).
 */
export function normalizeJudgeBias(
  rawScore: number,
  juryId: string,
  stats: JuryStats
): number {
  const juryStat = stats.perJury.get(juryId)
  if (!juryStat || juryStat.count < MIN_EVALS_FOR_NORMALIZATION) {
    // No hay datos suficientes, devolver sin cambio
    return rawScore
  }

  if (juryStat.std < MIN_STDDEV) {
    // Juez "plano": solo corregir offset
    return clamp(rawScore + (stats.globalMean - juryStat.mean), 0, 10)
  }

  // Z-score completo
  const z = (rawScore - juryStat.mean) / juryStat.std
  return clamp(stats.globalMean + stats.globalStd * z, 0, 10)
}

// ─── scoring público ────────────────────────────────────────────────

/**
 * Nota de un equipo en un reto concreto, según los criterios específicos
 * de ese reto. Promedia las evaluaciones de todos los jueces que han
 * evaluado ese (team, challenge).
 *
 * SIN normalización — la nota del reto la decide el jurado del reto y
 * no se compara con otros retos.
 */
export function teamScoreForChallenge(args: {
  teamId: string
  challengeId: string
  criteria: Criterion[]
  evaluations: Evaluation[]
  scores: Score[]
}): { value: number | null; juryCount: number } {
  const { teamId, challengeId, criteria, evaluations, scores } = args

  const specificCriteria = criteria.filter(
    c => c.kind === 'specific' && c.challenge_id === challengeId
  )
  if (specificCriteria.length === 0) return { value: null, juryCount: 0 }

  const relevantEvals = evaluations.filter(
    e => e.team_id === teamId && e.challenge_id === challengeId
  )
  if (relevantEvals.length === 0) return { value: null, juryCount: 0 }

  const perJury: number[] = []
  for (const ev of relevantEvals) {
    const evalScores = specificCriteria.map(crit => {
      const s = scores.find(
        sc => sc.evaluation_id === ev.id && sc.criterion_id === crit.id
      )
      return { score: s?.score ?? NaN, weight: crit.weight }
    })
    const avg = weightedAverage(evalScores)
    if (avg !== null) perJury.push(avg)
  }

  if (perJury.length === 0) return { value: null, juryCount: 0 }
  const value = perJury.reduce((a, b) => a + b, 0) / perJury.length
  return { value, juryCount: perJury.length }
}

/**
 * Nota general de un equipo CON normalización de sesgo entre jueces.
 *
 * Flujo:
 * 1. Para cada evaluación del equipo, calcula la media ponderada de
 *    criterios generales → nota cruda del juez.
 * 2. Normaliza esa nota con z-score del juez (vía `stats`).
 * 3. Promedia las notas normalizadas de todos los jueces.
 *
 * Si `stats` es null, devuelve la media cruda sin normalizar (fallback).
 */
export function teamGeneralScore(args: {
  teamId: string
  criteria: Criterion[]
  evaluations: Evaluation[]
  scores: Score[]
  stats?: JuryStats | null
}): { value: number | null; rawValue: number | null; juryCount: number } {
  const { teamId, criteria, evaluations, scores, stats } = args

  const generalCriteria = criteria.filter(c => c.kind === 'general')
  if (generalCriteria.length === 0) return { value: null, rawValue: null, juryCount: 0 }

  const relevantEvals = evaluations.filter(e => e.team_id === teamId)
  if (relevantEvals.length === 0) return { value: null, rawValue: null, juryCount: 0 }

  const rawValues: number[] = []
  const normalizedValues: number[] = []

  for (const ev of relevantEvals) {
    const evalScores = generalCriteria.map(crit => {
      const s = scores.find(
        sc => sc.evaluation_id === ev.id && sc.criterion_id === crit.id
      )
      return { score: s?.score ?? NaN, weight: crit.weight }
    })
    const raw = weightedAverage(evalScores)
    if (raw === null) continue

    rawValues.push(raw)

    if (stats) {
      normalizedValues.push(normalizeJudgeBias(raw, ev.jury_id, stats))
    } else {
      normalizedValues.push(raw)
    }
  }

  if (normalizedValues.length === 0) return { value: null, rawValue: null, juryCount: 0 }

  const value = normalizedValues.reduce((a, b) => a + b, 0) / normalizedValues.length
  const rawValue = rawValues.reduce((a, b) => a + b, 0) / rawValues.length
  return { value, rawValue, juryCount: normalizedValues.length }
}

/**
 * Nota media de un equipo en UN criterio concreto, promediando entre todos
 * los jueces que han puntuado ese criterio para ese equipo. Devuelve null
 * si nadie lo ha puntuado todavía.
 *
 * Para criterios "specific" filtra además por challenge_id, porque la nota
 * solo tiene sentido en evaluaciones del reto correspondiente.
 *
 * SIN normalización (es una vista de detalle, no una nota agregada).
 */
export function teamCriterionAverage(args: {
  teamId: string
  criterion: Criterion
  evaluations: Evaluation[]
  scores: Score[]
}): { value: number | null; juryCount: number } {
  const { teamId, criterion, evaluations, scores } = args

  const relevantEvals = evaluations.filter(e => {
    if (e.team_id !== teamId) return false
    if (criterion.kind === 'specific' && e.challenge_id !== criterion.challenge_id) {
      return false
    }
    return true
  })

  const values: number[] = []
  for (const ev of relevantEvals) {
    const s = scores.find(
      sc => sc.evaluation_id === ev.id && sc.criterion_id === criterion.id
    )
    if (s && Number.isFinite(s.score)) values.push(s.score)
  }

  if (values.length === 0) return { value: null, juryCount: 0 }
  return {
    value: values.reduce((a, b) => a + b, 0) / values.length,
    juryCount: values.length,
  }
}

/**
 * Devuelve una evaluación esté completa o no:
 *   - completa: todas las notas (específicas + generales) puestas
 *   - parcial: alguna nota puesta
 *   - vacia: ninguna
 */
export function evaluationStatus(args: {
  evaluation: Evaluation | undefined
  challengeId: string
  criteria: Criterion[]
  scores: Score[]
}): 'completa' | 'parcial' | 'vacia' {
  const { evaluation, challengeId, criteria, scores } = args
  if (!evaluation) return 'vacia'

  const expected = criteria.filter(
    c => c.kind === 'general' || (c.kind === 'specific' && c.challenge_id === challengeId)
  )
  const myScores = scores.filter(s => s.evaluation_id === evaluation.id)

  if (myScores.length === 0) return 'vacia'
  if (myScores.length >= expected.length) return 'completa'
  return 'parcial'
}
