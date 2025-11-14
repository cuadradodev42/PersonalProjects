# 🚀 Guía de Deployment en Vercel - Mentaly

Esta guía te ayudará a desplegar tu aplicación Mentaly en Vercel de manera profesional y segura.

## 📋 Prerrequisitos

- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Cuenta en [Firebase](https://firebase.google.com)
- ✅ Proyecto configurado localmente
- ✅ Git repository (GitHub, GitLab, o Bitbucket)

## 🔧 Configuración Previa

### 1. Configurar Firebase para Producción

1. **Crear proyecto en Firebase Console**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto o usa uno existente
   - Habilita Authentication (Email/Password y Google)
   - Crea una base de datos Firestore en modo producción

2. **Configurar Authentication**
   - Ve a Authentication > Sign-in method
   - Habilita "Email/Password"
   - Habilita "Google" y configura el dominio autorizado

3. **Configurar Firestore**
   - Ve a Firestore Database
   - Crea la base de datos en modo producción
   - Copia las reglas de seguridad desde `firestore.rules`

4. **Obtener credenciales**
   - Ve a Project Settings > General
   - En "Your apps", selecciona tu app web
   - Copia la configuración de Firebase

### 2. Preparar el Repositorio

```bash
# Asegúrate de que todos los archivos estén committeados
git add .
git commit -m "Preparar para deployment en Vercel"
git push origin main
```

## 🚀 Deployment en Vercel

### Opción 1: Deployment Automático (Recomendado)

1. **Conectar con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "New Project"
   - Conecta tu repositorio de Git

2. **Configurar Variables de Entorno**
   - En la configuración del proyecto, ve a "Environment Variables"
   - Agrega las siguientes variables:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY = tu_api_key_aqui
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = tu_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID = tu_project_id_aqui
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = tu_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = tu_messaging_sender_id_aqui
   NEXT_PUBLIC_FIREBASE_APP_ID = tu_app_id_aqui
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = tu_measurement_id_aqui
   ```

3. **Configurar Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Haz clic en "Deploy"
   - Espera a que termine el proceso
   - ¡Tu app estará disponible en la URL proporcionada!

### Opción 2: Deployment Manual con Vercel CLI

1. **Instalar Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login en Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configurar Variables de Entorno**
   ```bash
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
   vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
   vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
   ```

## 🔒 Configuración de Seguridad

### 1. Configurar Dominios Autorizados en Firebase

1. Ve a Firebase Console > Authentication > Settings
2. En "Authorized domains", agrega:
   - `tu-app.vercel.app`
   - `tu-dominio-personalizado.com` (si tienes uno)

### 2. Configurar Reglas de Firestore

Las reglas ya están configuradas en `firestore.rules`. Asegúrate de aplicarlas:

1. Ve a Firebase Console > Firestore Database > Rules
2. Copia el contenido de `firestore.rules`
3. Haz clic en "Publish"

## 📊 Monitoreo y Optimización

### 1. Configurar Analytics

```bash
# Instalar Vercel Analytics (opcional)
npm install @vercel/analytics
```

### 2. Configurar Web Vitals

Vercel automáticamente monitorea:
- Core Web Vitals
- Performance metrics
- Error tracking

### 3. Configurar Alertas

En Vercel Dashboard:
- Ve a "Functions" para monitorear API calls
- Configura alertas para errores críticos
- Revisa logs en tiempo real

## 🔄 CI/CD Automático

Con la configuración actual, cada push a la rama principal activará un nuevo deployment:

```bash
# Para hacer cambios
git add .
git commit -m "Nueva funcionalidad"
git push origin main
# Vercel automáticamente desplegará los cambios
```

## 🐛 Troubleshooting

### Error: Firebase not initialized
- Verifica que todas las variables de entorno estén configuradas
- Revisa que los nombres de las variables coincidan exactamente

### Error: Permission denied en Firestore
- Verifica que las reglas de Firestore estén aplicadas
- Revisa que el usuario esté autenticado correctamente

### Error: Build failed
- Revisa los logs en Vercel Dashboard
- Verifica que todas las dependencias estén en `package.json`
- Ejecuta `npm run build` localmente para debuggear

### Error: Domain not authorized
- Agrega tu dominio de Vercel a los dominios autorizados en Firebase
- Verifica que la configuración de Authentication esté correcta

## 📈 Optimizaciones Adicionales

### 1. Configurar CDN
Vercel automáticamente usa su CDN global para:
- Assets estáticos
- Imágenes optimizadas
- Caching inteligente

### 2. Configurar Edge Functions (Opcional)
Para funciones serverless más rápidas:

```javascript
// pages/api/example.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Edge!' })
}
```

### 3. Configurar Preview Deployments
Cada pull request creará automáticamente un preview deployment para testing.

## 🎯 Checklist Final

- [ ] Variables de entorno configuradas
- [ ] Firebase Authentication habilitado
- [ ] Firestore Database creada
- [ ] Reglas de seguridad aplicadas
- [ ] Dominios autorizados configurados
- [ ] Build exitoso localmente (`npm run build`)
- [ ] Deployment exitoso en Vercel
- [ ] Funcionalidad básica verificada en producción

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en Vercel Dashboard
2. Verifica la configuración de Firebase
3. Consulta la [documentación de Vercel](https://vercel.com/docs)
4. Revisa la [documentación de Firebase](https://firebase.google.com/docs)

---

**¡Feliz deployment! 🚀✨**

Tu aplicación Mentaly estará lista para ayudar a miles de usuarios a construir mejores hábitos.
