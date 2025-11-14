'use client';

import { useEffect, useState } from 'react';

export default function TestFirebase() {
  const [firebaseStatus, setFirebaseStatus] = useState('Checking...');
  const [envVars, setEnvVars] = useState({});
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        // Verificar variables de entorno usando window para acceso directo
        const envInfo = {
          apiKey: window.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Not set',
          authDomain: window.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Not set',
          projectId: window.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Not set',
          storageBucket: window.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Not set',
          messagingSenderId: window.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Not set',
          appId: window.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'Set' : 'Not set',
        };

        setEnvVars(envInfo);
        console.log('Environment variables check:', envInfo);

        // Verificar si las variables críticas están configuradas
        const criticalVars = ['NEXT_PUBLIC_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'];
        const missingVars = criticalVars.filter(varName => !envInfo[varName.toLowerCase().replace('next_public_', '').replace(/_/g, '')]);

        if (missingVars.length > 0) {
          setFirebaseStatus(`Missing critical env vars: ${missingVars.join(', ')}`);
          setErrorDetails(`Please ensure these variables are properly configured in your Firebase project`);
          return;
        }

        setFirebaseStatus('Environment variables configured correctly');

        // Intentar importar Firebase dinámicamente para ver si hay errores
        try {
          const { auth, db } = await import('@/lib/firebase');

          if (auth) {
            setFirebaseStatus(prev => prev + ' | Firebase auth available');
            console.log('Firebase auth available:', !!auth);
          }

          if (db) {
            setFirebaseStatus(prev => prev + ' | Firestore available');
            console.log('Firebase db available:', !!db);
          }
        } catch (firebaseError) {
          console.error('Firebase initialization error:', firebaseError);
          setFirebaseStatus('Firebase configuration issue');
          setErrorDetails(firebaseError.message);
        }

      } catch (error) {
        console.error('General error:', error);
        setFirebaseStatus('Error checking Firebase');
        setErrorDetails(error.message);
      }
    };

    checkFirebase();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg text-xs">
      <h3 className="font-bold mb-2">Firebase Debug Info:</h3>
      <div className="space-y-2">
        <p><strong>Status:</strong> {firebaseStatus}</p>

        {errorDetails && (
          <div className="p-2 bg-red-100 border border-red-300 rounded">
            <strong>Error:</strong> {errorDetails}
          </div>
        )}

        <div>
          <strong>Environment Variables:</strong>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <div><strong>API Key:</strong> {envVars.apiKey}</div>
            <div><strong>Auth Domain:</strong> {envVars.authDomain}</div>
            <div><strong>Project ID:</strong> {envVars.projectId}</div>
            <div><strong>Storage:</strong> {envVars.storageBucket}</div>
            <div><strong>Messaging:</strong> {envVars.messagingSenderId}</div>
            <div><strong>App ID:</strong> {envVars.appId}</div>
          </div>
        </div>

        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
          <strong>Next Steps:</strong>
          <p className="mt-1">1. Verify Firebase Console configuration</p>
          <p>2. Ensure Authentication is enabled</p>
          <p>3. Ensure Firestore Database exists</p>
          <p>4. Test login functionality</p>
        </div>
      </div>
    </div>
  );
}
