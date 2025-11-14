# Instrucciones de Configuración Paso a Paso

## 1. Configuración Inicial del Proyecto

### Instalación de Dependencias

```bash
npm install
```

## 2. Configuración de Firebase

### A. Crear Proyecto de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombra tu proyecto (ej: "mentaly-app")
4. Desactiva Google Analytics si no lo necesitas
5. Haz clic en "Crear proyecto"

### B. Habilitar Autenticación

1. En el menú lateral, ve a **Build > Authentication**
2. Haz clic en "Get started"
3. En la pestaña "Sign-in method":
   - Habilita **Email/Password**
   - Habilita **Google** (necesitarás configurar OAuth):
     - Ingresa un nombre para tu app
     - Ingresa tu email de soporte
     - Guarda

### C. Crear Base de Datos Firestore

1. En el menú lateral, ve a **Build > Firestore Database**
2. Haz clic en "Create database"
3. Selecciona una ubicación (ej: us-central)
4. Comienza en **modo de producción**
5. En la pestaña **Rules**, reemplaza con estas reglas:

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

6. Haz clic en "Publicar"

### D. Obtener Credenciales de Firebase

1. En Firebase Console, haz clic en el ícono de engranaje ⚙️ > "Configuración del proyecto"
2. En la sección "Tus apps", si no hay ninguna app web, haz clic en el ícono `</>` (Web)
3. Registra tu app con un nombre (ej: "Mentaly Web")
4. Copia los valores de configuración que aparecen

### E. Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y reemplaza con tus valores:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mentaly-app.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=mentaly-app
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mentaly-app.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

## 3. Ejecutar la Aplicación

```bash
npm run dev
```

Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## 4. Probar la Aplicación

### Primera Prueba

1. **Registro de Usuario**:
   - Ve a http://localhost:3000
   - Haz clic en "Comenzar Gratis"
   - Registra un usuario con email y contraseña
   - O prueba con Google Sign-In

2. **Crear Primer Hábito**:
   - Haz clic en el botón flotante `+` (abajo a la derecha)
   - Crea un hábito, ej: "Hacer ejercicio 30 min"
   - Selecciona categoría: "Salud Física"
   - Haz clic en "Crear Hábito"

3. **Completar Hábito**:
   - En el Dashboard, marca el checkbox del hábito
   - ¡Deberías recibir tu primer logro! 🎉

4. **Explorar Funcionalidades**:
   - Ve a "Hábitos" para gestionar todos tus hábitos
   - Ve a "Estadísticas" para ver gráficos
   - Ve a "Logros" para ver tus logros desbloqueados

## 5. Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Verifica que las variables de entorno en `.env.local` sean correctas
- Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "Permission denied"
- Verifica que las reglas de Firestore estén configuradas correctamente
- Asegúrate de estar autenticado

### La Rueda de la Vida está vacía
- Es normal si acabas de empezar
- Crea hábitos en diferentes categorías
- Completa hábitos durante varios días para ver datos

### Los logros no se desbloquean
- Verifica la consola del navegador para errores
- Asegúrate de que Firestore tenga las reglas correctas
- Los logros se verifican cada vez que completas un hábito

## 6. Deployment (Opcional)

### Desplegar en Vercel

1. Instala Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Despliega:
   ```bash
   vercel --prod
   ```

3. Configura las variables de entorno en Vercel Dashboard:
   - Ve a tu proyecto en Vercel
   - Settings > Environment Variables
   - Agrega todas las variables de `.env.local`

### Configurar Dominio Autorizado en Firebase

1. En Firebase Console > Authentication > Settings
2. En "Authorized domains", agrega tu dominio de Vercel
3. Ejemplo: `mentaly-app.vercel.app`

## 7. Próximos Pasos

¡Felicidades! Tu aplicación está lista. Ahora puedes:

- Personalizar los estilos en `app/globals.css`
- Agregar más categorías de hábitos
- Crear nuevos tipos de logros
- Implementar notificaciones push
- Agregar recordatorios diarios
- Crear un sistema de rachas más avanzado

## 8. Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Recharts Documentation](https://recharts.org/en-US/)

---

**¿Necesitas ayuda?** Revisa el archivo README.md para más información sobre la estructura del proyecto.

