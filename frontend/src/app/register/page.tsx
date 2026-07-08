'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2 } from 'lucide-react';

import { API_URL } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = typeof data?.error === 'object' ? JSON.stringify(data.error) : data?.error;
        throw new Error(errorMsg || 'Registration failed');
      }
      
      localStorage.setItem('token', data.token);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="p-8 text-center bg-gradient-to-r from-blue-600 to-purple-600">
          <BrainCircuit className="w-12 h-12 mx-auto text-white mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-blue-100">Join the AI-powered learning revolution</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>
            )}

            <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
