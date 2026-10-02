import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { Settings, Save, ChevronLeft, CreditCard, PhoneCall, Megaphone } from 'lucide-react';

interface AdminSettingsPageProps {
  navigate: (path: string) => void;
}

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ navigate }) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings State
  const [siteName, setSiteName] = useState('NexusID');
  const [tagline, setTagline] = useState('Premium Gaming ID Marketplace');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [bannerText, setBannerText] = useState('');

  // Payment instructions
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashType, setBkashType] = useState('Personal (Send Money)');
  const [bkashNote, setBkashNote] = useState('');

  const [nagadNumber, setNagadNumber] = useState('');
  const [nagadType, setNagadType] = useState('Personal (Send Money)');
  const [nagadNote, setNagadNote] = useState('');

  const [stripeNote, setStripeNote] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branch, setBranch] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await api.getSettings();
        if (res.success && res.data) {
          const s = res.data;
          setSiteName(s.siteName || 'NexusID');
          setTagline(s.tagline || '');
          setSupportEmail(s.supportEmail || '');
          setSupportPhone(s.supportPhone || '');
          setWhatsappNumber(s.whatsappNumber || '');
          setFacebookUrl(s.facebookUrl || '');
          setBannerEnabled(s.announcementBanner?.enabled ?? true);
          setBannerText(s.announcementBanner?.text || '');

          const p = s.paymentInstructions || {};
          setBkashNumber(p.bkash?.number || '01712345678');
          setBkashType(p.bkash?.type || 'Personal (Send Money)');
          setBkashNote(p.bkash?.note || '');

          setNagadNumber(p.nagad?.number || '01812345678');
          setNagadType(p.nagad?.type || 'Personal (Send Money)');
          setNagadNote(p.nagad?.note || '');

          setStripeNote(p.stripeNote || '');

          setBankName(p.bankTransfer?.bankName || '');
          setAccountName(p.bankTransfer?.accountName || '');
          setAccountNumber(p.bankTransfer?.accountNumber || '');
          setBranch(p.bankTransfer?.branch || '');
        }
      } catch (e: any) {
        error(e.message || 'Error loading settings');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload = {
        siteName,
        tagline,
        supportEmail,
        supportPhone,
        whatsappNumber,
        facebookUrl,
        announcementBanner: {
          enabled: bannerEnabled,
          text: bannerText,
          link: '/ids',
        },
        paymentInstructions: {
          bkash: {
            number: bkashNumber,
            type: bkashType,
            note: bkashNote,
          },
          nagad: {
            number: nagadNumber,
            type: nagadType,
            note: nagadNote,
          },
          stripeNote,
          bankTransfer: {
            bankName,
            accountName,
            accountNumber,
            branch,
          },
        },
      };

      const res = await api.updateSettings(payload);
      if (res.success) {
        success('Site settings and payment instructions saved to MongoDB!');
      } else {
        error(res.message || 'Failed to save settings');
      }
    } catch (err: any) {
      error(err.message || 'Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
        Loading site settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={() => navigate('/admin')}
            className="text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1 mb-1 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">Marketplace Settings & Payment Config</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure payment instructions shown dynamically in the customer checkout modal and update support contacts.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Payment Instructions per PRD section 11 & 12 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">
            <CreditCard className="w-4 h-4" />
            <span>Manual & Automated Payment Instructions</span>
          </div>
          <p className="text-xs text-slate-400">
            These numbers and steps are shown to buyers when they click "Buy This ID" and select their payment method.
          </p>

          {/* bKash */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-pink-400 font-mono uppercase">bKash Configuration</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">bKash Account Number</label>
                <input
                  type="text"
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Account Type</label>
                <input
                  type="text"
                  value={bkashType}
                  onChange={(e) => setBkashType(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Instructions Note for Customer</label>
              <textarea
                rows={2}
                value={bkashNote}
                onChange={(e) => setBkashNote(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Nagad */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-orange-400 font-mono uppercase">Nagad Configuration</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Nagad Account Number</label>
                <input
                  type="text"
                  value={nagadNumber}
                  onChange={(e) => setNagadNumber(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Account Type</label>
                <input
                  type="text"
                  value={nagadType}
                  onChange={(e) => setNagadType(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Instructions Note for Customer</label>
              <textarea
                rows={2}
                value={nagadNote}
                onChange={(e) => setNagadNote(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Stripe & Bank */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-blue-400 font-mono uppercase">Stripe Notice</h4>
              <textarea
                rows={3}
                value={stripeNote}
                onChange={(e) => setStripeNote(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <h4 className="text-xs font-bold text-emerald-400 font-mono uppercase">Bank Wire Transfer</h4>
              <input
                type="text"
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3 py-1 rounded bg-slate-900 border border-slate-800 text-white"
              />
              <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-1 rounded bg-slate-900 border border-slate-800 text-white font-mono"
              />
              <input
                type="text"
                placeholder="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full px-3 py-1 rounded bg-slate-900 border border-slate-800 text-white"
              />
            </div>
          </div>
        </div>

        {/* Support Channels & Site Meta */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-xs uppercase tracking-wider">
            <PhoneCall className="w-4 h-4" />
            <span>Support & Community Channels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Facebook Page URL</label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone Line</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
              <Megaphone className="w-4 h-4" />
              <span>Announcement Top Bar</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold">
              <input
                type="checkbox"
                checked={bannerEnabled}
                onChange={(e) => setBannerEnabled(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <span>Enable Banner</span>
            </label>
          </div>

          <div>
            <input
              type="text"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="e.g. Ramadan Special: 30% OFF on Glacier M416 accounts!"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-7 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Settings to MongoDB'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
