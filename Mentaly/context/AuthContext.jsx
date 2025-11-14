'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Setting up auth state listener');

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('AuthContext: Auth state changed - user:', user?.email, 'uid:', user?.uid);

      if (user) {
        console.log('AuthContext: User authenticated, creating/updating Firestore document');
        // Verificar si el documento del usuario existe, si no, crearlo
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          console.log('AuthContext: Creating new user document in Firestore');
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            createdAt: new Date(),
          });
        } else {
          console.log('AuthContext: User document already exists');
        }

        console.log('AuthContext: Setting user state');
        setUser(user);
      } else {
        console.log('AuthContext: No user authenticated');
        setUser(null);
      }
      console.log('AuthContext: Setting loading to false');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Registro con email y contraseña
  const signup = async (email, password, displayName = '') => {
    try {
      console.log('AuthContext: Attempting signup for', email);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Crear documento del usuario en Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName: displayName,
        photoURL: '',
        createdAt: new Date(),
      });

      console.log('AuthContext: Signup successful');
      return { success: true, user: result.user };
    } catch (error) {
      console.error('AuthContext: Error signing up:', error);
      return { success: false, error: error.message };
    }
  };

  // Inicio de sesión con email y contraseña
  const login = async (email, password) => {
    try {
      console.log('AuthContext: Attempting login for', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthContext: Login successful');
      return { success: true, user: result.user };
    } catch (error) {
      console.error('AuthContext: Error logging in:', error);
      return { success: false, error: error.message };
    }
  };

  // Inicio de sesión con Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Verificar si el documento del usuario existe, si no, crearlo
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: result.user.email,
          displayName: result.user.displayName || '',
          photoURL: result.user.photoURL || '',
          createdAt: new Date(),
        });
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Error logging in with Google:', error);
      return { success: false, error: error.message };
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

