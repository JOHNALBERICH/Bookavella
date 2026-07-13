import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query'; // Importação do QueryClient de performance
import { propertyService } from '@/features/property/services/propertyService';
import { PropertySearchResponse } from '@/types';
import { MapPin } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import RatingStars from './RatingStars';
import { cn } from '@/lib/utils';
import { Button } from '../../@/components/ui/button';

interface PropertyCardProps {
  property: PropertySearchResponse;
  showFavoriteButton?: boolean;
  averageRating?: number;
}

export default function PropertyCard({
  property,
  showFavoriteButton = true,
  averageRating,
}: PropertyCardProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const primaryImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600';

  // PERFORMANCE OPTIMIZATION: Prefetching no hover do mouse
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['property', property.id],
      queryFn: () => propertyService.getPropertyDetails(property.id),
      staleTime: 1000 * 60 * 5, // Trata os dados pre-warms como frescos por 5 minutos
    });
  };

  const handleCardClick = () => {
    navigate(`/properties/${property.id}`);
  };
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede duplo acionamento ou bolha de transição de histórico de rota
    navigate(`/properties/${property.id}`);
  };
  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter} // ◄ Ativação do pré-carregamento preditivo
      className="group relative flex flex-col bg-surface border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-normal cursor-pointer"
    >
      {/* Imagem (16/9) */}
      <div className="relative aspect-video w-full overflow-hidden bg-background">
        <img
          src={primaryImage}
          alt={property.propertyname}
          className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badge de Categoria Flutuante */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2 py-0.5 bg-background/80 backdrop-blur-sm border border-border rounded-sm text-[10px] font-medium tracking-wide uppercase text-accent">
            {property.propertytype}
          </span>
        </div>

        {/* Botão de Favorito Flutuante */}
        {showFavoriteButton && isAuthenticated && (
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton propertyId={property.id} size="sm" />
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          {/* Nome e Avaliação */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-medium text-sm text-text-primary leading-snug line-clamp-1">
              {property.propertyname}
            </h3>
            {averageRating !== undefined && averageRating > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <RatingStars rating={averageRating} size="sm" />
                <span className="text-[10px] font-bold text-[#E8A045]">{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Localidade e Endereço */}
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <MapPin className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
            <span className="line-clamp-1">
              {property.address}
            </span>
          </div>
        </div>

        {/* Informações de Preço */}
        <div className="flex items-end justify-between border-t border-border pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Per night</span>
            <span className="font-body text-sm font-semibold text-text-primary">
              R$ {property.pricePernight.toLocaleString('pt-BR')}
            </span>
          </div>
          
          {/* Nome do Dono */}
          <span className="text-[10px] text-text-tertiary font-body italic max-w-[150px] line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-normal">
            Owned by {property.ownername}
          </span>
        </div>
        <div className="pt-2">
            <Button
              onClick={handleButtonClick}
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold hover:border-accent hover:text-accent transition-colors cursor-pointer"
            >
              View Property
            </Button>
          </div>
      </div>
    </div>
  );
}