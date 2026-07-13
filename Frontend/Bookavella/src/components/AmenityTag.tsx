import { Amenity } from '@/types';
import { 
  Wifi, Car, Waves, Wind, Tv, Utensils, Coffee, Dumbbell, Sparkles, LucideIcon 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AmenityTagProps {
  amenity: Amenity;
  className?: string;
}

export default function AmenityTag({ amenity, className }: AmenityTagProps) {
  
  // Mapeia inteligentemente termos comuns das facilidades para vetores Lucide correspondentes
  const getAmenityIcon = (name: string): LucideIcon => {
    const lower = name.toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet')) return Wifi;
    if (lower.includes('parking') || lower.includes('car') || lower.includes('estacionamento') || lower.includes('garagem')) return Car;
    if (lower.includes('pool') || lower.includes('piscina') || lower.includes('swim')) return Waves;
    if (lower.includes('ac') || lower.includes('ar-condicionado') || lower.includes('ar condicionado') || lower.includes('ventila')) return Wind;
    if (lower.includes('tv') || lower.includes('televis') || lower.includes('cabo')) return Tv;
    if (lower.includes('breakfast') || lower.includes('café') || lower.includes('restaurante') || lower.includes('food')) return Utensils;
    if (lower.includes('coffee') || lower.includes('cafeteira')) return Coffee;
    if (lower.includes('gym') || lower.includes('academia') || lower.includes('fitness')) return Dumbbell;
    if (lower.includes('spa') || lower.includes('massagem') || lower.includes('sauna') || lower.includes('relax')) return Sparkles;
    return Sparkles; // fallback visual
  };

  const Icon = getAmenityIcon(amenity.amenityName);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs text-text-secondary font-body transition-colors hover:text-text-primary hover:border-accent/40',
        className
      )}
    >
      <Icon className="h-3.5 w-3.5 text-accent shrink-0" />
      <span className="capitalize">{amenity.amenityName}</span>
    </div>
  );
}