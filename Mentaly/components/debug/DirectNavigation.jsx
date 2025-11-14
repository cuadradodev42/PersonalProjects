'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function DirectNavigation() {
  const router = useRouter();
  const { user } = useAuth();

  const handleDirectNavigation = () => {
    console.log('DirectNavigation - Current user:', user?.email);
    console.log('DirectNavigation - Attempting direct navigation to dashboard');

    // Método directo: navegar inmediatamente
    router.push('/dashboard');
  };

  if (!user) {
    return null; // Solo mostrar si el usuario está autenticado
  }

  return (
    <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
      <h3 className="font-bold mb-2">✅ Usuario Autenticado</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>ID:</strong> {user.uid?.substring(0, 8)}...</p>
        <Button
          onClick={handleDirectNavigation}
          size="sm"
          className="w-full"
        >
          Ir al Dashboard
        </Button>
      </div>
    </div>
  );
}

