import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { listingAPI } from '../../lib/api';
import { useAuthStore } from '../../lib/store';
import { toast } from 'react-toastify';

const CATEGORIES = ['Helmets', 'Cleats', 'Pads', 'Gloves', 'Uniforms', 'Training Equipment', 'Other'];
const CONDITIONS = ['Like New', 'Good', 'Fair', 'For Parts'];

export default function CreateListing() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await listingAPI.createListing({
        title: data.title,
        description: data.description,
        category: data.category,
        condition: data.condition,
        price: parseFloat(data.price),
        location: data.location,
        forTrade: data.forTrade === 'true'
      });
      toast.success('Listing created successfully!');
      router.push('/listings');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input {...register('title', { required: 'Title is required', maxLength: { value: 255, message: 'Max 255 characters' } })} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Riddell Speedflex Helmet" />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea {...register('description', { required: 'Description is required', minLength: { value: 10, message: 'Min 10 characters' } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe the equipment condition and details..." rows="5" />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select {...register('category', { required: 'Category is required' })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Condition</label>
                <select {...register('condition', { required: 'Condition is required' })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select condition</option>
                  {CONDITIONS.map((cond) => <option key={cond} value={cond}>{cond}</option>)}
                </select>
                {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price ($)</label>
                <input {...register('price', { required: 'Price is required', pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Invalid price' } })} type="number" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="99.99" />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input {...register('location', { required: 'Location is required' })} type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="City, State" />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Also open to trading?</label>
              <select {...register('forTrade')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="false">No, selling only</option>
                <option value="true">Yes, open to trades</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition">
              {loading ? 'Creating listing...' : 'Create Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
