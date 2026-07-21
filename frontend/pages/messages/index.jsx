import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { messageAPI } from '../../lib/api';
import { useAuthStore } from '../../lib/store';
import { toast } from 'react-toastify';

export default function Messages() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchConversations();
  }, [isAuthenticated]);

  const fetchConversations = async () => {
    try {
      const response = await messageAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-600">No conversations yet</div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => (
                <div key={conv.user_id} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/messages/${conv.user_id}`)}>
                  <p className="font-bold">User {conv.user_id}</p>
                  <p className="text-gray-600 text-sm truncate">{conv.last_message}</p>
                  <p className="text-gray-400 text-xs mt-1">{new Date(conv.last_message_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
