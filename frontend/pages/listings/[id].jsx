import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { listingAPI, messageAPI } from '../../lib/api';
import { useAuthStore } from '../../lib/store';
import { toast } from 'react-toastify';

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.user?.userId);

  useEffect(() => {
    if (id) fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await listingAPI.getListingById(id);
      setListing(response.data);
    } catch (error) {
      toast.error('Failed to fetch listing');
      router.push('/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to send a message');
      router.push('/auth/login');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    try {
      await messageAPI.sendMessage({
        recipientId: listing.user_id,
        listingId: listing.id,
        message
      });
      toast.success('Message sent successfully!');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!listing) return <div className="text-center py-12">Listing not found</div>;

  const isOwner = userId === listing.user_id;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-2 gap-8 p-8">
            <div className="bg-gray-200 h-96 flex items-center justify-center rounded-lg">
              <span className="text-gray-400">No Image</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
              <p className="text-gray-600 mb-4">{listing.description}</p>
              <div className="mb-6 space-y-2">
                <p><strong>Category:</strong> {listing.category}</p>
                <p><strong>Condition:</strong> {listing.condition}</p>
                <p><strong>Location:</strong> {listing.location}</p>
                {listing.price && <p className="text-2xl font-bold text-blue-600">${listing.price}</p>}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-bold mb-2">Seller Information</h3>
                <p>{listing.first_name} {listing.last_name}</p>
                <p className="text-yellow-500">⭐ {listing.average_rating || 'No ratings'}</p>
              </div>
              {!isOwner && isAuthenticated && (
                <div className="space-y-4">
                  <textarea placeholder="Send a message to the seller..." value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" />
                  <button onClick={handleSendMessage} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                    Send Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
