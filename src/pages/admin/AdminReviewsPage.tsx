import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { Star, CheckCircle2, XCircle, Trash2, ChevronLeft, MessageSquare } from 'lucide-react';

interface AdminReviewsPageProps {
  navigate: (path: string) => void;
}

export const AdminReviewsPage: React.FC<AdminReviewsPageProps> = ({ navigate }) => {
  const { success, error } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.getReviews(undefined, true);
      if (res.success && res.data) {
        setReviews(res.data);
      }
    } catch (e) {
      console.error('Failed to load reviews:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApprove = async (rev: any) => {
    const nextApproved = !rev.isApproved;
    try {
      const res = await api.updateReviewStatus(rev._id, nextApproved);
      if (res.success) {
        success(`Review is now ${nextApproved ? 'Approved' : 'Hidden'}`);
        setReviews((prev) =>
          prev.map((r) => (r._id === rev._id ? { ...r, isApproved: nextApproved } : r))
        );
      } else {
        error(res.message || 'Failed to update review status');
      }
    } catch (err: any) {
      error(err.message || 'Error updating review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      const res = await api.deleteReview(id);
      if (res.success) {
        success('Review deleted');
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } else {
        error(res.message || 'Failed to delete review');
      }
    } catch (err: any) {
      error(err.message || 'Error deleting review');
    }
  };

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
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Review Moderation</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Approve verified buyer feedback before it displays publicly on the homepage and ID details pages.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400 border border-slate-800 rounded-2xl bg-slate-900/30">
          No customer reviews submitted yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className={`p-5 rounded-2xl border space-y-3 ${
                rev.isApproved ? 'bg-slate-900/60 border-slate-800' : 'bg-rose-950/20 border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{rev.userName}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Order Ref: {String(rev.order).substring(0, 10)}...
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className={`font-mono text-[10px] uppercase font-bold ${rev.isApproved ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {rev.isApproved ? 'Approved & Visible' : 'Pending / Hidden'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleApprove(rev)}
                    className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                  >
                    {rev.isApproved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleDelete(rev._id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white"
                    title="Delete review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewsPage;
