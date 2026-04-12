/**
 * Cálculo de notas del sistema de jurado.
 *
 * IMPORTANTE — fairness:
 * De momento las notas se calculan como media ponderada simple sin
 * normalización entre jueces. La normalización (z-score por juez,
 * shrinkage bayesiano, equipos ancla, etc.) se decidirá y añadirá
 * más adelante en `normalizeJudgeBias` — todas las funciones de
 * leaderboard pasan ya por ese hook para que el cambio sea local.
 *
 * Convenciones:
 *  - Una nota puntual (`score`) está en el rango [0, 10].
 *  - Los pesos son números arbitrarios; siempre se normalizan al sumar.
 *  - Una "evaluación" agrupa todas las notas que un juez da a un equipo
 *    en un reto concreto.
 */

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

/**
 * Hook de normalización de sesgo de juez.
 * Hoy: identidad (devuelve la nota tal cual).
 * Mañana: aquí entra la normalización elegida (z-score, etc.).
 */
export function normalizeJudgeBias(
  rawScore: number,
  _ctx: { juryId: string; allScoresByJury: Map<string, number[]> }
): number {
  // TODO(fairness): aplicar normalización entre jueces.
  return rawScore
}

/**
 * Nota de un equipo en un reto concreto, según los criterios específicos
 * de ese reto. Promedia las evaluaciones de todos los jueces que han
 * evaluado ese (team, challenge).
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
 * Nota general de un equipo: media de las medias ponderadas de los
 * criterios generales en TODAS las evaluaciones del equipo (sin importar
 * el reto). De momento sin corrección de sesgo entre jueces.
 */
export function teamGeneralScore(args: {
  teamId: string
  criteria: Criterion[]
  evaluations: Evaluation[]
  scores: Score[]
}): { value: number | null; juryCount: number } {
  const { teamId, criteria, evaluations, scores } = args

  const generalCriteria = criteria.filter(c => c.kind === 'general')
  if (generalCriteria.length === 0) return { value: null, juryCount: 0 }

  const relevantEvals = evaluations.filter(e => e.team_id === teamId)
  if (relevantEvals.length === 0) return { value: null, juryCount: 0 }

  const perJury: number[] = []
  for (const ev of relevantEvals) {
    const evalScores = generalCriteria.map(crit => {
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
 * Nota media de un equipo en UN criterio concreto, promediando entre todos
 * los jueces que han puntuado ese criterio para ese equipo. Devuelve null
 * si nadie lo ha puntuado todavía.
 *
 * Para criterios "specific" filtra además por challenge_id, porque la nota
 * solo tiene sentido en evaluaciones del reto correspondiente.
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
