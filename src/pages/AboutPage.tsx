import React from 'react';
import { ShieldCheck, HeartHandshake, Lock, Zap, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Our Mission</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Eliminating Scam Risks in Gaming Account Trades
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          NexusID was founded by veteran competitive gamers tired of seeing players get scammed in unregulated social media groups. We built the most trustworthy gaming ID marketplace with integrated escrow protection.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Full Escrow Guarantee</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your money is held in an isolated escrow balance until you confirm you have successfully logged in, bound your personal 2FA credentials, and verified inventory items.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Pre-Screened Inventory</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every ID is audited for clean anti-cheat records, absence of third-party botting strikes, and authentic original email (OGE) ownership before going live.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Dispute & Recovery Cover</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            In the rare event of an unexpected account retrieval or seller misconduct, our mediation team steps in with full refund guarantees or replacement IDs.
          </p>
        </div>
      </div>

      {/* Verification Protocol */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Our 4-Stage Verification Protocol</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="font-mono text-emerald-400 uppercase font-semibold">Stage 1: Seller Verification</span>
            <p className="text-slate-400">Merchants submit verified national ID and active phone verification before listing accounts.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="font-mono text-emerald-400 uppercase font-semibold">Stage 2: Anti-Cheat Audit</span>
            <p className="text-slate-400">Match histories and ban status are verified against publisher databases (Riot Vanguard, PUBG Anti-Cheat).</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="font-mono text-emerald-400 uppercase font-semibold">Stage 3: Email Unlinking</span>
            <p className="text-slate-400">Account login credentials are confirmed to have transferable email and unlinked social networks.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="font-mono text-emerald-400 uppercase font-semibold">Stage 4: Automated Handover</span>
            <p className="text-slate-400">Credentials, one-time verification tokens, and backup codes are delivered into the buyer's encrypted dashboard.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h3 className="text-lg font-bold text-white">Ready to explore available accounts?</h3>
        <button
          onClick={() => navigate('/ids')}
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
        >
          View Verified Listings
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
