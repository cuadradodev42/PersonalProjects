# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

## [1.1.0] - 2025-01-16

### 🚀 Actualización a Versiones Más Nuevas

#### Cambios Realizados
- **Next.js**: Actualizado de 14.2.5 a 15.5.5
- **React**: Actualizado de 18.3.1 a 19.2.0
- **Tailwind CSS**: Actualizado de 3.4.4 a 4.1.14
- **Firebase**: Actualizado de 10.12.2 a 12.4.0
- **Configuración ES Modules**: Habilitado para compatibilidad con versiones más nuevas
- **Plugin PostCSS**: Actualizado para usar `@tailwindcss/postcss` (Tailwind v4)

## [1.0.0] - 2025-01-16

### 🎉 Lanzamiento Inicial - MVP Completo

#### ✨ Características Añadidas

**Autenticación**
- Sistema de registro e inicio de sesión con email/contraseña
- Inicio de sesión con Google
- Contexto de autenticación global (AuthContext)
- Rutas protegidas con middleware
- Redirección automática según estado de autenticación

**Dashboard**
- Vista principal con resumen del día
- Componente TodaysHabits: lista de hábitos del día con checkboxes
- Componente LifeWheelChart: Rueda de la Vida con RadarChart
- Cálculo dinámico de puntajes por categoría
- Feedback visual al completar hábitos

**Gestión de Hábitos**
- CRUD completo de hábitos (Crear, Leer, Actualizar, Eliminar)
- Categorización en 8 áreas de vida:
  - Salud Física
  - Salud Mental
  - Finanzas
  - Carrera/Estudios
  - Relaciones Familiares
  - Relaciones Sociales
  - Desarrollo Personal
  - Ocio/Diversión
- Botón flotante para agregar hábitos rápidamente
- Modal para crear/editar hábitos
- Tarjetas de hábitos con acciones rápidas

**Estadísticas**
- Página dedicada a estadísticas
- Gráfico de barras: Hábitos completados en los últimos 7 días
- Gráfico de líneas: Evolución de puntaje por categoría
- Métricas de resumen (total de hábitos, completados, promedio)
- Filtro por categoría para el gráfico de tendencias

**Sistema de Logros**
- Desbloqueo automático de logros
- Sistema de rareza (Común, Raro, Épico, Legendario)
- Notificaciones toast al desbloquear logros
- Página dedicada a mostrar logros desbloqueados
- Estadísticas por rareza de logros
- Logros implementados:
  - 🌱 Primer Paso - Completa tu primer hábito
  - ⭐ Principiante Dedicado - Completa 5 hábitos
  - 🔥 En Racha - Completa 20 hábitos
  - 🏆 Campeón de Hábitos - Completa 50 hábitos
  - 💪 Cuerpo Sano - Completa 5 hábitos de Salud Física
  - 📅 Racha de 3 Días - Completa hábitos 3 días seguidos

**Landing Page**
- Página de inicio pública atractiva
- Sección Hero con call-to-action
- Sección de características con tarjetas
- Sección de CTA final
- Footer con información del proyecto
- Diseño responsive y moderno

**UI/UX**
- Diseño moderno con Tailwind CSS
- Componentes de shadcn/ui (Button, Card, Input, Select, etc.)
- Sistema de toasts para notificaciones
- Modales para formularios
- Navbar responsive con menú móvil
- Iconos de Lucide React
- Paleta de colores cohesiva (Indigo como color primario)
- Estados de carga y feedback visual
- Animaciones sutiles

**Backend & Database**
- Integración completa con Firebase
- Firestore para almacenamiento de datos
- Estructura de colecciones optimizada:
  - users/{userId}
  - users/{userId}/habits/{habitId}
  - users/{userId}/habit_logs/{logId}
  - users/{userId}/achievements/{achievementId}
- Funciones de Firestore reutilizables
- Reglas de seguridad de Firestore

**Utilidades**
- Funciones de formateo de fechas
- Funciones de comparación de fechas
- Sistema de verificación de logros
- Cálculo automático de puntajes de Rueda de la Vida
- Helper para obtener rangos de fechas

#### 📁 Estructura del Proyecto

```
mentaly/
├── app/                           # Next.js 14 App Router
│   ├── (auth)/                   # Grupo de rutas públicas
│   │   ├── login/page.jsx       # Página de inicio de sesión
│   │   └── signup/page.jsx      # Página de registro
│   ├── (main)/                   # Grupo de rutas protegidas
│   │   ├── layout.jsx           # Layout con Navbar
│   │   ├── dashboard/page.jsx   # Dashboard principal
│   │   ├── habits/page.jsx      # Gestión de hábitos
│   │   ├── stats/page.jsx       # Estadísticas
│   │   └── achievements/page.jsx # Logros
│   ├── layout.jsx                # Layout raíz
│   ├── page.jsx                  # Landing page
│   └── globals.css               # Estilos globales
├── components/
│   ├── ui/                       # Componentes de shadcn/ui
│   ├── auth/                     # Componentes de autenticación
│   ├── dashboard/                # Componentes del dashboard
│   ├── habits/                   # Componentes de hábitos
│   └── shared/                   # Componentes compartidos
├── context/
│   └── AuthContext.jsx           # Contexto de autenticación
├── lib/
│   ├── firebase.js               # Configuración de Firebase
│   ├── firestore.js              # Funciones de Firestore
│   └── utils.js                  # Utilidades y helpers
├── middleware.js                 # Middleware de protección de rutas
├── .env.local                    # Variables de entorno (no incluido en git)
├── .env.example                  # Plantilla de variables de entorno
├── package.json                  # Dependencias del proyecto
├── next.config.js                # Configuración de Next.js
├── tailwind.config.js            # Configuración de Tailwind CSS
├── postcss.config.js             # Configuración de PostCSS
├── components.json               # Configuración de shadcn/ui
├── jsconfig.json                 # Configuración de JavaScript
└── .gitignore                    # Archivos ignorados por Git
```

#### 📚 Documentación

- **README.md** - Documentación principal del proyecto
- **QUICK_START.md** - Guía de inicio rápido (5 minutos)
- **SETUP_INSTRUCTIONS.md** - Instrucciones detalladas paso a paso
- **USAGE_EXAMPLES.md** - Ejemplos de uso de la API
- **SECURITY_AND_IMPROVEMENTS.md** - Guía de seguridad y mejoras futuras
- **CHANGELOG.md** - Este archivo, historial de cambios

#### 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: JavaScript
- **Estilos**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Autenticación**: Firebase Authentication
- **Base de Datos**: Cloud Firestore
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Deployment**: Optimizado para Vercel

#### 📦 Dependencias Principales

```json
{
  "react": "^18.3.1",
  "next": "14.2.5",
  "firebase": "^10.12.2",
  "recharts": "^2.12.7",
  "tailwindcss": "^3.4.4",
  "@radix-ui/react-*": "Varios paquetes para componentes UI"
}
```

#### 🔒 Seguridad

- Variables de entorno para credenciales de Firebase
- Reglas de seguridad de Firestore implementadas
- Protección de rutas con middleware
- Validación de autenticación en el cliente
- Solo los usuarios pueden acceder a sus propios datos

#### 🎨 Diseño

- Paleta de colores moderna (Indigo-600 como color primario)
- Diseño completamente responsive
- Compatible con móviles, tablets y desktop
- Animaciones sutiles para mejor UX
- Estados de carga y errores
- Feedback visual en todas las acciones

#### ⚡ Performance

- Lazy loading de componentes donde es apropiado
- Optimización de consultas a Firestore
- Carga eficiente de datos
- Caché del navegador optimizada

#### 📱 Responsive

- Breakpoints de Tailwind CSS
- Menú móvil en el Navbar
- Grids responsive para tarjetas
- Gráficos adaptativos
- Touch-friendly en móviles

#### 🧪 Testing

- Linting configurado con ESLint
- Configuración lista para tests (a implementar)

---

## Próximas Versiones (Roadmap)

### [1.1.0] - Planeado

**Características a Añadir**
- [ ] Sistema de notificaciones push
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Sistema de recordatorios
- [ ] Rachas avanzadas

### [1.2.0] - Planeado

**Características a Añadir**
- [ ] Categorías personalizadas
- [ ] Exportar datos a PDF/CSV
- [ ] Compartir progreso en redes sociales
- [ ] Sistema de amigos/comunidad
- [ ] Analytics avanzado

### [2.0.0] - Futuro

**Características a Añadir**
- [ ] Plan premium con Stripe
- [ ] Integración con wearables
- [ ] API pública
- [ ] Mobile apps (React Native)
- [ ] IA para sugerencias de hábitos

---

## Convenciones de Changelog

Este changelog sigue el formato de [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y el proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

### Tipos de Cambios

- **Added** (Añadido) - Para nuevas características
- **Changed** (Cambiado) - Para cambios en funcionalidad existente
- **Deprecated** (Obsoleto) - Para características que pronto se eliminarán
- **Removed** (Eliminado) - Para características eliminadas
- **Fixed** (Arreglado) - Para corrección de bugs
- **Security** (Seguridad) - Para vulnerabilidades

---

**Nota**: Esta es la primera versión del proyecto. Todas las características mencionadas están completamente implementadas y funcionales.

