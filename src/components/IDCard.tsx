import React from 'react';
import { ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export interface IDListingData {
  _id: string;
  title: string;
  game: string;
  platform: string;
  price: number;
  originalPrice: number;
  images: string[];
  description: string;
  level: number | string;
  rank: string;
  region: string;
  features?: string[];
  status: 'available' | 'reserved' | 'sold';
  featured?: boolean;
  seller?: {
    name: string;
    rating: number;
    verified: boolean;
  };
}

interface IDCardProps {
  listing: IDListingData;
  onSelect: (id: string) => void;
  currencySymbol?: string;
}

export const IDCard: React.FC<IDCardProps> = ({ listing, onSelect, currencySymbol = '৳' }) => {
  const isSold = listing.status === 'sold';
  const isReserved = listing.status === 'reserved';
  const discount =
    listing.originalPrice > listing.price
      ? Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)
      : 0;

  const defaultImage =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      onClick={() => onSelect(listing._id)}
      className={`group relative flex flex-col rounded-2xl bg-slate-900/80 border transition-all duration-200 cursor-pointer overflow-hidden ${
        isSold
          ? 'border-slate-800/80 opacity-75 hover:opacity-90'
          : 'border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/30'
      }`}
    >
      {/* Thumbnail Aspect Box */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={defaultImage}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges: Game, Featured, and Status */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded bg-slate-950/90 border border-slate-700/80 text-emerald-400 backdrop-blur-md">
            {listing.game}
          </span>

          <div className="flex items-center gap-1.5">
            {listing.featured && !isSold && (
              <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 flex items-center gap-1 shadow-sm">
                <Zap className="w-3 h-3 fill-current" />
                Featured
              </span>
            )}
            {isSold ? (
              <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded bg-rose-600 text-white shadow-sm">
                SOLD OUT
              </span>
            ) : isReserved ? (
              <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded bg-amber-600 text-white shadow-sm">
                Reserved
              </span>
            ) : (
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-600/90 text-white shadow-sm">
                Available
              </span>
            )}
          </div>
        </div>

        {/* Bottom Metadata in Image overlay */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>Rank: <strong className="text-white font-semibold">{listing.rank}</strong></span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Lv. <strong className="text-white font-semibold">{listing.level}</strong></span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">{listing.region}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 justify-between space-y-3">
        <div>
          <h3 className="font-semibold text-white text-sm line-clamp-2 group-hover:text-emerald-300 transition-colors leading-snug">
            {listing.title}
          </h3>

          {/* Quick features snippet */}
          {listing.features && listing.features.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{listing.features[0]}</span>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                {currencySymbol}{listing.price.toLocaleString()}
              </span>
              {listing.originalPrice > listing.price && (
                <span className="text-xs font-mono text-slate-500 line-through tabular-nums">
                  {currencySymbol}{listing.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {discount > 0 && (
              <span className="text-[10px] text-emerald-400 font-medium">
                Save {discount}% OFF
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(listing._id);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSold
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 group-hover:shadow-md group-hover:shadow-emerald-500/20'
            }`}
          >
            {isSold ? 'Sold Out' : 'View ID'}
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IDCard;
