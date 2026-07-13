import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/features/property/services/propertyService';
import { PropertySearchParams } from '@/features/property/types';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { ROUTES } from '@/constants';
import { Sparkles, Calendar, BadgeCheck, Compass } from 'lucide-react';
import { Property} from '@/types';
import { PropertySearchResponse } from '@/types';

export default function HomePage() {
  const navigate = useNavigate();

  // Carrega as 6 principais propriedades registradas no banco como "destaques"
  const { data: featuredResponse, isLoading } = useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: () => propertyService.searchProperties({
      'Pagination.PageIndex': 1,
      'Pagination.PageSize': 6,
      
    }),
  });

  const featuredProperties = featuredResponse?.items ?? [];

  const handleSearch = (params: PropertySearchParams) => {
    const queryParams = new URLSearchParams();
    if (params.city) queryParams.set('city', params.city);
    if (params.checkIn) queryParams.set('checkIn', params.checkIn);
    if (params.checkOut) queryParams.set('checkOut', params.checkOut);
    if (params.maxGuests) queryParams.set('maxGuests', String(params.maxGuests));
    
    navigate(`${ROUTES.SEARCH}?${queryParams.toString()}`);
  };

  const handleBrowseType = (type: string) => {
    navigate(`${ROUTES.SEARCH}?propertyType=${type}`);
  };

    
  const propertyTypes = ['Hotel', 'Boutique', 'Resort', 'Villas', 'Apartment'];

  return (
    <div className="space-y-24 pb-20 text-text-primary font-body">
      
      {/* SECTION 1: HERO (CSS Gradient Editorial, sem dependências de fotos de banco) */}
      <section className="relative w-full rounded-lg overflow-hidden border border-border bg-gradient-to-tr from-[#0F0F11] via-[#111113] to-[#181512] py-24 md:py-32 px-6 flex flex-col items-center text-center gap-8 shadow-inner">
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#0A0A0B]/80 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent font-semibold tracking-wide uppercase">
            <Sparkles className="h-3 w-3" />
            Curated Luxury Hospitality
          </span>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight tracking-tight text-[#FAFAFA]">
            Find your perfect <span className="text-accent italic font-light">stay</span>
          </h1>
          <p className="text-xs md:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
            A curation of minimalist sanctuaries, design-focused boutique hotels, and villas designed by world-renowned architects.
          </p>
        </div>

        {/* Barra de Busca (Full Variant) */}
        <div className="relative z-10 w-full max-w-4xl">
          <SearchBar onSearch={handleSearch} variant="full" />
        </div>
      </section>

      {/* SECTION 2: FEATURED PROPERTIES */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-heading font-semibold">Featured Sanctuaries</h2>
            <p className="text-xs text-text-secondary">Our editorial selection of outstanding spaces this week.</p>
          </div>
          <Link to={ROUTES.SEARCH} className="text-xs text-accent hover:text-accent-hover font-semibold transition-colors">
            View all sanctuaries →
          </Link>
        </div>

        {isLoading ? (
          /* Esqueleto de Pulsação */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="space-y-4">
                <div className="aspect-video w-full bg-surface border border-border animate-pulse rounded-md" />
                <div className="h-4 w-3/4 bg-border/50 animate-pulse rounded-sm" />
                <div className="h-4 w-1/2 bg-border/50 animate-pulse rounded-sm" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />  
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3: BROWSE BY TYPE */}
      <section className="space-y-8 border-t border-border pt-16">
        <div className="space-y-1 text-center">
          <h2 className="text-xl font-heading font-medium">Browse by Sanctuary Type</h2>
          <p className="text-xs text-text-secondary">Filter our collection by architectural design and intent.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleBrowseType(type)}
              className="px-6 py-3 rounded-full bg-surface border border-border hover:border-accent text-xs font-semibold text-text-secondary hover:text-accent transition-all duration-normal cursor-pointer active:scale-95"
            >
              {type}s
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-border pt-20">
        <div className="space-y-3 text-center p-6">
          <div className="h-12 w-12 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent mx-auto">
            <Compass className="h-5 w-5" />
          </div>
          <h3 className="font-heading font-medium text-sm">1. Seek sanctuary</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Filter our database of micro-selected environments designed with architectural purpose.
          </p>
        </div>

        <div className="space-y-3 text-center p-6">
          <div className="h-12 w-12 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent mx-auto">
            <Calendar className="h-5 w-5" />
          </div>
          <h3 className="font-heading font-medium text-sm">2. Secure booking</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Reserve your dates through our high-performance, double-booking prevention pipeline.
          </p>
        </div>

        <div className="space-y-3 text-center p-6">
          <div className="h-12 w-12 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent mx-auto">
            <BadgeCheck className="h-5 w-5" />
          </div>
          <h3 className="font-heading font-medium text-sm">3. Arrive & experience</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Enjoy your luxury destination backed by seamless premium hosting check-in routines.
          </p>
        </div>
      </section>

    </div>
  );
}