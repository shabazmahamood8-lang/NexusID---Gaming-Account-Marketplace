import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { api } from '../services/api.ts';
import { IDListingData } from './IDCard.tsx';
import { X, ShieldCheck, CreditCard, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface OrderModalProps {
  listing: IDListingData;
  settings: any;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ listing, settings, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'stripe' | 'bank'>('bkash');
  const [paymentTransactionId, setPaymentTransactionId] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currencySymbol = settings?.currencySymbol || '৳';

  // Dynamic payment instructions from settings
  const bkashInfo = settings?.paymentInstructions?.bkash || {
    number: '01712345678',
    type: 'Personal (Send Money)',
    note: 'Please send money and provide Transaction ID & phone number.',
  };

  const nagadInfo = settings?.paymentInstructions?.nagad || {
    number: '01812345678',
    type: 'Personal (Send Money)',
    note: 'Send money to our official Nagad number and enter your TrxID below.',
  };

  const stripeInfo = settings?.paymentInstructions?.stripeNote || 'Secure international card checkout.';
  const bankInfo = settings?.paymentInstructions?.bankTransfer || {
    bankName: 'Standard Chartered Bank',
    accountName: 'NexusID Tech Global',
    accountNumber: '01-1234567-01',
    branch: 'Gulshan Branch',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !email.trim() || !phone.trim()) {
      error('Please complete name, email, and phone number');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.createOrder({
        listingId: listing._id,
        customerName,
        email,
        phone,
        paymentMethod,
        paymentTransactionId,
        note,
      });

      if (res.success && res.data) {
        success('Order submitted successfully! Our escrow team is processing it.');
        onSuccess(res.data._id);
      } else {
        error(res.message || 'Failed to place order');
      }
    } catch (err: any) {
      error(err.message || 'Error creating order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Purchase Gaming ID (Escrow Order)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Listing Summary Card */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <img
              src={listing.images?.[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80'}
              alt={listing.title}
              className="w-16 h-16 rounded-lg object-cover border border-slate-800 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                {listing.game} · {listing.rank}
              </span>
              <h4 className="text-white text-xs font-semibold truncate">{listing.title}</h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                  {currencySymbol}{listing.price.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500">Verified Database Price</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. Rahim Ahmed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. +880 1711223344"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email (For Credential Handover) *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Payment Method</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'bkash', name: 'bKash', color: 'hover:border-pink-500' },
                  { id: 'nagad', name: 'Nagad', color: 'hover:border-orange-500' },
                  { id: 'stripe', name: 'Stripe Card', color: 'hover:border-blue-500' },
                  { id: 'bank', name: 'Bank Wire', color: 'hover:border-emerald-500' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as any)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all text-center ${
                      paymentMethod === item.id
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-sm'
                        : `bg-slate-950 border-slate-800 text-slate-300 ${item.color}`
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Payment Instructions Box from Admin Settings */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span className="uppercase tracking-wider text-[11px] text-emerald-400">Payment Instructions:</span>
                <span className="font-mono text-[11px] text-slate-400 uppercase">{paymentMethod}</span>
              </div>

              {paymentMethod === 'bkash' && (
                <div className="text-slate-300 space-y-1">
                  <p>
                    bKash Number: <strong className="text-white font-mono text-sm">{bkashInfo.number}</strong> ({bkashInfo.type})
                  </p>
                  <p className="text-slate-400 text-[11px]">{bkashInfo.note}</p>
                </div>
              )}

              {paymentMethod === 'nagad' && (
                <div className="text-slate-300 space-y-1">
                  <p>
                    Nagad Number: <strong className="text-white font-mono text-sm">{nagadInfo.number}</strong> ({nagadInfo.type})
                  </p>
                  <p className="text-slate-400 text-[11px]">{nagadInfo.note}</p>
                </div>
              )}

              {paymentMethod === 'stripe' && (
                <div className="text-slate-300 space-y-1">
                  <p className="text-white">Stripe Card Payment Gateway</p>
                  <p className="text-slate-400 text-[11px]">{stripeInfo}</p>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="text-slate-300 space-y-1">
                  <p>Bank: <strong className="text-white">{bankInfo.bankName}</strong> ({bankInfo.branch})</p>
                  <p>Account: <strong className="text-white font-mono">{bankInfo.accountNumber}</strong></p>
                  <p>Name: <strong className="text-white">{bankInfo.accountName}</strong></p>
                </div>
              )}
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Transaction ID (TrxID) / Sender Phone (Optional if paying now)
              </label>
              <input
                type="text"
                value={paymentTransactionId}
                onChange={(e) => setPaymentTransactionId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. 9KL897TRX or sender number"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Additional Note (Optional)</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
                placeholder="Special handover requests, preferred WhatsApp time, etc."
              />
            </div>

            {/* Total Authoritative Price & Submit */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400">Total Authoritative Payable:</p>
                <p className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                  {currencySymbol}{listing.price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  {isSubmitting ? (
                    'Processing...'
                  ) : (
                    <>
                      Confirm & Submit Order
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
