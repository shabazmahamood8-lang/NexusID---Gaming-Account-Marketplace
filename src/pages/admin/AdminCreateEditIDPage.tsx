import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { ImageUploader } from '../../components/ImageUploader.tsx';
import { ChevronLeft, Save, Plus, X, Gamepad2 } from 'lucide-react';

interface AdminCreateEditIDPageProps {
  id?: string;
  navigate: (path: string) => void;
  currencySymbol?: string;
}

export const AdminCreateEditIDPage: React.FC<AdminCreateEditIDPageProps> = ({
  id,
  navigate,
  currencySymbol = '৳',
}) => {
  const isEdit = Boolean(id);
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [game, setGame] = useState('PUBG Mobile');
  const [customGame, setCustomGame] = useState('');
  const [platform, setPlatform] = useState('Mobile (Android/iOS)');
  const [price, setPrice] = useState<string | number>('');
  const [originalPrice, setOriginalPrice] = useState<string | number>('');
  const [level, setLevel] = useState<string | number>('1');
  const [rank, setRank] = useState('Conqueror');
  const [region, setRegion] = useState('Asia');
  const [status, setStatus] = useState<'available' | 'reserved' | 'sold'>('available');
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      const listingId = id;
      async function loadListing() {
        try {
          setLoading(true);
          const res = await api.getListingById(listingId);
          if (res.success && res.data) {
            const d = res.data;
            setTitle(d.title || '');
            setGame(d.game || 'PUBG Mobile');
            setPlatform(d.platform || 'PC');
            setPrice(d.price || '');
            setOriginalPrice(d.originalPrice || d.price || '');
            setLevel(d.level || 1);
            setRank(d.rank || '');
            setRegion(d.region || 'Asia');
            setStatus(d.status || 'available');
            setFeatured(Boolean(d.featured));
            setDescription(d.description || '');
            setImages(d.images || []);
            setFeatures(d.features || []);
          } else {
            error('Listing not found');
            navigate('/admin/ids');
          }
        } catch (e: any) {
          error(e.message || 'Error loading listing');
        } finally {
          setLoading(false);
        }
      }
      loadListing();
    }
  }, [id, isEdit]);

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !rank.trim() || !description.trim()) {
      error('Please complete title, price, rank, and description');
      return;
    }

    const finalGame = game === 'Other' ? customGame.trim() || 'General' : game;

    const payload = {
      title,
      game: finalGame,
      platform,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      level,
      rank,
      region,
      status,
      featured,
      description,
      images,
      features,
    };

    try {
      setIsSubmitting(true);
      if (isEdit && id) {
        const res = await api.updateListing(id, payload);
        if (res.success) {
          success('Gaming ID updated successfully!');
          navigate('/admin/ids');
        } else {
          error(res.message || 'Failed to update listing');
        }
      } else {
        const res = await api.createListing(payload);
        if (res.success) {
          success('New Gaming ID created and listed!');
          navigate('/admin/ids');
        } else {
          error(res.message || 'Failed to create listing');
        }
      }
    } catch (err: any) {
      error(err.message || 'Error submitting listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
        Loading listing details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={() => navigate('/admin/ids')}
            className="text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1 mb-1 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Inventory
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isEdit ? 'Edit Gaming ID Listing' : 'Create New Gaming ID Listing'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Fill in account specifications, set the authoritative price, and upload screenshots via Cloudinary.
          </p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Info */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Basic Information
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Listing Headline / Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. PUBG Mobile - Conqueror S19 | Glacier M416 Lv.7 Max"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Game *</label>
              <select
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="PUBG Mobile">PUBG Mobile</option>
                <option value="Valorant">Valorant</option>
                <option value="Free Fire">Free Fire</option>
                <option value="Call of Duty Mobile">Call of Duty Mobile</option>
                <option value="GTA V Online">GTA V Online</option>
                <option value="Clash of Clans">Clash of Clans</option>
                <option value="CS2">Counter-Strike 2</option>
                <option value="Other">Other Game</option>
              </select>
              {game === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter game title"
                  value={customGame}
                  onChange={(e) => setCustomGame(e.target.value)}
                  className="mt-2 w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Platform *</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Mobile (Android/iOS)">Mobile (Android/iOS)</option>
                <option value="PC">PC (Steam / Riot / Epic)</option>
                <option value="PlayStation">PlayStation (PS4/PS5)</option>
                <option value="Xbox">Xbox</option>
                <option value="Cross-Platform">Cross-Platform</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Server / Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. Asia, Global, NA"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Selling Price ({currencySymbol}) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15000"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Original Price ({currencySymbol})
              </label>
              <input
                type="number"
                min={0}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="20000"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Competitive Rank *</label>
              <input
                type="text"
                required
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. Radiant, Conqueror"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Account Level</label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g. 75"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Listing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="available">Available (Accepting Orders)</option>
                <option value="reserved">Reserved (Order under Escrow)</option>
                <option value="sold">Sold Out (Orders Disabled)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
                <span>Feature on Homepage Spotlight</span>
              </label>
            </div>
          </div>
        </div>

        {/* Cloudinary Image Upload Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Key Features Bullet List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <label className="block text-xs font-bold text-white uppercase tracking-wider font-mono">
            Key Inventory Features & Perks
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="e.g. Glacier M416 Lv.7 Max, OGE Full Access, Kuronami Vandal"
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
            >
              Add Feature
            </button>
          </div>

          {features.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {features.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Description */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-2">
          <label className="block text-xs font-bold text-white uppercase tracking-wider font-mono">
            Detailed Account Description *
          </label>
          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe full inventory, skin levels, season titles, linked accounts, and handover assurances..."
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 leading-relaxed"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/ids')}
            className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Listing' : 'Publish ID Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateEditIDPage;
