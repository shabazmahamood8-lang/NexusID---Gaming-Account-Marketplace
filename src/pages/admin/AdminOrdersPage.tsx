import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Key,
  X,
  Send,
  ChevronLeft,
  Search,
  Filter,
} from 'lucide-react';

interface AdminOrdersPageProps {
  navigate: (path: string) => void;
  currencySymbol?: string;
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({
  navigate,
  currencySymbol = '৳',
}) => {
  const { success, error } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Delivery Modal form state
  const [modalStatus, setModalStatus] = useState<string>('pending');
  const [accountUsername, setAccountUsername] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [backupCodes, setBackupCodes] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

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

  const openOrderModal = (order: any) => {
    setSelectedOrder(order);
    setModalStatus(order.status || 'pending');
    setAccountUsername(order.deliveryDetails?.accountUsername || '');
    setAccountPassword(order.deliveryDetails?.accountPassword || '');
    setBackupCodes(order.deliveryDetails?.backupCodes || '');
    setInstructions(
      order.deliveryDetails?.instructions ||
        'Please login to the account, immediately change the password, and verify that all inventory items match the description.'
    );
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setIsUpdating(true);
      const deliveryDetails = {
        accountUsername,
        accountPassword,
        backupCodes,
        instructions,
      };

      const res = await api.updateOrderStatus(selectedOrder._id, modalStatus, deliveryDetails);
      if (res.success) {
        success(`Order #${selectedOrder._id} updated to ${modalStatus.toUpperCase()}`);
        setSelectedOrder(null);
        fetchOrders();
      } else {
        error(res.message || 'Failed to update order');
      }
    } catch (err: any) {
      error(err.message || 'Error updating order');
    } finally {
      setIsUpdating(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      search.trim() === '' ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search) ||
      o._id?.includes(search) ||
      o.paymentTransactionId?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={() => navigate('/admin')}
            className="text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1 mb-1 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">Order Verification & Handover</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit customer payments, confirm transactions, and securely transmit gaming ID credentials.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, TrxID, phone..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="paid">Paid</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-2">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading customer orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400">
            No orders match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-mono text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Gaming ID</th>
                  <th className="py-3 px-4">Price Paid</th>
                  <th className="py-3 px-4">Method & TrxID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((o) => {
                  const listing = typeof o.listing === 'object' ? o.listing : null;
                  return (
                    <tr key={o._id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-mono">
                        <span className="text-white block font-semibold">{o._id.substring(0, 10)}...</span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{o.customerName}</span>
                        <span className="text-[11px] text-slate-400 block">{o.email}</span>
                        <span className="text-[10px] font-mono text-slate-500">{o.phone}</span>
                      </td>

                      <td className="py-3 px-4 max-w-[200px]">
                        <span className="text-emerald-400 font-mono text-[10px] uppercase block">
                          {listing?.game || 'Gaming Account'}
                        </span>
                        <span className="font-medium text-white truncate block">
                          {listing?.title || 'Account ID'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-emerald-400 font-bold tabular-nums">
                        {currencySymbol}{o.price?.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className="uppercase text-white font-semibold block">{o.paymentMethod}</span>
                        <span className="text-[10px] text-slate-400">
                          {o.paymentTransactionId ? `Trx: ${o.paymentTransactionId}` : 'No TrxID entered'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded font-mono text-[10px] uppercase font-bold ${
                            o.status === 'delivered'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : o.status === 'confirmed'
                              ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                              : o.status === 'paid'
                              ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                              : o.status === 'cancelled'
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openOrderModal(o)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                        >
                          {o.status === 'delivered' ? 'Edit Details' : 'Process & Handover'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Status & Credential Delivery Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Process Order #{selectedOrder._id.substring(0, 10)}
                </h3>
                <p className="text-xs text-slate-400">
                  Customer: <strong className="text-white">{selectedOrder.customerName}</strong> ({selectedOrder.email})
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note & Payment Details */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Payment Method: <strong className="text-white uppercase">{selectedOrder.paymentMethod}</strong></span>
                <span className="text-emerald-400 font-bold tabular-nums">{currencySymbol}{selectedOrder.price?.toLocaleString()}</span>
              </div>
              <p className="text-slate-300 font-mono">
                TrxID: <strong className="text-white">{selectedOrder.paymentTransactionId || 'None provided'}</strong>
              </p>
              {selectedOrder.note && (
                <p className="text-slate-400 italic">"Customer Note: {selectedOrder.note}"</p>
              )}
            </div>

            <form onSubmit={handleUpdateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Update Order Status *</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                >
                  <option value="pending">pending (Payment Not Yet Received)</option>
                  <option value="confirmed">confirmed (Payment Under Review)</option>
                  <option value="paid">paid (Payment Cleared - Ready for Handover)</option>
                  <option value="delivered">delivered (Credentials Sent to Customer & Marked Sold)</option>
                  <option value="cancelled">cancelled (Order Refunded/Declined)</option>
                </select>
              </div>

              {/* Credential Handover Fields (Important for delivered status) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-semibold">
                  <Key className="w-4 h-4" />
                  <span>Credential Handover to Buyer</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  These details will be encrypted and shown inside the buyer's account dashboard once status is "delivered".
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Account Login / Email</label>
                    <input
                      type="text"
                      value={accountUsername}
                      onChange={(e) => setAccountUsername(e.target.value)}
                      placeholder="e.g. pubg_player@gmail.com"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Account Password</label>
                    <input
                      type="text"
                      value={accountPassword}
                      onChange={(e) => setAccountPassword(e.target.value)}
                      placeholder="e.g. MasterPass#2026"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Backup Codes / 2FA Keys</label>
                  <input
                    type="text"
                    value={backupCodes}
                    onChange={(e) => setBackupCodes(e.target.value)}
                    placeholder="e.g. 8923-4122, 9123-1123"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Special Handover Instructions</label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  {isUpdating ? 'Saving...' : 'Update & Deliver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
