import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.ts';
import { IDCard, IDListingData } from '../components/IDCard.tsx';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  Gamepad2,
  Filter,
  Check,
} from 'lucide-react';

interface MarketplacePageProps {
  navigate: (path: string) => void;
  onSelectID: (id: string) => void;
  initialQuery?: string;
  currencySymbol?: string;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  navigate,
  onSelectID,
  initialQuery = '',
  currencySymbol = '৳',
}) => {
  // Parse initial query params from initialQuery
  const params = new URLSearchParams(initialQuery);

  const [search, setSearch] = useState(params.get('search') || '');
  const [selectedGame, setSelectedGame] = useState(params.get('game') || 'all');
  const [selectedPlatform, setSelectedPlatform] = useState(params.get('platform') || 'all');
  const [minPrice, setMinPrice] = useState(params.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') || '');
  const [selectedRank, setSelectedRank] = useState(params.get('rank') || 'all');
  const [selectedRegion, setSelectedRegion] = useState(params.get('region') || 'all');
  const [selectedStatus, setSelectedStatus] = useState(params.get('status') || 'all');
  const [selectedSort, setSelectedSort] = useState(params.get('sort') || 'newest');

  const [listings, setListings] = useState<IDListingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const games = [
    'PUBG Mobile',
    'Valorant',
    'Free Fire',
    'Call of Duty Mobile',
    'GTA V Online',
    'Clash of Clans',
    'CS2',
  ];

  const platforms = ['PC', 'Mobile', 'PlayStation', 'Xbox'];
  const regions = ['Asia', 'Global', 'North America', 'Europe'];
  const ranks = ['Conqueror', 'Radiant', 'Immortal', 'Grandmaster', 'Legendary', 'Master', 'Heroic'];

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams: Record<string, any> = {};
      if (search.trim()) queryParams.search = search.trim();
      if (selectedGame !== 'all') queryParams.game = selectedGame;
      if (selectedPlatform !== 'all') queryParams.platform = selectedPlatform;
      if (minPrice) queryParams.minPrice = minPrice;
      if (maxPrice) queryParams.maxPrice = maxPrice;
      if (selectedRank !== 'all') queryParams.rank = selectedRank;
      if (selectedRegion !== 'all') queryParams.region = selectedRegion;
      if (selectedStatus !== 'all') queryParams.status = selectedStatus;
      if (selectedSort) queryParams.sort = selectedSort;

      const res = await api.getListings(queryParams);
      if (res.success && res.data) {
        setListings(res.data);
      }
    } catch (e) {
      console.error('Failed to load listings:', e);
    } finally {
      setLoading(false);
    }
  }, [
    search,
    selectedGame,
    selectedPlatform,
    minPrice,
    maxPrice,
    selectedRank,
    selectedRegion,
    selectedStatus,
    selectedSort,
  ]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedGame('all');
    setSelectedPlatform('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedRank('all');
    setSelectedRegion('all');
    setSelectedStatus('all');
    setSelectedSort('newest');
  };

  const hasActiveFilters =
    search !== '' ||
    selectedGame !== 'all' ||
    selectedPlatform !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    selectedRank !== 'all' ||
    selectedRegion !== 'all' ||
    selectedStatus !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            Verified Gaming Accounts
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">ID Marketplace</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse through authentic IDs with verified inventories and secure escrow handover.
          </p>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by game, title, or rank..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="md:hidden px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filter Sidebar */}
        <div
          className={`lg:block ${
            filterDrawerOpen ? 'block fixed inset-0 z-50 p-4 bg-slate-950/90 overflow-y-auto' : 'hidden'
          } lg:static lg:bg-transparent lg:p-0 space-y-6`}
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Filter Listings</h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
              {filterDrawerOpen && (
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="lg:hidden text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Game Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Game Title</label>
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Games</option>
                {games.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Platforms</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Price Range ({currencySymbol})</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Rank */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Target Rank</label>
              <select
                value={selectedRank}
                onChange={(e) => setSelectedRank(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Any Rank</option>
                {ranks.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Server / Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Regions</option>
                {regions.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Availability</label>
              <div className="flex flex-col gap-1.5 text-xs text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="statusFilter"
                    checked={selectedStatus === 'all'}
                    onChange={() => setSelectedStatus('all')}
                    className="accent-emerald-500"
                  />
                  <span>All Listings</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="statusFilter"
                    checked={selectedStatus === 'available'}
                    onChange={() => setSelectedStatus('available')}
                    className="accent-emerald-500"
                  />
                  <span>Available Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="statusFilter"
                    checked={selectedStatus === 'sold'}
                    onChange={() => setSelectedStatus('sold')}
                    className="accent-emerald-500"
                  />
                  <span>Sold Only</span>
                </label>
              </div>
            </div>

            {filterDrawerOpen && (
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Apply Filters & Close
              </button>
            )}
          </div>
        </div>

        {/* Listings Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting and Result Count Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs">
            <span className="text-slate-400 font-mono">
              Showing <strong className="text-white">{listings.length}</strong> gaming ID{listings.length !== 1 ? 's' : ''}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Sort by:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="level_desc">Account Level: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid or Empty/Loading state */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-4 animate-pulse">
                  <div className="aspect-[16/10] bg-slate-800 rounded-xl" />
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20 border border-slate-800 rounded-3xl bg-slate-900/20 p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 text-slate-500 flex items-center justify-center mx-auto">
                <Gamepad2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">No gaming IDs match your criteria</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your price range, choosing another game category, or resetting all filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <IDCard
                  key={item._id}
                  listing={item}
                  onSelect={onSelectID}
                  currencySymbol={currencySymbol}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
