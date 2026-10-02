import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { ReviewModal } from '../components/ReviewModal.tsx';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  Key,
  ShieldCheck,
  Star,
  Copy,
  ChevronRight,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface CustomerOrdersPageProps {
  navigate: (path: string) => void;
  currencySymbol?: string;
}

export const CustomerOrdersPage: React.FC<CustomerOrdersPageProps> = ({
  navigate,
  currencySymbol = '৳',
}) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'delivered'>('all');
  const [selectedReviewOrder, setSelectedReviewOrder] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getOrders();
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (e) {
      console.error('Failed to load orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCopy = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(id);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'pending') return o.status !== 'delivered' && o.status !== 'cancelled';
    if (activeTab === 'delivered') return o.status === 'delivered';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            Order Management & Security Handover
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            My Purchased Gaming IDs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            View real-time verification status, escrow progress, and delivered account login credentials.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pending'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            In-Progress
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'delivered'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Delivered ({orders.filter((o) => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 space-y-2">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Retrieving your order records from database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No orders found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeTab === 'delivered'
              ? 'You have no delivered orders yet. Check the in-progress tab to monitor active escrow orders.'
              : 'You have not placed any orders yet. Browse our marketplace to purchase verified accounts.'}
          </p>
          <button
            onClick={() => navigate('/ids')}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >
            Browse Marketplace IDs
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const listing = typeof order.listing === 'object' ? order.listing : null;
            const listingTitle = listing?.title || 'Gaming ID Account';
            const listingGame = listing?.game || 'Game';
            const listingImage = listing?.images?.[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80';
            const isDelivered = order.status === 'delivered';
            const delivery = order.deliveryDetails || {};

            return (
              <div
                key={order._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden space-y-4 p-5 sm:p-6"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">
                      Order ID: <strong className="text-white">{order._id}</strong>
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-xs font-mono text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono uppercase px-3 py-1 rounded-md font-bold ${
                        order.status === 'delivered'
                          ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                          : order.status === 'confirmed'
                          ? 'bg-blue-950 border border-blue-500/40 text-blue-300'
                          : order.status === 'paid'
                          ? 'bg-purple-950 border border-purple-500/40 text-purple-300'
                          : order.status === 'cancelled'
                          ? 'bg-rose-950 border border-rose-500/40 text-rose-300'
                          : 'bg-amber-950 border border-amber-500/40 text-amber-300'
                      }`}
                    >
                      Status: {order.status}
                    </span>
                  </div>
                </div>

                {/* Listing Details Snippet */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8 flex items-center gap-4">
                    <img
                      src={listingImage}
                      alt={listingTitle}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                        {listingGame} {listing?.rank ? `· ${listing.rank}` : ''}
                      </span>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{listingTitle}</h3>
                      <p className="text-xs text-slate-400">
                        Method: <span className="uppercase text-slate-200 font-semibold">{order.paymentMethod}</span>
                        {order.paymentTransactionId && (
                          <span> · TrxID: <span className="font-mono text-slate-200">{order.paymentTransactionId}</span></span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-4 text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Paid Amount</span>
                    <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                      {currencySymbol}{order.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress Status Visual Tracker */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold">
                    <div className="space-y-1">
                      <div className="h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-emerald-400">Order Placed</span>
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          ['confirmed', 'paid', 'delivered'].includes(order.status)
                            ? 'bg-emerald-500'
                            : 'bg-slate-800'
                        }`}
                      />
                      <span
                        className={
                          ['confirmed', 'paid', 'delivered'].includes(order.status)
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                        }
                      >
                        Payment Verified
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          ['paid', 'delivered'].includes(order.status) ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      />
                      <span
                        className={
                          ['paid', 'delivered'].includes(order.status)
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                        }
                      >
                        Credentials Prepared
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          order.status === 'delivered' ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}
                      />
                      <span className={order.status === 'delivered' ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivered Credentials Box */}
                {isDelivered && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          Official Account Login Credentials
                        </h4>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Delivered {delivery.deliveredAt ? new Date(delivery.deliveredAt).toLocaleDateString() : 'Securely'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {delivery.accountUsername && (
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Account Login / Email:</span>
                            <span className="font-mono text-white font-semibold">{delivery.accountUsername}</span>
                          </div>
                          <button
                            onClick={() => handleCopy(delivery.accountUsername, `user-${order._id}`)}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Copy username"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {delivery.accountPassword && (
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Password:</span>
                            <span className="font-mono text-emerald-300 font-semibold">{delivery.accountPassword}</span>
                          </div>
                          <button
                            onClick={() => handleCopy(delivery.accountPassword, `pass-${order._id}`)}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Copy password"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {delivery.backupCodes && (
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                        <span className="text-[10px] text-slate-400 block mb-0.5">Backup Codes / 2FA Keys:</span>
                        <span className="font-mono text-slate-200">{delivery.backupCodes}</span>
                      </div>
                    )}

                    {delivery.instructions && (
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                        <span className="text-[10px] text-emerald-400 font-semibold uppercase block">
                          Handover Instructions:
                        </span>
                        <p className="text-slate-300 leading-relaxed">{delivery.instructions}</p>
                      </div>
                    )}

                    {/* Review Button for Delivered Orders */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Happy with your new account? Leave a review for the community!
                      </span>
                      <button
                        onClick={() => setSelectedReviewOrder(order)}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Write a Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal Trigger */}
      {selectedReviewOrder && (
        <ReviewModal
          orderId={selectedReviewOrder._id}
          listingId={typeof selectedReviewOrder.listing === 'object' ? selectedReviewOrder.listing._id : selectedReviewOrder.listing}
          listingTitle={typeof selectedReviewOrder.listing === 'object' ? selectedReviewOrder.listing.title : 'Gaming ID'}
          onClose={() => setSelectedReviewOrder(null)}
          onSuccess={() => {
            setSelectedReviewOrder(null);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
};

export default CustomerOrdersPage;
