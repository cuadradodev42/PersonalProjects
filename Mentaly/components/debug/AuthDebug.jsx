'use client';

import { useAuth } from '@/context/AuthContext';

export default function AuthDebug() {
  const { user, loading } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black bg-opacity-80 text-white text-xs rounded-lg max-w-sm">
      <h4 className="font-bold mb-2">🔐 Auth Debug</h4>
      <div className="space-y-1">
        <div><strong>Loading:</strong> {loading ? 'true' : 'false'}</div>
        <div><strong>User:</strong> {user ? user.email : 'null'}</div>
        <div><strong>User ID:</strong> {user?.uid || 'null'}</div>
        <div><strong>Authenticated:</strong> {user ? '✅ Yes' : '❌ No'}</div>
      </div>
    </div>
  );
}

