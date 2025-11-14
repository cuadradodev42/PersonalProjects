'use client';

import AuthForm from '@/components/auth/AuthForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">Mentaly</h1>
          <p className="text-gray-600">Transforma tu vida, un hábito a la vez</p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}

