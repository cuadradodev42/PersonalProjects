# Variables de Entorno para Producción - Mentaly

## 🔧 Configuración Requerida

### Firebase (Obligatorio)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

### Entorno
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production

### URLs
NEXT_PUBLIC_APP_URL=https://mentaly.app
SITE_URL=https://mentaly.app

### Analytics (Opcional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_GTM_ID=your_google_tag_manager_id

### Performance Monitoring (Opcional)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id

### Feature Flags (Opcional)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

## 📋 Checklist de Configuración

### ✅ Firebase
- [ ] Proyecto creado en Firebase Console
- [ ] Authentication habilitado (Email/Password + Google)
- [ ] Firestore Database creada en modo producción
- [ ] Reglas de seguridad aplicadas
- [ ] Dominios autorizados configurados

### ✅ Vercel
- [ ] Variables de entorno configuradas
- [ ] Dominio personalizado configurado
- [ ] SSL habilitado
- [ ] Analytics habilitado

### ✅ SEO
- [ ] Sitemap.xml generado
- [ ] Robots.txt configurado
- [ ] Meta tags optimizados
- [ ] Open Graph configurado

### ✅ Performance
- [ ] Bundle analyzer ejecutado
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals optimizados
- [ ] Imágenes optimizadas

## 🚨 Notas Importantes

1. **NUNCA** commitees archivos .env a Git
2. **SIEMPRE** usa HTTPS en producción
3. **VERIFICA** que todas las variables estén configuradas antes del deploy
4. **MONITOREA** el rendimiento después del deploy
5. **CONFIGURA** alertas para errores críticos
