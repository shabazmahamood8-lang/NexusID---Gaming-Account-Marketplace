import React, { useState } from 'react';
import { useToast } from '../context/ToastContext.tsx';
import { api } from '../services/api.ts';
import { Star, X, Send } from 'lucide-react';

interface ReviewModalProps {
  orderId: string;
  listingId: string;
  listingTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  orderId,
  listingId,
  listingTitle,
  onClose,
  onSuccess,
}) => {
  const { success, error } = useToast();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 5) {
      error('Please write a genuine review with at least 5 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.submitReview({
        orderId,
        listingId,
        rating,
        comment,
      });

      if (res.success) {
        success('Review submitted successfully! Thank you for your feedback.');
        onSuccess();
      } else {
        error(res.message || 'Failed to submit review');
      }
    } catch (err: any) {
      error(err.message || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Rate Your Experience</h3>
            <p className="text-xs text-slate-400 truncate max-w-[280px]">{listingTitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star selector */}
          <div className="text-center py-2">
            <label className="block text-xs text-slate-400 mb-2 font-medium">Select Rating (1 to 5 Stars)</label>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-amber-400 mt-2">
              {rating === 5 && 'Outstanding & Fast!'}
              {rating === 4 && 'Very Good Service'}
              {rating === 3 && 'Average'}
              {rating === 2 && 'Below Expectations'}
              {rating === 1 && 'Poor Experience'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Review / Feedback *
            </label>
            <textarea
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other gamers about the credential handover speed, account accuracy, and seller communication..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
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
                'Submitting...'
              ) : (
                <>
                  Submit Review
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
