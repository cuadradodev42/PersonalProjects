'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/shared/Navbar';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MainLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);

  console.log('MainLayout - user:', user?.email, 'loading:', loading);

  useEffect(() => {
    console.log('MainLayout - useEffect triggered, user:', user?.email, 'loading:', loading);
    if (!loading && !user) {
      console.log('MainLayout - Redirecting to login');
      router.push('/login');
      return;
    }
    // Si hay usuario, verificar onboarding
    const check = async () => {
      if (!user) return;
      setCheckingOnboarding(true);
      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        const onboardingCompleted = snap.exists() && !!snap.data()?.onboardingCompleted;
        if (!onboardingCompleted && !location.pathname.startsWith('/onboarding')) {
          console.log('MainLayout - Redirecting to onboarding');
          router.push('/onboarding');
        }
      } finally {
        setCheckingOnboarding(false);
      }
    };
    if (!loading && user) check();
  }, [user, loading, router]);

  if (loading || checkingOnboarding) {
    console.log('MainLayout - Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center gradient-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white/80">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('MainLayout - User not authenticated, returning null');
    return null;
  }

  console.log('MainLayout - Rendering authenticated layout for user:', user.email);

  return (
    <div className="min-h-screen gradient-primary">
      <Navbar />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}

