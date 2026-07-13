import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/features/property/services/propertyService';
import { useAuth } from '@/contexts/AuthContext';
import ImageGallery from '@/components/ImageGallery';
import StatusBadge from '@/components/StatusBadge';
import FavoriteButton from '@/components/FavoriteButton';
import RatingStars from '@/components/RatingStars';
import AmenityTag from '@/components/AmenityTag';
import {BookingSearchPanel} from "@/components/BookingSearchPanel";
import RoomCard from '@/components/RoomCard';
import ReviewCard from '@/components/ReviewCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '../../../@/components/ui/button';
import { MapPin, MessageSquarePlus, MessageSquare, Loader2 } from 'lucide-react';
import { 
  PropertyAmenitiesResponse, 
  Amenity,
  PropertyDetailResponse,
  Review,
  Room,
  RoomType,
  BedType,
  RoomStatus,
  CommentAndRatingResponse
} from '@/types';
import { useState } from 'react';


// ═══ TIPAGENS ESPECÍFICAS DE RESPOSTA UNIFICADA (FASE 7) ═══

interface RoomsDetailResponse {
  roomId: string; // Guid identificador da acomodação
  roomName: string;
  roomDescription: string;
  roomType: RoomType;
  bedType: BedType;
  bedCount: number;
  price: number; // Nova chave de precificação em substituição a valuePerNight
  maxGuests: number;
  roomStatus: RoomStatus;
  imageUrls: string[];
}

// Estendemos a interface de resposta mestre localmente para refletir o novo formato unificado da API
interface ConsolidatedPropertyDetail extends Omit<PropertyDetailResponse, 'propertyImages'> {
  propertyImages?: { url: string }[];
  rooms?: RoomsDetailResponse[];
  reviews?: CommentAndRatingResponse[];
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const propertyId = id || '';

  // 1. Busca Detalhes da Propriedade - Agora com o catálogo consolidado de quartos e comentários
  const { data: detailsResponse, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => propertyService.getPropertyDetails(propertyId),
    enabled: !!propertyId,
  });
 const [bookingInfo, setBookingInfo] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
});
  // Resolve e unifica as variáveis de resposta baseadas no DTO consolidado do backend
  const property = (detailsResponse? detailsResponse : detailsResponse) as ConsolidatedPropertyDetail | undefined;

  const rawRooms = property?.rooms ?? [];
  const propertyReviews = property?.reviews ?? [];

  // 2. ADAPTER SÍNCRONO: Converte o DTO "RoomsDetailResponse" no modelo "Room" esperado pelo RoomCard
  const mappedRooms: Room[] = rawRooms.map((r, index) => ({
    roomId: r.roomId,
    propertyId: propertyId,
    roomName: r.roomName,
    roomDescription: r.roomDescription,
    roomType: r.roomType,
    bedType: r.bedType,
    bedCount: r.bedCount,
    maxGuests: r.maxGuests,
    valuePerNight: r.price, // Mapeado diretamente do campo decimal 'price' do backend
    roomStatus: r.roomStatus,
    createdAt: new Date().toISOString(),
    roomImages: (r.imageUrls || []).map((url) => ({
      roomImageId: url,
      roomId: r.roomId,
      imageUrl: url,
    })),
  }));

  // Calcula a média ponderada de satisfação a partir do array de reviews consolidado
  const averageRating = propertyReviews.length > 0 
    ? propertyReviews.reduce((acc, curr) => acc + curr.rating, 0) / propertyReviews.length 
    : 0;

  if (isLoading || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] px-4 font-body">
        <div className="space-y-4 w-full max-w-[320px] text-center">
          <Loader2 className="h-6 w-6 animate-spin text-accent mx-auto" />
          <p className="text-xs uppercase tracking-wider text-text-secondary">Loading sanctuary details...</p>
        </div>
      </div>
    );
  }

  // Prepara as URLs da galeria a partir da nova propriedade simplificada 'img.url'
  const galleryImages = property.propertyImages?.map((img: { url: string }) => ({
    url: img.url,
  })) || [];

  return (
    <div className="space-y-16 pb-20 text-text-primary font-body max-w-6xl mx-auto">
      
      {/* SECTION 1: IMAGE GALLERY */}
      <ImageGallery images={galleryImages} alt={property.name} />

      {/* SECTION 2: HEADER DETAILS */}
      <section className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-sm text-[10px] font-semibold tracking-wide uppercase text-accent">
              {property.propertyType}
            </span>
            <StatusBadge status={property.status} type="property" />
          </div>

          <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight">
            {property.name}
          </h1>

          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="h-4 w-4 text-text-tertiary" />
            <span>{property.address}, {property.city}, {property.country}</span>
          </div>

          {propertyReviews.length > 0 && (
            <div className="flex items-center gap-2 pt-1.5">
              <RatingStars rating={averageRating} size="sm" />
              <span className="text-xs text-text-secondary font-bold">
                {averageRating.toFixed(1)} ({propertyReviews.length} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Botão de Favoritar Flutuante */}
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-secondary font-medium">Save to favorites</span>
            <FavoriteButton propertyId={property.id} size="md" />
          </div>
        )}
      </section>

      {/* SECTION 3 & 4: DESCRIPTION & AMENITIES */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-border pb-12">
        <div className="md:col-span-8 space-y-4">
          <h2 className="font-heading text-lg font-medium text-text-primary">About this sanctuary</h2>
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed max-w-3xl whitespace-pre-wrap">
            {property.description}
          </p>
        </div>

        {/* Comodidades */}
        <div className="md:col-span-4 space-y-4">
          <h2 className="font-heading text-xs font-semibold text-text-secondary uppercase tracking-wider">Sanctuary Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {property.propertyAmenities && property.propertyAmenities.length > 0 ? (
              property.propertyAmenities.map((amenity: PropertyAmenitiesResponse) => (
                <AmenityTag 
                  key={amenity.amenityId} 
                  amenity={amenity as Amenity} // Cast limpo para conformidade estrutural
                />
              ))
            ) : (
              <span className="text-xs text-text-tertiary italic">No amenities configured for this property.</span>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: AVAILABLE ROOMS */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-heading font-medium">Available Accommodations</h2>
          <p className="text-xs text-text-secondary">Explore options ranging from standard rooms to exclusive architectural suites.</p>
          <BookingSearchPanel
                maxGuests={property.maxGuests}
                onSearch={(data) => {
                    setBookingInfo(data);
                }}
            />
        </div>

        {mappedRooms.length === 0 ? (
          <div className="p-8 border border-dashed border-border rounded-md text-center bg-surface/30">
            <p className="text-xs text-text-tertiary">No rooms currently available for this property.</p>
          </div>
        ) : (
          <ErrorBoundary fallback={<div className="p-6 border border-dashed border-border rounded-md text-center text-text-tertiary">Rooms list is currently undergoing maintenance.</div>}>
            <div className="space-y-4">
              {mappedRooms.map((room) => (
                <RoomCard key={room.roomId} room={room} propertyId={property.id} bookingInfo={bookingInfo}/>
              ))}
            </div>
          </ErrorBoundary>
        )}
      </section>

      {/* SECTION 6: REVIEWS */}
      <section className="space-y-8 border-t border-border pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-heading font-medium">Guest Experiences</h2>
            <p className="text-xs text-text-secondary">Authentic reviews left by verified guests.</p>
          </div>

          {isAuthenticated ? (
            <Button variant="outline" asChild className="h-9 text-xs flex items-center gap-2 cursor-pointer">
              <Link to={`/review/create/${propertyId}`}>
                <MessageSquarePlus className="h-4 w-4 text-accent" />
                Write a Review
              </Link>
            </Button>
          ) : (
            <span className="text-xs text-text-tertiary italic">Please login to write a review.</span>
          )}
        </div>

        {propertyReviews.length === 0 ? (
          <div className="p-8 border border-dashed border-border rounded-md text-center bg-surface/20 flex flex-col items-center justify-center gap-3">
            <MessageSquare className="h-6 w-6 text-text-tertiary" />
            <p className="text-xs text-text-tertiary">Be the first to share your experience at this sanctuary.</p>
          </div>
        ) : (
          /* 3. ADAPTER SÍNCRONO: Reconstrói o Review e o User para injetar no ReviewCard unificado */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {propertyReviews.map((rev, index) => {
              const mappedReview: Review = {
                reviewId: `rev-${propertyId}-${index}`,
                propertyId: property.id,
                userId: `user-${index}`,
                rating: rev.rating,
                comment: rev.comment,
                createdAt: new Date().toISOString(), // Fallback de data síncrona local
              };

              const mappedUser = {
                name: rev.userName,
                avatarUrl: rev.userAvatar,
              };

              return (
                <ReviewCard 
                  key={index} 
                  review={mappedReview} 
                  user={mappedUser} 
                />
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 7: MAP PLACEHOLDER */}
      <section className="space-y-4 border-t border-border pt-12">
        <h2 className="font-heading text-xs font-semibold text-text-secondary uppercase tracking-wider">Location Map</h2>
        <div className="h-64 border border-dashed border-border rounded-lg bg-surface/50 flex flex-col items-center justify-center p-8 text-center gap-2">
          <MapPin className="h-6 w-6 text-text-tertiary" />
          <h4 className="text-xs font-medium">{property.address}</h4>
          <p className="text-[10px] text-text-tertiary max-w-xs leading-relaxed">
            Interactive map integration (Mapbox / Google Maps API) will launch in Phase 5.
          </p>
        </div>
      </section>

    </div>
  );
}