import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { listingAPI } from '../../lib/api';
import { useFilterStore } from '../../lib/store';
import { toast } from 'react-toastify';

const CATEGORIES = ['All', 'Helmets', 'Cleats', 'Pads', 'Gloves', 'Uniforms', 'Training Equipment', 'Other'];
const CONDITIONS = ['All', 'Like New', 'Good', 'Fair', 'For Parts'];

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const filters = useFilterStore((state) => state.filters);
  const updateFilter = useFilterStore((state) => state.updateFilter);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        category: filters.category === 'All' ? '' : filters.category,
        condition: filters.condition === 'All' ? '' : filters.condition,
        priceMin: filters.priceMin || '',
        priceMax: filters.priceMax || '',
        location: filters.location || '',
        page: filters.page
      };
      const response = await listingAPI.getListings(params);
      setListings(response.data.listings);
    } catch (error) {
      toast.error('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Browse Equipment</h1>
          <Link href="/listings/create" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            Sell Equipment
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 bg-white p-6 rounded-lg shadow h-fit">
            <h3 className="text-lg font-bold mb-4">Filters</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Condition</label>
              <select value={filters.condition} onChange={(e) => updateFilter('condition', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {CONDITIONS.map((cond) => <option key={cond} value={cond}>{cond}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Min Price</label>
              <input type="number" placeholder="$0" value={filters.priceMin} onChange={(e) => updateFilter('priceMin', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Max Price</label>
              <input type="number" placeholder="$1000" value={filters.priceMax} onChange={(e) => updateFilter('priceMax', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input type="text" placeholder="City or ZIP" value={filters.location} onChange={(e) => updateFilter('location', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="col-span-3">
            {loading ? (
              <div className="text-center py-12">Loading listings...</div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">No listings found</div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <Link key={listing.id} href={`/listings/${listing.id}`}>
                    <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden">
                      <div className="bg-gray-200 h-40 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-lg mb-2 line-clamp-2">{listing.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{listing.category}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-600 font-bold text-lg">${listing.price}</span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">{listing.condition}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
