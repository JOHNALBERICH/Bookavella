import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/features/review/services/reviewService';
import { Review } from '@/types';
import RatingStars from '@/components/RatingStars';
import EmptyState from '@/components/EmptyState'; // Importação do EmptyState
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Input } from '../../../@/components/ui/input';
import { Button } from '../../../@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, Loader2, Flag, Edit, X, AlertTriangle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface EditModalProps {
  review: Review;
  onClose: () => void;
  propertyId: string;
}

function ModerationModal({ review, onClose, propertyId }: EditModalProps) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(review.rating);
  const [comment, setComment] = useState<string>(review.comment || '');

  const editMutation = useMutation({
    mutationFn: ({ rId, score, text }: { rId: string; score: number; text: string }) =>
      reviewService.updateReview(rId, { rating: score, comment: text }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', propertyId] });
      toast.success(response.message || 'Review moderated successfully!');
      onClose();
    },
    onError: () => {
      toast.error('Failed to update review details.');
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editMutation.mutate({
      rId: review.reviewId,
      score: rating,
      text: comment,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-[420px] bg-surface border-border text-text-primary shadow-lg">
        <CardHeader className="relative pb-4 flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-heading">Moderate Review</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              Update rating or censor comment to fit terms of service.
            </CardDescription>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary cursor-pointer focus:outline-none">
            <X className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Rating</label>
              <RatingStars rating={rating} size="lg" interactive onChange={setRating} />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Censored / Updated Comment</label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-background border border-border rounded-sm text-sm p-3 min-h-[100px] text-text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-border">
              <Button type="button" variant="ghost" onClick={onClose} disabled={editMutation.isPending} className="h-10 text-xs cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={editMutation.isPending} className="h-10 text-xs px-6 cursor-pointer">
                {editMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Moderation'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ReviewModerationPage() {
  const [searchInput, setSearchInput] = useState<string>('');
  const [propertyId, setPropertyId] = useState<string>('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const { data: reviewsResponse, isLoading } = useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: () => reviewService.getReviews(propertyId),
    enabled: !!propertyId,
  });

  const reviews = reviewsResponse?.data || [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      toast.error('Please provide a valid propertyId (Guid)');
      return;
    }
    setPropertyId(searchInput.trim());
  };

  return (
    <div className="space-y-8 text-text-primary font-body pb-12">
      <div className="space-y-1 border-b border-border pb-6">
        <h1 className="text-2xl font-heading font-semibold">Reviews Moderation</h1>
        <p className="text-xs text-text-secondary">Inspect, rewrite or censor listed feedback commentaries.</p>
      </div>

      <div className="p-4 rounded-sm bg-error/10 border border-error/20 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-error shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-error uppercase">Requires GET /Admin/Reviews endpoint</span>
          <p className="text-[11px] text-text-secondary leading-relaxed max-w-2xl">
            Currently, you must explicitly know and search by the unique propertyId (Guid) to fetch and audit comments. A global dashboard of recently posted reviews will be wired once the API mestre is constructed.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearchSubmit} className="max-w-xl flex gap-3">
        <div className="flex-1 flex items-center bg-surface border border-border rounded-sm h-11 px-3 focus-within:border-error transition-colors">
          <Search className="h-4.5 w-4.5 text-text-tertiary mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Paste propertyId (Guid) e.g. 87b2ca41-..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-transparent border-0 p-0 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none h-full"
          />
        </div>
        <Button type="submit" className="h-10 text-xs px-6 cursor-pointer">
          Inspect Reviews
        </Button>
      </form>

      {/* Listagem */}
      {isLoading ? (
        <div className="h-40 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      ) : !propertyId ? (
        /* Estado Inicial Neutro */
        <EmptyState
          icon={MessageSquare}
          title="No reviews inspected yet"
          description="Provide a valid propertyId (Guid) in the search input above to inspect its active guest reviews."
        />
      ) : reviews.length === 0 ? (
        /* Sem Resultados */
        <EmptyState
          icon={MessageSquare}
          title="No reviews found"
          description="No reviews recorded under this searched propertyId yet in the database."
        />
      ) : (
        /* Lista de Reviews */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => {
            const isFlagged = rev.rating <= 2;

            return (
              <div key={rev.reviewId} className="p-6 bg-surface border border-border rounded-lg space-y-4 shadow-sm relative flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <RatingStars rating={rev.rating} size="sm" />
                      <span className="text-[10px] text-text-tertiary">{new Date(rev.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>

                    {isFlagged && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/15 text-error text-[9px] font-bold uppercase tracking-wider">
                        <Flag className="h-3 w-3 shrink-0" /> Low Rating Flag
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    "{rev.comment || 'No text comment provided.'}"
                  </p>
                </div>

                <div className="flex justify-end pt-3 border-t border-border">
                  <Button 
                    variant="ghost" 
                    className="h-8 px-2.5 text-[11px] flex items-center gap-1.5"
                    onClick={() => setEditingReview(rev)}
                  >
                    <Edit className="h-3.5 w-3.5" /> Moderate Review
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingReview && (
        <ModerationModal
          review={editingReview}
          propertyId={propertyId}
          onClose={() => setEditingReview(null)}
        />
      )}
    </div>
  );
}