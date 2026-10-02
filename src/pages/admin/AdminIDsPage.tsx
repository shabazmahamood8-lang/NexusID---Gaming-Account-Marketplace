import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Zap,
  Gamepad2,
  ExternalLink,
  ChevronLeft,
} from 'lucide-react';

interface AdminIDsPageProps {
  navigate: (path: string) => void;
  currencySymbol?: string;
}

export const AdminIDsPage: React.FC<AdminIDsPageProps> = ({
  navigate,
  currencySymbol = '৳',
}) => {
  const { success, error } = useToast();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('all');

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api.getListings();
      if (res.success && res.data) {
        setListings(res.data);
      }
    } catch (e) {
      console.error('Failed to load listings for admin:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    try {
      const res = await api.deleteListing(id);
      if (res.success) {
        success('Listing deleted successfully');
        setListings((prev) => prev.filter((item) => item._id !== id));
      } else {
        error(res.message || 'Failed to delete listing');
      }
    } catch (err: any) {
      error(err.message || 'Error deleting listing');
    }
  };

  const handleToggleSold = async (item: any) => {
    const nextStatus = item.status === 'sold' ? 'available' : 'sold';
    try {
      const res = await api.updateListing(item._id, { status: nextStatus });
      if (res.success) {
        success(`Status updated to ${nextStatus.toUpperCase()}`);
        setListings((prev) =>
          prev.map((l) => (l._id === item._id ? { ...l, status: nextStatus } : l))
        );
      } else {
        error(res.message || 'Failed to update status');
      }
    } catch (err: any) {
      error(err.message || 'Error updating status');
    }
  };

  const handleToggleFeatured = async (item: any) => {
    const nextFeatured = !item.featured;
    try {
      const res = await api.updateListing(item._id, { featured: nextFeatured });
      if (res.success) {
        success(`Listing is now ${nextFeatured ? 'Featured' : 'Standard'}`);
        setListings((prev) =>
          prev.map((l) => (l._id === item._id ? { ...l, featured: nextFeatured } : l))
        );
      } else {
        error(res.message || 'Failed to update featured state');
      }
    } catch (err: any) {
      error(err.message || 'Error updating featured state');
    }
  };

  const filtered = listings.filter((item) => {
    const matchesGame = gameFilter === 'all' || item.game === gameFilter;
    const matchesSearch =
      search.trim() === '' ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.game.toLowerCase().includes(search.toLowerCase()) ||
      item.rank.toLowerCase().includes(search.toLowerCase());
    return matchesGame && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={() => navigate('/admin')}
            className="text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1 mb-1 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gaming ID Inventory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, edit, toggle availability, and moderate gaming account listings.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/ids/create')}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          Create New ID Listing
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, rank, game..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Game:</span>
          <select
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Games</option>
            <option value="PUBG Mobile">PUBG Mobile</option>
            <option value="Valorant">Valorant</option>
            <option value="Free Fire">Free Fire</option>
            <option value="Call of Duty Mobile">COD Mobile</option>
            <option value="GTA V Online">GTA V Online</option>
            <option value="Clash of Clans">Clash of Clans</option>
          </select>
        </div>
      </div>

      {/* Table of Listings */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-2">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading database inventory...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No gaming IDs match your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-mono text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Game & Platform</th>
                  <th className="py-3 px-4">Rank / Level</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=100&q=80'}
                          alt={item.title}
                          className="w-12 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div className="max-w-[220px]">
                          <h4 className="font-semibold text-white truncate">{item.title}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {item._id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="text-emerald-400 font-semibold block">{item.game}</span>
                      <span className="text-[11px] text-slate-500">{item.platform}</span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="text-white block font-semibold">{item.rank}</span>
                      <span className="text-[11px] text-slate-500">Lv. {item.level}</span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="text-emerald-400 font-bold block tabular-nums">
                        {currencySymbol}{item.price?.toLocaleString()}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-[10px] text-slate-500 line-through tabular-nums">
                          {currencySymbol}{item.originalPrice?.toLocaleString()}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleSold(item)}
                        className={`px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase transition-all ${
                          item.status === 'sold'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40 hover:bg-rose-900'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                        }`}
                        title="Click to toggle Available / Sold"
                      >
                        {item.status}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          item.featured
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-slate-400'
                        }`}
                        title="Toggle Featured on Homepage"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/ids/${item._id}/edit`)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="Edit Listing"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.title)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-200 hover:text-white transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/ids/${item._id}`)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white transition-colors"
                          title="View on site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminIDsPage;
