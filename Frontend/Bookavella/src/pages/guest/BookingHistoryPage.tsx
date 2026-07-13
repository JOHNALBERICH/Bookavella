import { useState } from 'react';
import { useBookingHistory } from '@/features/booking/hooks/useBookingHistory';
import { useCreateReview } from '@/features/review/hooks/useCreateReview';
import BookingCard from '@/components/BookingCard';
import RatingStars from '@/components/RatingStars';
import EmptyState from '@/components/EmptyState'; // Importação do EmptyState
import { BookingStatus, Booking } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Button } from '../../../@/components/ui/button';
import { cn } from '@/lib/utils';
import { FolderOpen, Loader2, X, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

interface ReviewModalProps {
  propertyId: string;
  onClose: () => void;
}

function ReviewModal({ propertyId, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const createReviewMutation = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReviewMutation.mutate(
      {
        propertyId,
        rating,
        comment: comment || '',
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0B]/85 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-[420px] bg-surface border border-border text-text-primary shadow-lg">
        <CardHeader className="relative pb-4 flex flex-row items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-heading">Leave a Review</CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              Share your sanctuary experience with our editorial circle.
            </CardDescription>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary cursor-pointer focus:outline-none">
            <X className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary font-medium">Rating Score</label>
              <RatingStars rating={rating} size="lg" interactive onChange={setRating} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-text-secondary font-medium">Comments</label>
              <textarea
                required
                placeholder="Describe textures, architectural feelings, check-in hospitality..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-background border border-border rounded-sm text-sm p-3 min-h-[120px] text-text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={createReviewMutation.isPending} className="h-10 text-xs cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={createReviewMutation.isPending} className="h-10 text-xs px-6 cursor-pointer">
                {createReviewMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingHistoryPage() {
  const [activeTab, setActiveTab] = useState<'all' | BookingStatus>('all');
  const [reviewPropertyId, setReviewPropertyId] = useState<string | null>(null);

  const { data: bookings = [], isLoading } = useBookingHistory();

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    return b.bookingStatus === activeTab;
  });

  const tabs = [
    { id: 'all', label: 'All Bookings' },
    { id: BookingStatus.Pending, label: 'Pending' },
    { id: BookingStatus.Confirmed, label: 'Confirmed' },
    { id: BookingStatus.Canceled, label: 'Canceled' },
    { id: BookingStatus.Complete, label: 'Completed' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 font-body text-text-primary">
      <div className="space-y-1">
        <h1 className="text-3xl font-heading font-semibold text-text-primary">My Bookings</h1>
        <p className="text-sm text-text-secondary">
          Track active, pending, or previous sanctuary reservations.
        </p>
      </div>

      <div className="flex border-b border-border space-x-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "pb-4 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap focus:outline-none",
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <span className="text-xs text-text-secondary">Loading history...</span>
        </div>
      ) : filteredBookings.length === 0 ? (
        /* ACOPLAMENTO DO EMPTYSTATE DE RESERVAS */
        <EmptyState
          icon={FolderOpen}
          title="No bookings yet"
          description="You don't have any bookings matching this status category in your history yet."
          action={
            <Button asChild className="h-9 text-xs flex items-center gap-1.5 cursor-pointer">
              <Link to={ROUTES.HOME}>
                <Compass className="h-4 w-4" />
                Browse sanctuaries
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking: Booking) => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
              onLeaveReview={setReviewPropertyId}
            />
          ))}
        </div>
      )}

      {reviewPropertyId && (
        <ReviewModal
          propertyId={reviewPropertyId}
          onClose={() => setReviewPropertyId(null)}
        />
      )}
    </div>
  );
}