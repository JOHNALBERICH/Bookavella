import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { propertyService } from '@/features/property/services/propertyService';
import { reviewService } from '@/features/review/services/reviewService';
import ReviewCard from '@/components/ReviewCard';
import RatingStars from '@/components/RatingStars';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Loader2, SlidersHorizontal, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerReviewsPage() {
  const { currentUser } = useAuth();
  const ownerId = currentUser?.id || '';

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');

  // 1. Carrega todas as propriedades pertencentes a este dono para alimentar o select
  const { data: propertiesResponse, isLoading: loadingProperties } = useQuery({
    queryKey: ['properties', 'owner', ownerId],
    queryFn: () => propertyService.getOwnerProperties(ownerId),
    enabled: !!ownerId,
  });

  const ownedProperties = propertiesResponse|| [];
  const ownerProperties = ownedProperties.filter((p) => p.ownername === currentUser?.name);

  // Seleciona automaticamente o primeiro hotel do portfólio no carregamento inicial (UX optimization)
  useEffect(() => {
    if (ownerProperties.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(ownerProperties[0].id);
    }
  }, [ownerProperties, selectedPropertyId]);

  // 2. Carrega as reviews específicas do hotel selecionado reativamente
  const { data: reviewsResponse, isLoading: loadingReviews } = useQuery({
    queryKey: ['reviews', selectedPropertyId],
    queryFn: () => reviewService.getReviews(selectedPropertyId),
    enabled: !!selectedPropertyId,
  });

  const reviews = reviewsResponse?.data || [];

  // Cálculos de faturamento e média de satisfação
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length 
    : 0;

  const isLoading = loadingProperties;

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <span className="text-xs text-text-secondary">Loading feedbacks catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-text-primary font-body pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-heading font-semibold">Feedbacks & Reviews</h1>
        <p className="text-xs text-text-secondary">Track guest ratings and commentaries across your portfolio.</p>
      </div>

      {/* Select Filter Bar */}
      <div className="p-4 bg-surface border border-border rounded-md shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-4 w-4 text-text-tertiary shrink-0" />
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider block">Filter hotel</span>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none focus:border-accent"
            >
              <option value="">Select Property...</option>
              {ownerProperties.map((p) => (
                <option key={p.id} value={p.id}>{p.propertyname}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Média de Notas */}
        {reviews.length > 0 && (
          <div className="flex items-center gap-3 bg-background px-4 py-2 border border-border rounded-sm">
            <RatingStars rating={averageRating} size="sm" />
            <span className="text-xs font-bold text-[#E8A045]">{averageRating.toFixed(1)} score ({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {/* Conteúdo Dinâmico */}
      {loadingReviews ? (
        <div className="h-40 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-accent" />
        </div>
      ) : !selectedPropertyId ? (
        <div className="h-64 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-8 bg-surface/30 gap-3 text-center">
          <MessageSquare className="h-8 w-8 text-text-tertiary" />
          <p className="text-xs text-text-tertiary">Select a listed hotel to inspect guest reviews.</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="h-64 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-8 bg-surface/30 gap-3 text-center">
          <MessageSquare className="h-8 w-8 text-text-tertiary" />
          <p className="text-xs text-text-tertiary">No comments or ratings left for this property yet.</p>
        </div>
      ) : (
        /* Lista de Reviews */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <ReviewCard key={rev.reviewId} review={rev} />
          ))}
        </div>
      )}
    </div>
  );
}