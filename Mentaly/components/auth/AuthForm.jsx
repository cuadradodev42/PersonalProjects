'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

export default function AuthForm({ mode = 'login' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const { login, signup, loginWithGoogle } = useAuth();
  const router = useRouter();

  const isLogin = mode === 'login';

  const validateForm = () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return false;
    }

    if (!isLogin && !displayName) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu nombre",
        variant: "destructive"
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un email válido",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    console.log('AuthForm - Starting authentication for:', email);

    let result;
    if (isLogin) {
      console.log('AuthForm - Attempting login');
      result = await login(email, password);
    } else {
      console.log('AuthForm - Attempting signup');
      result = await signup(email, password, displayName);
    }

    console.log('AuthForm - Auth result:', result);

    if (result.success) {
      console.log('AuthForm - Authentication successful, user:', result.user?.email);
      setIsRedirecting(true);

      toast({
        title: "¡Éxito!",
        description: isLogin ? "Has iniciado sesión correctamente" : "Tu cuenta ha sido creada",
        variant: "success"
      });

      console.log('AuthForm - Navigation to dashboard in 1 second...');

      // Usar un pequeño delay para asegurar que el contexto se actualice
      setTimeout(() => {
        console.log('AuthForm - Executing navigation to dashboard');
        window.location.href = '/dashboard';
      }, 1000);
    } else {
      console.error('AuthForm - Authentication failed:', result.error);
      toast({
        title: "Error",
        description: result.error || "Ocurrió un error. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    console.log('AuthForm - Starting Google authentication');

    const result = await loginWithGoogle();

    if (result.success) {
      console.log('AuthForm - Google authentication successful, user:', result.user?.email);
      setIsRedirecting(true);

      toast({
        title: "¡Éxito!",
        description: "Has iniciado sesión con Google",
        variant: "success"
      });

      console.log('AuthForm - Google navigation to dashboard in 1 second...');

      // Usar un pequeño delay para asegurar que el contexto se actualice
      setTimeout(() => {
        console.log('AuthForm - Executing Google navigation to dashboard');
        window.location.href = '/dashboard';
      }, 1000);
    } else {
      console.error('AuthForm - Google authentication failed:', result.error);
      toast({
        title: "Error",
        description: result.error || "No se pudo iniciar sesión con Google",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </CardTitle>
        <CardDescription className="text-center">
          {isLogin 
            ? 'Ingresa a tu cuenta de Mentaly' 
            : 'Comienza tu viaje de crecimiento personal'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="displayName">Nombre</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Tu nombre"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isLoading || isRedirecting}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isRedirecting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isRedirecting}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isRedirecting}
          >
            {isRedirecting
              ? 'Redirigiendo...'
              : isLoading
                ? 'Cargando...'
                : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              O continúa con
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isLoading || isRedirecting}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <a 
            href={isLogin ? '/signup' : '/login'} 
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </a>
        </p>
      </CardContent>
    </Card>
  );
}

