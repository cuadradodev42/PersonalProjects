'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target, 
  TrendingUp, 
  Trophy, 
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Heart,
  Star
} from 'lucide-react';
import { useEffect } from 'react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-primary">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Navbar */}
        <nav className="relative z-10 py-4 px-2 sm:py-6 sm:px-4 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center">
                <Sparkles className="mr-1 sm:mr-2 h-5 w-5 sm:h-6 w-6 lg:h-8 w-8" />
                Mentaly
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 text-xs sm:text-sm">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="gradient-secondary text-white shadow-glow-orange hover:shadow-glow-orange/60 text-xs sm:text-sm">
                  Comenzar Gratis
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded-full glass-effect text-white text-xs sm:text-sm font-medium mb-6 sm:mb-8 animate-pulse-slow">
              <Zap className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 w-4" />
              ¡MVP Disponible Ahora!
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight">
              Con Mentaly dejarás de ver lo que falta,
              <span className="block text-white drop-shadow-lg">
                empezarás a ver tu progreso y subirás de nivel en la vida real
              </span>
            </h2>
            <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg lg:text-xl text-white drop-shadow-md px-2">
              Una aplicación completa para construir hábitos positivos con gamificación avanzada. 
              Visualiza tu progreso con la Rueda de la Vida, desbloquea logros épicos y transforma 
              tu perspectiva hacia el éxito. Todo lo que necesitas para cambiar tu vida.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
              <Link href="/signup">
                <Button size="lg" className="gradient-secondary text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 shadow-glow-orange hover:shadow-glow-orange/60 animate-float w-full sm:w-auto">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/20 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-16 sm:top-20 left-4 sm:left-10 animate-float">
          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full gradient-success opacity-20"></div>
        </div>
        <div className="absolute top-32 sm:top-40 right-8 sm:right-20 animate-float" style={{animationDelay: '2s'}}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full gradient-warning opacity-20"></div>
        </div>
        <div className="absolute bottom-16 sm:bottom-20 left-1/4 animate-float" style={{animationDelay: '4s'}}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full gradient-info opacity-20"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 lg:py-24 glass-effect">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
              Todo lo que necesitas para construir hábitos exitosos
            </h3>
            <p className="text-base sm:text-lg text-white drop-shadow-md px-2">
              Herramientas profesionales diseñadas para maximizar tu potencial y mantenerte motivado
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="glass-effect border-white/20 hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-primary rounded-lg flex items-center justify-center mb-3 sm:mb-4 shadow-glow">
                  <Target className="h-5 w-5 sm:h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg sm:text-xl">Sistema de Hábitos Completo</CardTitle>
                <CardDescription className="text-white drop-shadow-sm text-sm sm:text-base">
                  Crea, organiza y rastrea hábitos en 8 áreas de vida con categorización inteligente y recordatorios personalizados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-white/20 hover:shadow-glow-green transition-all duration-300 hover:scale-105">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-secondary rounded-lg flex items-center justify-center mb-3 sm:mb-4 shadow-glow-green">
                  <BarChart3 className="h-5 w-5 sm:h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg sm:text-xl">Rueda de la Vida Interactiva</CardTitle>
                <CardDescription className="text-white drop-shadow-sm text-sm sm:text-base">
                  Visualiza tu balance de vida con gráficos dinámicos que muestran tu progreso en tiempo real
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-white/20 hover:shadow-glow-green transition-all duration-300 hover:scale-105">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-success rounded-lg flex items-center justify-center mb-3 sm:mb-4 shadow-glow-green">
                  <TrendingUp className="h-5 w-5 sm:h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg sm:text-xl">Analytics Avanzados</CardTitle>
                <CardDescription className="text-white drop-shadow-sm text-sm sm:text-base">
                  Gráficos detallados, métricas de progreso y análisis de tendencias para optimizar tu rendimiento
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-white/20 hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-warning rounded-lg flex items-center justify-center mb-3 sm:mb-4 shadow-glow">
                  <Trophy className="h-5 w-5 sm:h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg sm:text-xl">Gamificación Profesional</CardTitle>
                <CardDescription className="text-white drop-shadow-sm text-sm sm:text-base">
                  Sistema de logros con 4 niveles de rareza, retos personalizados y mecánicas de progresión
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-white/20 hover:shadow-glow-red transition-all duration-300 hover:scale-105">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-accent rounded-lg flex items-center justify-center mb-3 sm:mb-4 shadow-glow-red">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg sm:text-xl">Interfaz Premium</CardTitle>
                <CardDescription className="text-white drop-shadow-sm text-sm sm:text-base">
                  Diseño moderno con efectos visuales avanzados, animaciones fluidas y experiencia táctil optimizada
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-effect border-white/20 hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-primary rounded-lg flex items-center justify-center mb-3 sm:mb-4 shadow-glow">
                  <Heart className="h-5 w-5 sm:h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white text-lg sm:text-xl">Progreso en Tiempo Real</CardTitle>
                <CardDescription className="text-white drop-shadow-sm text-sm sm:text-base">
                  Actualizaciones instantáneas, notificaciones de logros y celebración automática de hitos
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-16 lg:py-24 gradient-secondary">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded-full glass-effect text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Star className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 w-4" />
            ¡MVP Completo Disponible!
          </div>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">
            ¿Listo para experimentar el futuro de los hábitos?
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-white mb-8 sm:mb-10 max-w-2xl mx-auto drop-shadow-md px-2">
            Descubre una nueva forma de construir hábitos con tecnología avanzada, 
            gamificación profesional y análisis detallado. Todo incluido desde el primer día.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gradient-primary text-white text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-6 shadow-glow hover:shadow-glow/60 animate-float">
              Comenzar Gratis Ahora
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="glass-dark py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="text-center">
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center justify-center">
              <Sparkles className="mr-1 sm:mr-2 h-5 w-5 sm:h-6 w-6" />
              Mentaly
            </h4>
            <p className="text-white drop-shadow-sm text-sm sm:text-base">
              Tecnología avanzada para construir hábitos exitosos.
            </p>
            <p className="text-white/80 mt-6 sm:mt-8 text-xs sm:text-sm drop-shadow-sm">
              &copy; 2025 Mentaly. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

