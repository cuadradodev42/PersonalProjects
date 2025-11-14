'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function NavigationTest() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleTestNavigation = () => {
    console.log('NavigationTest - Current user:', user?.email);
    console.log('NavigationTest - Current loading:', loading);
    console.log('NavigationTest - Attempting navigation to dashboard');

    // Probar diferentes métodos de navegación
    try {
      // Método 1: window.location.href (recarga completa)
      console.log('NavigationTest - Using window.location.href');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('NavigationTest - window.location.href failed:', error);

      // Método 2: router.push como fallback
      try {
        console.log('NavigationTest - Using router.push as fallback');
        router.push('/dashboard');
      } catch (error2) {
        console.error('NavigationTest - router.push also failed:', error2);
      }
    }
  };

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
      <h3 className="font-bold mb-2">🧪 Navigation Test</h3>
      <div className="space-y-2 text-sm">
        <p><strong>User:</strong> {user?.email || 'Not logged in'}</p>
        <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
        <p><strong>Authenticated:</strong> {user ? '✅ Yes' : '❌ No'}</p>
        <Button
          onClick={handleTestNavigation}
          size="sm"
          className="mt-2"
        >
          Test Dashboard Navigation
        </Button>
      </div>
    </div>
  );
}

