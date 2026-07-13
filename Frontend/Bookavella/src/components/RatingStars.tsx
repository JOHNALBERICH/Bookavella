import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number; // Nota de 1 a 5
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean; // Se true, funciona como campo de formulário editável
  onChange?: (rating: number) => void;
}

export default function RatingStars({
  rating,
  size = 'md',
  interactive = false,
  onChange,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const currentRating = hoverRating !== null ? hoverRating : rating;

  const handleStarClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', interactive && 'cursor-pointer')}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= currentRating;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className="p-0 focus:outline-none disabled:pointer-events-none cursor-pointer"
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-all duration-fast',
                isFilled
                  ? 'fill-accent text-accent scale-105'
                  : 'text-text-tertiary hover:scale-110'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}