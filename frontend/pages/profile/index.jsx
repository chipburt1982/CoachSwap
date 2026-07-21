import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { userAPI } from '../../lib/api';
import { useAuthStore } from '../../lib/store';
import { toast } from 'react-toastify';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = useAuthStore((state) => state.user?.userId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (userId) fetchProfile();
  }, [userId, isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile(userId);
      setProfile(response.data);
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!profile) return <div className="text-center py-12">Profile not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-start gap-8 mb-8">
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profile.first_name} {profile.last_name}</h1>
              <p className="text-gray-600 mb-2">{profile.email}</p>
              <p className="text-gray-600 mb-2">{profile.phone || 'No phone'}</p>
              <p className="text-gray-600 mb-4">{profile.location || 'Location not set'}</p>
              <p className="text-yellow-500 mb-4">⭐ {profile.average_rating || 'No ratings yet'}</p>
              <p className="text-gray-700 mb-4">{profile.bio || 'No bio added'}</p>
              <button onClick={() => router.push('/profile/edit')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
