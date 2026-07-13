import { useState } from 'react';
import { PropertySearchParams } from '@/features/property/types';
import { Search, MapPin, Calendar as CalendarIcon, Users } from 'lucide-react';
import { Button } from '../../@/components/ui/button';
import { Input } from '../../@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (params: PropertySearchParams) => void;
  defaultValues?: Partial<PropertySearchParams>;
  variant?: 'compact' | 'full';
}

export default function SearchBar({
  onSearch,
  defaultValues,
  variant = 'full',
}: SearchBarProps) {
  const [city, setCity] = useState(defaultValues?.city || '');
  const [checkIn, setCheckIn] = useState(defaultValues?.checkIn || '');
  const [checkOut, setCheckOut] = useState(defaultValues?.checkOut || '');
  const [maxGuests, setMaxGuests] = useState<number>(defaultValues?.maxGuests || 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      city: city || undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      maxGuests: maxGuests || undefined,
    });
  };

  if (variant === 'compact') {
    return (
      <form 
        onSubmit={handleSubmit}
        className="flex items-center bg-surface border border-border rounded-sm h-9 px-3 w-64 text-text-primary transition-all focus-within:border-accent"
      >
        <Input
          type="text"
          placeholder="Search destination..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border-0 bg-transparent h-full px-0 focus-visible:ring-0 shadow-none text-xs text-text-primary placeholder:text-text-tertiary"
        />
        <button type="submit" className="focus:outline-none cursor-pointer">
          <Search className="h-4 w-4 text-text-tertiary hover:text-accent transition-colors" />
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-surface border border-border p-3 md:p-4 rounded-md shadow-lg grid grid-cols-1 md:grid-cols-12 gap-3 items-center font-body text-text-primary"
    >
      {/* Destino */}
      <div className="md:col-span-4 flex items-center gap-3 px-3 py-2 rounded-sm border border-border bg-background focus-within:border-accent transition-colors">
        <MapPin className="h-4 w-4 text-text-tertiary shrink-0" />
        <div className="flex-1 flex flex-col">
          <label className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">Destination</label>
          <input
            type="text"
            placeholder="e.g. Kyoto, Japan"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-transparent border-0 p-0 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none h-6"
          />
        </div>
      </div>

      {/* Check-In */}
      <div className="md:col-span-2 flex items-center gap-3 p-4 rounded-sm border border-border bg-background">
        <div className="space-y-0.5 w-full">
          <label className="block text-[10px] font-medium text-text-secondary uppercase tracking-wider">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent border-none text-xs text-text-primary focus:outline-none h-6 filter invert dark:invert-0"
          />
        </div>
      </div>

      {/* Check-Out */}
      <div className="md:col-span-2 flex items-center gap-3 p-4 rounded-sm border border-border bg-background">
        <div className="space-y-0.5">
          <h4 className="text-xs font-medium text-text-secondary">Check-out</h4>
          <input
//            type="password" /* Oculta ou exibe datas como texto plano */
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-background text-text-primary text-xs h-6 border-none focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      {/* Hóspedes */}
      <div className="md:col-span-2 flex items-center justify-between p-4 rounded-sm border border-border bg-background">
        <div className="space-y-0.5">
          <h4 className="text-xs font-medium text-text-secondary">Guests</h4>
          <input
            type="number"
            min={1}
            value={maxGuests || ''}
            onChange={(e) => setMaxGuests(e.target.value ? Number(e.target.value) : 1)}
            placeholder="1 guest"
            className="bg-transparent border-none text-sm text-text-primary focus:outline-none w-full h-6"
          />
        </div>
      </div>

      {/* Ação */}
      <div className="md:col-span-2">
        <Button
          type="submit"
          className="w-full h-14 bg-accent text-background hover:bg-accent-hover font-semibold transition-colors flex items-center justify-center gap-2 rounded-sm"
        >
          <Search className="h-5 w-5" />
          <span>Explore</span>
        </Button>
      </div>
    </form>
  );
}