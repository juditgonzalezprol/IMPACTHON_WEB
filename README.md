# 🚀 IMPACTHON_WEB

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-teal?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-blue?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**IMPACTHON_WEB** es una plataforma integral de gestión diseñada para el hackathon **Impacthon**. Un ecosistema robusto pensado para conectar a participantes, mentores y jurados, garantizando una experiencia competitiva transparente, dinámica y tecnológicamente avanzada.

🔗 **Web en producción:** [impacthon-web.vercel.app](https://impacthon-web.vercel.app/)

---

## ✨ Características Principales

### 👥 Gestión de Equipos y Participantes
- **Registro Dinámico**: Flujo de inscripción optimizado para hackers.
- **Perfiles de Equipo**: Espacio dedicado para gestionar repositorios de GitHub y entregables específicos por reto.
- **Dashboard de Staff**: Herramientas administrativas para supervisar el progreso de los 140+ participantes.

### ⚖️ Sistema de Jurado Inteligente (Fair Play)
- **Evaluación Multinivel**: Interfaz intuitiva con sliders para calificar criterios ponderados.
- **Z-Score Normalization**: Implementación de lógica estadística avanzada (Z-Score) para mitigar sesgos individuales de los jueces, asegurando una competencia justa.
- **Asignación en Tiempo Real**: Distribución automática de equipos a paneles de jurado específicos.

### 📊 Visualización de Resultados
- **Leaderboard en Vivo**: Clasificaciones actualizadas al segundo, accesibles mediante PIN de seguridad.
- **Desglose de Puntos**: Visualización detallada de puntuaciones por criterio y promedios ponderados.

### 🗓️ Experiencia del Evento
- **Agenda Dual**: Cronograma paralelo para tracks de *Programming* y *Entrepreneurship*.
- **Sistema de Anuncios**: Notificaciones en tiempo real para mantener a todos los equipos sincronizados.

---

## 🎨 Estética "Cyber-Sustainable"

El proyecto destaca por una interfaz visualmente impactante que combina:
- **Modo Ultra-Oscuro**: Base en negros y grises profundos para reducir el cansancio visual.
- **Acentos Neón**: Uso del color dominante **#AAFF00 (Verde Neón)** para elementos interactivos y jerarquías.
- **Micro-interacciones**: Animaciones fluidas mediante **Framer Motion** y efectos de código binario en scroll.
- **Componentes Premium**: Construido sobre **Shadcn/UI** para una estética moderna y profesional.

---

## 🛠️ Stack Tecnológico

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React](https://reactjs.org/)
- **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes**: [Shadcn/UI](https://ui.shadcn.com/) (Radix UI)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Iconografía**: [Lucide React](https://lucide.dev/)

---

## 🚀 Instalación y Uso Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/juditgonzalezprol/IMPACTHON_WEB.git
   cd IMPACTHON_WEB
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env.local` con tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
   ```

4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

---

## 📄 Créditos

Proyecto desarrollado por [Judit González](https://github.com/juditgonzalezprol) para la gestión del evento **Impacthon**.
