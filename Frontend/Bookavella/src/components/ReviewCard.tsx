import { Review, User } from '@/types';
import RatingStars from './RatingStars';
import { Avatar, AvatarFallback, AvatarImage } from '../../@/components/ui/avatar';

interface ReviewCardProps {
  review: Review;
  user?: Pick<User, 'name' | 'avatarUrl'>; // Dados obtidos na requisição ou mockados
}

export default function ReviewCard({ review, user }: ReviewCardProps) {
  // Formatação de data nativa e limpa sem dependências adicionais
  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const authorName = user?.name || 'Anonymous Guest';

  return (
    <div className="p-6 bg-surface border border-border rounded-lg space-y-4 shadow-sm">
      {/* Informações do Hóspede e Data */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={user?.avatarUrl || ''} alt={authorName} />
            <AvatarFallback className="bg-background text-text-secondary text-xs uppercase font-body">
              {authorName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-text-primary">{authorName}</span>
            <span className="text-[10px] text-text-tertiary">{formattedDate}</span>
          </div>
        </div>

        {/* Estrelas */}
        <RatingStars rating={review.rating} size="sm" />
      </div>

      {/* Comentário do Hóspede */}
      {review.comment && (
        <p className="text-xs text-text-secondary leading-relaxed font-body">
          "{review.comment}"
        </p>
      )}
    </div>
  );
}