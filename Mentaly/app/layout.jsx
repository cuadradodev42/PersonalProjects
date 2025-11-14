import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Mentaly - MVP Completo para Construir Hábitos Exitosos | App de Gamificación',
  description: 'Con Mentaly dejarás de ver lo que falta, empezarás a ver tu progreso y subirás de nivel en la vida real. MVP completo con gamificación profesional, Rueda de la Vida y analytics avanzados.',
  keywords: 'hábitos, seguimiento de hábitos, rueda de la vida, gamificación, desarrollo personal, bienestar, productividad, metas, objetivos',
  authors: [{ name: 'Mentaly Team' }],
  creator: 'Mentaly',
  publisher: 'Mentaly',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mentaly.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mentaly - MVP Completo para Construir Hábitos Exitosos',
    description: 'Con Mentaly dejarás de ver lo que falta, empezarás a ver tu progreso y subirás de nivel en la vida real. Tecnología avanzada disponible ahora.',
    url: 'https://mentaly.app',
    siteName: 'Mentaly',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mentaly - App de Seguimiento de Hábitos',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mentaly - MVP Completo para Construir Hábitos Exitosos',
    description: 'Con Mentaly dejarás de ver lo que falta, empezarás a ver tu progreso y subirás de nivel en la vida real.',
    images: ['/og-image.png'],
    creator: '@mentaly_app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#667eea" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Mentaly",
              "description": "MVP completo para construir hábitos exitosos con gamificación profesional, Rueda de la Vida interactiva y analytics avanzados",
              "url": "https://mentaly.app",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Mentaly Team"
              }
            })
          }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
          }
        `}} />
      </body>
    </html>
  );
}

