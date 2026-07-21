import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '../lib/store';
import { useState } from 'react';

export default function Layout({ children }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    clearAuth();
    router.push('/');
  };

  return (
    <>
      <nav className="bg-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            CoachSwap
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/listings" className="hover:text-blue-400 transition">
              Browse
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/listings/create" className="hover:text-blue-400 transition">
                  Sell
                </Link>
                <Link href="/messages" className="hover:text-blue-400 transition">
                  Messages
                </Link>
                <Link href="/profile" className="hover:text-blue-400 transition">
                  Profile
                </Link>
                <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-blue-400 transition">
                  Login
                </Link>
                <Link href="/auth/signup" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 CoachSwap. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">Connecting coaches. Trading gear. Building community.</p>
        </div>
      </footer>
    </>
  );
}
