import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { IDCard, IDListingData } from '../components/IDCard.tsx';
import {
  ShieldCheck,
  Zap,
  Lock,
  Headphones,
  CheckCircle2,
  ChevronRight,
  Star,
  Gamepad2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Layers,
  Coins,
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
  onSelectID: (id: string) => void;
  currencySymbol?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onSelectID, currencySymbol = '৳' }) => {
  const [featuredListings, setFeaturedListings] = useState<IDListingData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [listingsRes, catsRes, revsRes] = await Promise.all([
          api.getListings({ limit: 6, sort: 'newest' }),
          api.getCategories(),
          api.getReviews(undefined, true),
        ]);

        if (listingsRes.success && listingsRes.data) {
          setFeaturedListings(listingsRes.data);
        }
        if (catsRes.success && catsRes.data) {
          setCategories(catsRes.data);
        }
        if (revsRes.success && revsRes.data) {
          setReviews(revsRes.data.slice(0, 4));
        }
      } catch (e) {
        console.error('Error fetching homepage data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const faqs = [
    {
      q: 'How does the NexusID escrow and account handover work?',
      a: 'When you place an order and submit payment details, our admin escrow team secures your payment and verifies the seller credentials. The login credentials, backup codes, and email transfer steps are then securely delivered directly to your customer dashboard. The seller is only compensated once you verify full ownership.',
    },
    {
      q: 'Can the original owner recover or pull back the account?',
      a: 'No. Every gaming ID listed on NexusID comes with 100% changeable email & phone numbers or dedicated creation email (OGE). We provide a guaranteed recovery warranty and blacklist any compromised sellers immediately.',
    },
    {
      q: 'What payment methods can I use?',
      a: 'We support local instant mobile banking including bKash (Personal/Merchant), Nagad (Personal), Bank Wire Transfers, as well as international card payments via Stripe.',
    },
    {
      q: 'How fast do I receive the account details?',
      a: 'Average delivery takes between 5 to 30 minutes once your payment transaction ID is validated by our verification team.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Status kicker (Unboxed clean text) */}
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Verified Escrow Protection</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>100% Safe Account Transfer</span>
            </div>

            {/* Exact PRD Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Gaming ID</span>
            </h1>

            {/* Exact PRD Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Premium gaming IDs at affordable prices. Browse available accounts and find the right one for your budget.
            </p>

            {/* Buttons per PRD */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/ids')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group"
              >
                Browse IDs
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/60 text-slate-200 font-semibold text-sm transition-all hover:bg-slate-900"
              >
                Contact Us
              </button>
            </div>

            {/* Trust Assurance Grid */}
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800/80 text-left">
              <div className="p-3">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block font-mono">100% Ban-Free</span>
                <span className="text-xs text-slate-400">Pre-screened anti-cheat status</span>
              </div>
              <div className="p-3">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block font-mono">Instant Handover</span>
                <span className="text-xs text-slate-400">Credentials delivered safely</span>
              </div>
              <div className="p-3">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block font-mono">Verified Sellers</span>
                <span className="text-xs text-slate-400">Direct ID proof & background checks</span>
              </div>
              <div className="p-3">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block font-mono">24/7 Live Support</span>
                <span className="text-xs text-slate-400">WhatsApp & desk assistance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR GAMES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Popular Games</h2>
            <p className="text-xs text-slate-400 mt-1">Explore verified IDs by title and competitive rank</p>
          </div>
          <button
            onClick={() => navigate('/ids')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            All Games <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => navigate(`/ids?game=${encodeURIComponent(cat.name)}`)}
              className="group p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all text-left flex flex-col justify-between h-32"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-xs truncate group-hover:text-emerald-300">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  {cat.gameCount || 10}+ IDs Available
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. FEATURED IDS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HANDPICKED & VERIFIED</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Featured Gaming IDs</h2>
          </div>
          <button
            onClick={() => navigate('/ids')}
            className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all"
          >
            View All ({featuredListings.length}+)
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-4 animate-pulse">
                <div className="aspect-[16/10] bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : featuredListings.length === 0 ? (
          <div className="text-center py-16 border border-slate-800 rounded-2xl bg-slate-900/30">
            <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No gaming IDs available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <IDCard
                key={listing._id}
                listing={listing}
                onSelect={onSelectID}
                currencySymbol={currencySymbol}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Unmatched Reliability</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Why Gamers Trust NexusID</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Buying game accounts used to be risky with scam Facebook groups. We established a military-grade escrow system so you never lose your money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">Full Escrow Protection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your funds stay locked in our secure escrow. The seller doesn't get paid until you confirm that you have logged into the account, changed the password, and added your 2FA security.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">Fast Handover Protocol</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No endless waiting in chat groups. Once your payment is confirmed, credential packets with instructions, primary email access, and backup codes are shared instantly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">Permanent Ownership Warranty</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We exclusively list IDs where the primary email (OGE) or social linking is transferable. If any issue occurs with account ownership, our dispute resolution team handles refunds.
            </p>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Simple 4-Step Process</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">How It Works</h2>
            <p className="text-xs text-slate-400 mt-2">Get your dream gaming ID in under 20 minutes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Choose Gaming ID',
                desc: 'Browse verified accounts with exact rank, weapons, skins, and transparent pricing.',
              },
              {
                step: '02',
                title: 'Place Escrow Order',
                desc: 'Fill your contact details and submit payment via bKash, Nagad, Stripe, or Bank transfer.',
              },
              {
                step: '03',
                title: 'Receive Credentials',
                desc: 'Get login credentials, backup codes, and transfer instructions in your customer dashboard.',
              },
              {
                step: '04',
                title: 'Verify & Play',
                desc: 'Change account email and password to yours, confirm delivery, and enjoy your game!',
              },
            ].map((item) => (
              <div key={item.step} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 relative">
                <span className="text-2xl font-bold font-mono text-emerald-500/60 block">{item.step}</span>
                <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Verified Buyer Feedback</span>
            <h2 className="text-2xl font-bold text-white mt-1">Customer Reviews</h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <strong className="text-white">4.9 / 5.0</strong>
            <span className="text-slate-500">from 180+ buyers</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev._id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center uppercase">
                      {rev.userName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{rev.userName}</h4>
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <div className="text-[10px] text-slate-500 font-mono pt-1">
                  Ordered on NexusID
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10 rounded-2xl bg-slate-900/30 border border-slate-800">
              <p className="text-xs text-slate-400">All customer reviews will display here after order completion.</p>
            </div>
          )}
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-2xl font-bold text-white mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-emerald-400"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border border-emerald-500/30 p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Level Up Your Game?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Join hundreds of happy gamers who bought verified PUBG, Valorant, and Free Fire accounts without risking a single penny.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/ids')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all"
            >
              Browse Available IDs
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/80 text-white font-semibold text-sm transition-all"
            >
              Inquire via WhatsApp
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
