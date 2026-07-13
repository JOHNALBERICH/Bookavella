import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/features/property/services/propertyService';
import { PropertySearchParams } from '@/features/property/types';
import { RoomFilters } from '@/features/room/types';
import FilterSidebar from '@/components/FilterSidebar';
import PropertyCard from '@/components/PropertyCard';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import EmptyState from '@/components/EmptyState'; // Importação do EmptyState
import { Inbox, Loader2 } from 'lucide-react';
import { Button } from '../../../@/components/ui/button';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(1);
  const pageSize = 6;

  const [roomFilters, setRoomFilters] = useState<RoomFilters>({
    roomType: (searchParams.get('roomType') as any) || undefined,
    bedType: (searchParams.get('bedType') as any) || undefined,
  });

  const queryParams: PropertySearchParams = {
    city: searchParams.get('city') || undefined,
    checkIn: searchParams.get('checkIn') || undefined,
    checkOut: searchParams.get('checkOut') || undefined,
    maxGuests: searchParams.get('maxGuests') ? Number(searchParams.get('maxGuests')) : undefined,
    propertyType: searchParams.get('propertyType') || undefined,
    
  };

  const { data: searchResponse, isLoading } = useQuery({
    queryKey: ['properties', 'filter', queryParams, page],
    queryFn: () => propertyService.searchProperties(queryParams),
  });

  const rawProperties = searchResponse?.items || [];

  const filteredProperties = rawProperties.filter((property) => {
    if (roomFilters.roomType && property.propertytype !== roomFilters.roomType) {
      return false;
    }
    return true;
  });

  const paginatedProperties = filteredProperties.slice((page - 1) * pageSize, page * pageSize);

  const handleSearchBarSearch = (newParams: PropertySearchParams) => {
    const updatedParams = new URLSearchParams(searchParams);
    
    if (newParams.city) updatedParams.set('city', newParams.city);
    else updatedParams.delete('city');

    if (newParams.checkIn) updatedParams.set('checkIn', newParams.checkIn);
    else updatedParams.delete('checkIn');

    if (newParams.checkOut) updatedParams.set('checkOut', newParams.checkOut);
    else updatedParams.delete('checkOut');

    if (newParams.maxGuests) updatedParams.set('maxGuests', String(newParams.maxGuests));
    else updatedParams.delete('maxGuests');

    setPage(1);
    setSearchParams(updatedParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
    setRoomFilters({});
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-20 text-text-primary font-body">
      <div className="bg-surface p-4 border border-border rounded-md shadow-sm">
        <SearchBar onSearch={handleSearchBarSearch} defaultValues={queryParams} variant="full" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <FilterSidebar filters={roomFilters} onChange={setRoomFilters} />

        <div className="flex-1 space-y-6 w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="aspect-video w-full bg-surface border border-border animate-pulse rounded-md" />
                  <div className="h-4 w-3/4 bg-border/50 animate-pulse rounded-sm" />
                </div>
              ))}
            </div>
          ) : paginatedProperties.length === 0 ? (
            /* ACOPLAMENTO DO EMPTYSTATE DE BUSCA */
            <EmptyState
              icon={Inbox}
              title="No properties found for your search"
              description="Try refining your location search terms or clearing some of the active filters in your sidebar."
              action={
                <Button onClick={handleClearFilters} variant="outline" className="h-9 text-xs cursor-pointer">
                  Clear All Filters
                </Button>
              }
            />
          ) : (
            <>
              <ErrorBoundary fallback={<div className="p-8 border border-dashed border-border rounded-md text-center text-text-secondary">Failed to display search results grid safely.</div>}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedProperties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              </ErrorBoundary>

              <Pagination
                total={filteredProperties.length}
                page={page}
                pageSize={pageSize}
                onChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}