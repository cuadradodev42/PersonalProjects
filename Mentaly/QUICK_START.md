# 🚀 Quick Start - Mentaly

Guía rápida para poner en marcha Mentaly en 5 minutos.

## ⚡ Inicio Rápido

### 1. Instalar Dependencias
```bash
npm install
```

**Nota**: El proyecto utiliza **Tailwind CSS v4.1.14** con Next.js 15.5.5 y React 19.2.0. Asegúrate de que `@tailwindcss/postcss` esté instalado como dependencia de desarrollo.

### 2. Configurar Firebase
```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con tus credenciales de Firebase
# (Obtén las credenciales desde Firebase Console)
```

### 3. Ejecutar
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) 🎉

## 📋 Checklist de Configuración

- [ ] Crear proyecto en Firebase Console
- [ ] Habilitar Authentication (Email/Password y Google)
- [ ] Crear Firestore Database
- [ ] Configurar reglas de Firestore (ver abajo)
- [ ] Copiar credenciales a `.env.local`
- [ ] Ejecutar `npm install`
- [ ] Ejecutar `npm run dev`

## 🔥 Reglas de Firestore (Copia y Pega)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
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

## 🎯 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Construir para producción
npm start            # Iniciar servidor de producción

# Linting
npm run lint         # Verificar errores de código
```

## 📂 Estructura de Carpetas

```
mentaly/
├── app/                    # Páginas y rutas (Next.js App Router)
│   ├── (auth)/            # Rutas públicas (login, signup)
│   ├── (main)/            # Rutas protegidas (dashboard, habits, etc)
│   └── page.jsx           # Landing page
├── components/            # Componentes React
│   ├── ui/               # Componentes de shadcn/ui
│   ├── auth/             # Componentes de autenticación
│   ├── dashboard/        # Componentes del dashboard
│   ├── habits/           # Componentes de hábitos
│   └── shared/           # Componentes compartidos
├── context/              # Context API (AuthContext)
├── lib/                  # Utilidades y configuración
│   ├── firebase.js       # Configuración de Firebase
│   ├── firestore.js      # Funciones de Firestore
│   └── utils.js          # Funciones de utilidad
└── middleware.js         # Protección de rutas
```

## 🎨 Tecnologías Principales

| Tecnología | Uso |
|-----------|-----|
| Next.js 14 | Framework de React |
| Tailwind CSS | Estilos |
| shadcn/ui | Componentes UI |
| Firebase Auth | Autenticación |
| Firestore | Base de datos |
| Recharts | Gráficos |

## 🔗 Enlaces Rápidos

- **Firebase Console**: https://console.firebase.google.com/
- **shadcn/ui Docs**: https://ui.shadcn.com/
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

## 💡 Primeros Pasos Después de Instalar

1. **Regístrate** en la app (localhost:3000)
2. **Crea tu primer hábito** con el botón flotante +
3. **Marca como completado** en el Dashboard
4. **Desbloquea tu primer logro** 🏆
5. **Explora las estadísticas** y la Rueda de la Vida

## 🐛 Problemas Comunes

### Error: "Firebase not initialized"
```bash
# Verifica que .env.local existe y tiene las credenciales correctas
# Reinicia el servidor de desarrollo
```

### Error: "Permission denied"
```bash
# Verifica que las reglas de Firestore estén configuradas
# Ve a Firebase Console > Firestore Database > Rules
```

### La app no carga
```bash
# Limpia la caché y reinstala
rm -rf .next node_modules
npm install
npm run dev
```

### Los logros no se desbloquean
```bash
# Verifica la consola del navegador para errores
# Asegúrate de que las reglas de Firestore permitan crear achievements
```

## 📖 Documentación Completa

Para más detalles, consulta:

- **README.md** - Documentación principal
- **SETUP_INSTRUCTIONS.md** - Guía de configuración detallada
- **USAGE_EXAMPLES.md** - Ejemplos de código
- **SECURITY_AND_IMPROVEMENTS.md** - Mejoras y seguridad

## 🎯 Categorías de Hábitos

La app incluye 8 categorías predefinidas:

1. 💪 Salud Física
2. 🧠 Salud Mental
3. 💰 Finanzas
4. 📚 Carrera/Estudios
5. 👨‍👩‍👧‍👦 Relaciones Familiares
6. 👥 Relaciones Sociales
7. 🚀 Desarrollo Personal
8. 🎮 Ocio/Diversión

## ✨ Características Principales

- ✅ Sistema de hábitos diarios
- 📊 Rueda de la Vida (RadarChart)
- 📈 Estadísticas y gráficos
- 🏆 Sistema de logros gamificado
- 🔐 Autenticación segura
- 📱 Diseño responsive
- 🎨 UI moderna con Tailwind CSS

## 🚀 Deploy Rápido en Vercel

```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

**No olvides**: Configurar las variables de entorno en Vercel Dashboard.

## 📞 Soporte

Si tienes problemas:
1. Consulta la sección de Troubleshooting
2. Revisa la consola del navegador
3. Verifica la configuración de Firebase
4. Lee la documentación detallada en los archivos MD

---

**¡Listo! Ahora estás preparado para comenzar con Mentaly.** 🎉

Para guías más detalladas, consulta:
- **SETUP_INSTRUCTIONS.md** para configuración paso a paso
- **USAGE_EXAMPLES.md** para ejemplos de código
- **README.md** para documentación completa

