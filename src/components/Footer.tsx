import React from 'react';
import { Gamepad2, Shield, HeartHandshake, PhoneCall, Mail, MessageSquare } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
  settings?: any;
}

export const Footer: React.FC<FooterProps> = ({ navigate, settings }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
      {/* Trust Highlights Strip */}
      <div className="border-b border-slate-800/60 py-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Escrow Buyer Protection</h4>
              <p className="text-xs text-slate-400">Payment released only after full credential handover and verification.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">100% Ban-Free Warranty</h4>
              <p className="text-xs text-slate-400">Every ID is pre-screened for clean anti-cheat standing & authentic ownership.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Direct WhatsApp & Phone Support</h4>
              <p className="text-xs text-slate-400">Dedicated agents available 24/7 to facilitate smooth email/2FA transfer.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
              <Gamepad2 className="w-5 h-5 text-slate-950" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              Nexus<span className="text-emerald-400">ID</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The premier marketplace for verified gaming IDs and high-tier competitive accounts. Safe escrow transactions, instant delivery, and zero risk.
          </p>
          <div className="pt-1 flex items-center gap-3 text-xs text-slate-400 font-mono">
            <span>Powered by Better Auth & MongoDB</span>
          </div>
        </div>

        {/* Featured Games */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Popular Games</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => navigate('/ids?game=PUBG+Mobile')} className="hover:text-emerald-400 transition-colors">
                PUBG Mobile IDs (Glacier & Conqueror)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/ids?game=Valorant')} className="hover:text-emerald-400 transition-colors">
                Valorant Accounts (Radiant & Skins)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/ids?game=Free+Fire')} className="hover:text-emerald-400 transition-colors">
                Free Fire IDs (OG Sakura & Hip Hop)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/ids?game=Call+of+Duty+Mobile')} className="hover:text-emerald-400 transition-colors">
                Call of Duty Mobile (Mythic Guns)
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/ids?game=GTA+V+Online')} className="hover:text-emerald-400 transition-colors">
                GTA V Online Modded & Clean IDs
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/ids?game=Clash+of+Clans')} className="hover:text-emerald-400 transition-colors">
                Clash of Clans TH16 / TH17 Maxed
              </button>
            </li>
          </ul>
        </div>

        {/* Platform & Trust Links */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Marketplace & Help</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => navigate('/ids')} className="hover:text-emerald-400 transition-colors">
                Browse All Gaming IDs
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/about')} className="hover:text-emerald-400 transition-colors">
                About NexusID Escrow
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/faq')} className="hover:text-emerald-400 transition-colors">
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/contact')} className="hover:text-emerald-400 transition-colors">
                Contact Support Desk
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/dashboard')} className="hover:text-emerald-400 transition-colors">
                Customer Dashboard
              </button>
            </li>
          </ul>
        </div>

        {/* Payment & Channels */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Accepted Payment Methods</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              bKash (Personal/Merchant)
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              Nagad (Personal)
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              Stripe (Visa / MC)
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              Bank Wire Transfer
            </span>
          </div>

          <div className="pt-2 text-xs space-y-1">
            <p className="text-slate-400">
              WhatsApp Support:{' '}
              <a
                href={`https://wa.me/${(settings?.whatsappNumber || '8801700000000').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline"
              >
                {settings?.whatsappNumber || '+880 1700-000000'}
              </a>
            </p>
            <p className="text-slate-400">
              Email:{' '}
              <a href={`mailto:${settings?.supportEmail || 'support@nexusid.store'}`} className="text-slate-300 hover:underline">
                {settings?.supportEmail || 'support@nexusid.store'}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-slate-800/60 py-5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} NexusID Marketplace. All game trademarks belong to their respective publishers.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/about')} className="hover:text-slate-400">Terms of Service</button>
            <span>·</span>
            <button onClick={() => navigate('/about')} className="hover:text-slate-400">Privacy Policy</button>
            <span>·</span>
            <button onClick={() => navigate('/about')} className="hover:text-slate-400">Refund Guarantee</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
