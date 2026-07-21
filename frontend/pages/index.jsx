import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '../lib/store';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to CoachSwap</h1>
          <p className="text-xl mb-8 opacity-90">
            The peer-to-peer marketplace for football coaches to trade, sell, and buy used equipment
          </p>
          <div className="flex gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link href="/auth/signup">
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                    Get Started
                  </button>
                </Link>
                <Link href="/auth/login">
                  <button className="border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition">
                    Sign In
                  </button>
                </Link>
              </>
            ) : (
              <Link href="/listings">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                  Browse Equipment
                </button>
              </Link>
            )}
          </div>
        </div>
      </section>
      <section className="bg-white text-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CoachSwap?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-2">Coaches Connect</h3>
              <p>Build trust within the coaching community with verified profiles and reviews.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Save Money</h3>
              <p>Find great deals on quality used equipment and save thousands on gear.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure Trades</h3>
              <p>Safe and secure transactions with Stripe payment processing.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
