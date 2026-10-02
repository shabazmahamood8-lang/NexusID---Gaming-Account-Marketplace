import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { OrderModal } from '../components/OrderModal.tsx';
import { IDListingData } from '../components/IDCard.tsx';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronLeft,
  Share2,
  MessageCircle,
  Star,
  Lock,
  HeartHandshake,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface IDDetailsPageProps {
  id: string;
  navigate: (path: string) => void;
  currencySymbol?: string;
  settings?: any;
}

export const IDDetailsPage: React.FC<IDDetailsPageProps> = ({
  id,
  navigate,
  currencySymbol = '৳',
  settings,
}) => {
  const { user } = useAuth();
  const [listing, setListing] = useState<IDListingData | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadListing() {
      try {
        setLoading(true);
        const [listingRes, revsRes] = await Promise.all([
          api.getListingById(id),
          api.getReviews(id, true),
        ]);

        if (listingRes.success && listingRes.data) {
          setListing(listingRes.data);
        }
        if (revsRes.success && revsRes.data) {
          setReviews(revsRes.data);
        }
      } catch (err) {
        console.error('Failed to load listing details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadListing();
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleBuyClick = () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(`/ids/${id}`));
      return;
    }
    setOrderModalOpen(true);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-xs">Loading gaming ID details from database...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-white">Gaming ID Not Found</h2>
        <p className="text-xs text-slate-400">
          This account listing may have been removed or does not exist.
        </p>
        <button
          onClick={() => navigate('/ids')}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const isSold = listing.status === 'sold';
  const discount =
    listing.originalPrice > listing.price
      ? Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)
      : 0;

  const images = listing.images && listing.images.length > 0 ? listing.images : [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/ids')}
          className="text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Listings
        </button>

        <button
          onClick={handleShare}
          className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-400" />
          {copiedLink ? 'Link Copied!' : 'Share Account'}
        </button>
      </div>

      {/* Main Grid: Gallery & Order Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery & Description (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Gallery Display */}
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative aspect-[16/10] shadow-2xl">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            {isSold && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center">
                <span className="px-6 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-base tracking-widest uppercase shadow-2xl">
                  SOLD OUT
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-950'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Account Key Features List */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Key Account Features & Inventory
            </h3>
            {listing.features && listing.features.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {listing.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">All standard account privileges and items included.</p>
            )}
          </div>

          {/* Account Description */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Account Overview & Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Reviews Section */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Verified Buyer Reviews ({reviews.length})
              </h3>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-3 pt-2">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{rev.userName}</span>
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No reviews yet for this particular ID. Verified reviews are posted by customers once their order status is confirmed as delivered.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Pricing, Specs & Purchase Box (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 sticky top-20">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
                <span className="text-emerald-400 uppercase font-semibold">{listing.game}</span>
                <span>Platform: {listing.platform}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {listing.title}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Verified Escrow Price</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                    {currencySymbol}{listing.price.toLocaleString()}
                  </span>
                  {listing.originalPrice > listing.price && (
                    <span className="text-sm font-mono text-slate-500 line-through tabular-nums">
                      {currencySymbol}{listing.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {discount > 0 && (
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Competitive Rank</span>
                <span className="font-semibold text-white mt-0.5 block">{listing.rank}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Account Level</span>
                <span className="font-semibold text-white mt-0.5 block font-mono">Lv. {listing.level}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Server / Region</span>
                <span className="font-semibold text-white mt-0.5 block">{listing.region}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Availability</span>
                <span className={`font-semibold mt-0.5 block ${isSold ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isSold ? 'SOLD OUT' : 'Available for Instant Transfer'}
                </span>
              </div>
            </div>

            {/* Verified Seller Box */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{listing.seller?.name || 'Nexus Verified Seller'}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">Escrow Guaranteed Merchant</span>
                </div>
              </div>
              <div className="flex items-center gap-1 font-mono text-amber-400 font-semibold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{listing.seller?.rating || 4.9}</span>
              </div>
            </div>

            {/* CTAs per PRD */}
            <div className="space-y-3">
              {isSold ? (
                <button
                  disabled
                  className="w-full py-4 rounded-xl bg-slate-800 text-slate-400 font-bold text-sm cursor-not-allowed uppercase tracking-wider"
                >
                  SOLD OUT — Orders Disabled
                </button>
              ) : (
                <button
                  onClick={handleBuyClick}
                  className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
                >
                  Buy This ID
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}

              <a
                href={`https://wa.me/${(settings?.whatsappNumber || '8801700000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hi NexusID, I want to inquire about: ${listing.title} (ID: ${listing._id})`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-950 text-slate-200 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Contact Seller on WhatsApp
              </a>
            </div>

            {/* Buyer Protection Guarantee Notice */}
            <div className="border-t border-slate-800/80 pt-4 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Your money is held in escrow until you verify login & full password access.</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Average delivery time: 10 - 20 minutes after payment verification.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {orderModalOpen && (
        <OrderModal
          listing={listing}
          settings={settings}
          onClose={() => setOrderModalOpen(false)}
          onSuccess={(orderId) => {
            setOrderModalOpen(false);
            navigate('/dashboard/orders');
          }}
        />
      )}
    </div>
  );
};

export default IDDetailsPage;
