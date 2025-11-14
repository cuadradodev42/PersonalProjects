# Mentaly - Aplicación de Seguimiento de Hábitos Gamificada

Una aplicación web completa para gestionar hábitos, visualizar el progreso en diferentes áreas de la vida a través de la "Rueda de la Vida" y motivar al usuario con un sistema de gamificación.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 15.5.5 (con App Router)
- **Lenguaje**: JavaScript (ES Modules)
- **Estilos**: Tailwind CSS 4.1.14
- **Componentes UI**: shadcn/ui
- **Backend & DB**: Firebase 12.4.0 (Authentication, Firestore)
- **Gráficos**: Recharts 3.2.1

## 📋 Características Principales

### 1. **Autenticación**
- Registro e inicio de sesión con email/contraseña
- Inicio de sesión con Google
- Rutas protegidas con middleware

### 2. **Dashboard**
- Vista general de hábitos del día
- Rueda de la Vida (RadarChart) mostrando balance en 8 áreas
- Marcado rápido de hábitos completados

### 3. **Gestión de Hábitos**
- Crear, editar y eliminar hábitos
- Organización por categorías:
  - Salud Física
  - Salud Mental
  - Finanzas
  - Carrera/Estudios
  - Relaciones Familiares
  - Relaciones Sociales
  - Desarrollo Personal
  - Ocio/Diversión

### 4. **Estadísticas**
- Gráfico de barras: Hábitos completados por día (última semana)
- Gráfico de líneas: Evolución del puntaje de categorías
- Métricas de progreso

### 5. **Sistema de Logros**
- Desbloqueo automático de logros al completar hitos
- Logros con diferentes rarezas (Común, Raro, Épico, Legendario)
- Notificaciones toast al desbloquear logros

## 🛠️ Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install
```

**Nota**: Este proyecto utiliza **Tailwind CSS v4.1.14** con Next.js 15.5.5 y React 19.2.0. Asegúrate de tener instalado `@tailwindcss/postcss` como dependencia de desarrollo para el correcto funcionamiento.

### 2. Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Authentication** (Email/Password y Google)
3. Crea una base de datos **Firestore** en modo de producción
4. En la configuración del proyecto, obtén las credenciales de Firebase

### 3. Configurar Variables de Entorno

Edita el archivo `.env.local` con tus credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 4. Configurar Reglas de Firestore

En Firebase Console > Firestore Database > Rules, configura las siguientes reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regla para usuarios
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Subcolecciones del usuario
      match /habits/{habitId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /habit_logs/{logId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /achievements/{achievementId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 5. Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
mentaly/
├── app/
│   ├── (auth)/              # Rutas de autenticación
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/              # Rutas protegidas
│   │   ├── layout.jsx       # Layout con Navbar
│   │   ├── dashboard/
│   │   ├── habits/
│   │   ├── stats/
│   │   └── achievements/
│   ├── layout.jsx           # Layout raíz
│   ├── page.jsx             # Landing page
│   └── globals.css
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   ├── auth/
│   │   └── AuthForm.jsx
│   ├── dashboard/
│   │   ├── LifeWheelChart.jsx
│   │   └── TodaysHabits.jsx
│   ├── habits/
│   │   ├── HabitCard.jsx
│   │   ├── HabitForm.jsx
│   │   └── AddHabitButton.jsx
│   └── shared/
│       ├── Navbar.jsx
│       └── Modal.jsx
├── context/
│   └── AuthContext.jsx
├── lib/
│   ├── firebase.js          # Configuración Firebase
│   ├── firestore.js         # Funciones Firestore
│   └── utils.js             # Utilidades
└── middleware.js            # Protección de rutas
```

## 🎯 Modelo de Datos en Firestore

### Colecciones

```
users/{userId}
  - email: string
  - displayName: string
  - photoURL: string
  - createdAt: timestamp

users/{userId}/habits/{habitId}
  - name: string
  - category: string
  - frequency: string
  - createdAt: timestamp

users/{userId}/habit_logs/{logId}
  - habitId: string
  - completedAt: timestamp
  - notes: string (opcional)

users/{userId}/achievements/{achievementId}
  - name: string
  - description: string
  - rarity: string (common, rare, epic, legendary)
  - icon: string
  - unlockedAt: timestamp
```

## 🎮 Sistema de Logros

Los logros se desbloquean automáticamente al cumplir ciertos criterios:

- **Primer Paso** (Común): Completa tu primer hábito
- **Principiante Dedicado** (Común): Completa 5 hábitos en total
- **En Racha** (Raro): Completa 20 hábitos en total
- **Campeón de Hábitos** (Épico): Completa 50 hábitos en total
- **Cuerpo Sano** (Raro): Completa 5 hábitos de Salud Física
- **Racha de 3 Días** (Raro): Completa hábitos 3 días seguidos

## 🎨 Paleta de Colores

- **Primario**: Indigo-600 (#6366f1)
- **Fondo**: Slate-50
- **Éxito**: Green-500
- **Advertencia**: Yellow-500

## 📱 Responsive Design

La aplicación está completamente optimizada para dispositivos móviles y de escritorio, utilizando las utilidades responsive de Tailwind CSS.

## 🚢 Deployment

Para desplegar la aplicación:

1. **Vercel** (recomendado para Next.js):
   ```bash
   npm run build
   vercel --prod
   ```

2. No olvides configurar las variables de entorno en tu plataforma de deployment.

## 📝 Notas de Desarrollo

- La aplicación usa el App Router de Next.js 14
- El middleware protege las rutas del grupo `(main)`
- Los componentes de shadcn/ui están personalizados con los colores del proyecto
- La Rueda de la Vida calcula automáticamente el puntaje basándose en hábitos completados vs. programados en los últimos 30 días

## 🐛 Troubleshooting

### Error: Firebase not initialized
Verifica que las variables de entorno estén correctamente configuradas en `.env.local`

### Error: Permission denied
Revisa las reglas de Firestore en Firebase Console

### Error: Module not found
Ejecuta `npm install` nuevamente

## 📄 Licencia

Este proyecto es un MVP educativo. Siéntete libre de usarlo y modificarlo.

## 🤝 Contribuciones

Este es un proyecto de demostración. Si encuentras bugs o tienes sugerencias, ¡siéntete libre de mejorar el código!

---

**¡Feliz construcción de hábitos! 🎯✨**

