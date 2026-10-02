import React, { useState } from 'react';
import { Search, ChevronDown, HelpCircle, Gamepad2, ShieldCheck, CreditCard, Key } from 'lucide-react';

interface FAQPageProps {
  navigate: (path: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ navigate }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'escrow', label: 'Escrow & Safety' },
    { id: 'delivery', label: 'Delivery & Handover' },
    { id: 'payment', label: 'Payments & Methods' },
    { id: 'warranty', label: 'Warranty & Refunds' },
  ];

  const faqs = [
    {
      category: 'escrow',
      q: 'How does escrow protection guarantee my money is safe?',
      a: 'When you purchase an ID, your funds are deposited into NexusID escrow. We do not transfer the payment to the seller until you have successfully logged in, verified the skins/rank in-game, and changed both the email and password to your own.',
    },
    {
      category: 'escrow',
      q: 'Can the original owner retrieve the account later?',
      a: 'We only allow accounts where the primary email (OGE) can be transferred or where all social recovery options can be bound to the buyer. If any retrieval attempt ever occurs, NexusID provides full warranty coverage with account replacement or 100% money back.',
    },
    {
      category: 'delivery',
      q: 'How quickly will I receive my account credentials?',
      a: 'Orders are processed on average within 10 to 30 minutes. Once your payment transaction ID is validated by our verification team, login credentials and backup codes appear immediately in your dashboard under "My Purchased IDs".',
    },
    {
      category: 'delivery',
      q: 'What information do I receive upon delivery?',
      a: 'You receive the account username/email, current password, backup 2FA verification codes, and step-by-step instructions on how to safely link your own phone number and 2FA authenticator app.',
    },
    {
      category: 'payment',
      q: 'Which payment methods are supported on NexusID?',
      a: 'We support local mobile financial services including bKash (Personal/Merchant), Nagad (Personal), Bank Wire Transfers, as well as Visa, MasterCard, and American Express via Stripe.',
    },
    {
      category: 'payment',
      q: 'Are there hidden transaction fees?',
      a: 'No hidden fees. The price shown on the listing is the authoritative database price you pay. Mobile financial service cash-out fees depend on your local carrier/operator.',
    },
    {
      category: 'warranty',
      q: 'What is the NexusID warranty period?',
      a: 'Every verified account includes a 14-day full warranty against seller retrieval, third-party recovery, or preexisting bans. Extended warranty options can also be requested via support.',
    },
    {
      category: 'warranty',
      q: 'How do I request a refund if an account does not match the description?',
      a: 'If the delivered account has a different rank, missing skins, or login issues, simply contact our WhatsApp support within 24 hours of delivery before confirming order completion. Our team will verify and issue an immediate refund or replacement.',
    },
  ];

  const filteredFaqs = faqs.filter((f) => {
    const matchesCat = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch =
      search.trim() === '' ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Help & Answers</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Everything you need to know about purchasing, safety, payments, and account handover.
        </p>

        {/* Search */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions (e.g. escrow, bKash, delivery time)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion list */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 border border-slate-800 rounded-2xl bg-slate-900/30">
            <p className="text-xs text-slate-400">No questions match your search query.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-emerald-400 gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    openIndex === idx ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>
              {openIndex === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Still need help box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center space-y-3">
        <h3 className="text-sm font-bold text-white">Have a specific question not covered here?</h3>
        <p className="text-xs text-slate-400">Our live desk is available 24/7 on WhatsApp and email.</p>
        <button
          onClick={() => navigate('/contact')}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
        >
          Contact Support Desk
        </button>
      </div>
    </div>
  );
};

export default FAQPage;
