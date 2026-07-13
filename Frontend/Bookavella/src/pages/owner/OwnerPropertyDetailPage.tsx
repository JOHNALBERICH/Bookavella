import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/features/property/services/propertyService';
import { roomService } from '@/features/room/services/roomService';
import { Button } from '../../../@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import RoomCard from '@/components/RoomCard';
import { Loader2, ArrowLeft, Edit, MapPin, DollarSign, Users, Building2 } from 'lucide-react';

export default function OwnerPropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id || '';
  const navigate = useNavigate();

  // 1. Carrega os detalhes do hotel do parceiro
  const { data: detailsResponse, isLoading: loadingDetails } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => propertyService.getPropertyDetails(propertyId),
    enabled: !!propertyId,
  });

  // 2. Carrega todos os quartos para realizar a junção relacional local
  // TODO: O backend não expõe uma rota direta para obter quartos associados a uma propriedade (/Rooms/Property/{id}).
  // Usamos como contingência o endpoint geral /Rooms/Get-All-Rooms e filtramos no cliente de forma síncrona.
  const { data: roomsResponse =[], isLoading: loadingRooms } = useQuery({
    queryKey: ['rooms', 'all'],
    queryFn: () => roomService.getRoomsByPropertyId(propertyId),
    enabled: !!propertyId,
  });

  const property = detailsResponse;
  const rawRooms = roomsResponse ?? [];
  const propertyRooms = rawRooms.filter((room) => room.propertyId === propertyId);

  const isLoading = loadingDetails || loadingRooms;

  if (isLoading || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] px-4 font-body">
        <div className="space-y-4 w-full max-w-[320px] text-center">
          <Loader2 className="h-6 w-6 animate-spin text-accent mx-auto" />
          <p className="text-xs uppercase tracking-wider text-text-secondary">Loading details...</p>
        </div>
      </div>
    );
  }

  const primaryImage =
    property.propertyImages?.find((img) => img.id)?.url ||
    property.propertyImages?.[0]?.url ||
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200'; // Fallback visual editorial

  return (
    <div className="space-y-8 text-text-primary font-body pb-12 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/owner/properties')}
        className="flex items-center gap-2 text-xs text-text-secondary hover:text-accent transition-colors cursor-pointer focus:outline-none"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Properties
      </button>

      {/* Hero Header Card */}
      <div className="relative aspect-video md:aspect-[21/9] w-full rounded-lg overflow-hidden border border-border bg-background shadow-sm">
        <img src={primaryImage} alt={property.name} className="h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 bg-accent/20 border border-accent/30 rounded-sm text-[10px] font-semibold tracking-wide uppercase text-accent">
                {property.propertyType}
              </span>
              <StatusBadge status={property.status} type="property" />
            </div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-[#FAFAFA]">
              {property.name}
            </h1>
            <p className="text-xs text-text-secondary flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span>{property.address}, {property.city}, {property.country}</span>
            </p>
          </div>

          <Button asChild className="h-10 text-xs px-5 flex items-center gap-1.5 cursor-pointer self-start md:self-auto">
            <Link to={`/owner/properties/edit/${property.id}`}>
              <Edit className="h-4 w-4" /> Edit Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-surface border border-border rounded-lg space-y-1.5 shadow-sm">
          <span className="text-[10px] text-text-tertiary uppercase tracking-wider block">Base Valuation</span>
          <div className="flex items-center gap-1 font-bold text-lg">
            <DollarSign className="h-5 w-5 text-accent" />
            <span>R$ {property.value_perNight.toLocaleString('pt-BR')}/night</span>
          </div>
        </div>

        <div className="p-5 bg-surface border border-border rounded-lg space-y-1.5 shadow-sm">
          <span className="text-[10px] text-text-tertiary uppercase tracking-wider block">Capacity Lotação</span>
          <div className="flex items-center gap-2 font-bold text-lg">
            <Users className="h-5 w-5 text-accent" />
            <span>Max {property.maxGuests} Guests</span>
          </div>
        </div>

        <div className="p-5 bg-surface border border-border rounded-lg space-y-1.5 shadow-sm">
          <span className="text-[10px] text-text-tertiary uppercase tracking-wider block">Portfolio Index</span>
          <div className="flex items-center gap-2 font-bold text-lg">
            <Building2 className="h-5 w-5 text-accent" />
            <span>ID: {property.id.substring(0, 8).toUpperCase()}...</span>
          </div>
        </div>
      </div>
      {/* Manage room */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-heading font-medium">Manage Rooms</h2>
          <p className="text-xs text-text-secondary">Control room types, status and prices of this hotel.</p>
        </div>
        <Button onClick={() => navigate(`/owner/properties/${propertyId}/rooms`)} className="h-10 text-xs px-4 flex items-center gap-1.5 cursor-pointer">
          <Edit className="h-4 w-4" /> Manage Rooms
        </Button>
      </div>
      {/* Available Rooms Grid */}
      <div className="space-y-6 pt-4 border-t border-border">
        <div className="space-y-1">
          <h2 className="text-xl font-heading font-medium">Associated Rooms ({propertyRooms.length})</h2>
          <p className="text-xs text-text-secondary">Explore bedroom configurations active on this property sanctuary.</p>
        </div>

        {propertyRooms.length === 0 ? (
          <div className="p-10 border border-dashed border-border rounded-md text-center bg-surface/30">
            <p className="text-xs text-text-tertiary">No rooms currently associated. Visit "Manage Rooms" to expand your catalog.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {propertyRooms.map((room) => (
              <RoomCard key={room.roomId} room={room} propertyId={property.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}