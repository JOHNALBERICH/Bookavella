import { useState } from 'react';
import { RoomFilters } from '@/features/room/types';
import { RoomType, BedType, RoomStatus } from '@/types';
import { SlidersHorizontal, Check, X } from 'lucide-react';
import { Button } from '../../@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  filters: RoomFilters;
  onChange: (filters: RoomFilters) => void;
}

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Manipuladores de Estado de Filtros Múltiplos (Checkboxes)
  const handleToggleRoomType = (type: RoomType) => {
    // Como o RoomFilters do backend só suporta um único RoomType devido à assinatura restritiva de tipos,
    // alternamos a seleção para o tipo selecionado ou limpamos se clicado novamente.
    const newType = filters.roomType === type ? undefined : type;
    onChange({ ...filters, roomType: newType });
  };

  const handleToggleBedType = (type: BedType) => {
    const newBed = filters.bedType === type ? undefined : type;
    onChange({ ...filters, bedType: newBed });
  };

  const handleToggleStatus = (availableOnly: boolean) => {
    // Available status corresponde ao enum RoomStatus.Available
    const newStatus = availableOnly ? 'Available' as RoomStatus.Available : undefined;
    onChange({ ...filters, roomStatus: newStatus });
  };

  const handleClearFilters = () => {
    onChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  // Conteúdo do Formulário de Filtros (Reutilizado no Mobile e no Desktop)
  const renderFiltersContent = () => (
    <div className="space-y-6 text-text-primary font-body">
      {/* Seção: Tipo de Quarto */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Room Type</h4>
        <div className="flex flex-col gap-2">
          {Object.values(RoomType).map((type) => {
            const isSelected = filters.roomType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleToggleRoomType(type)}
                className="flex items-center gap-2.5 text-xs text-text-secondary hover:text-text-primary transition-colors text-left"
              >
                <div className={cn(
                  "h-4 w-4 rounded-sm border border-border flex items-center justify-center transition-colors",
                  isSelected ? "bg-accent border-accent text-background" : "bg-background"
                )}>
                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                <span>{type}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seção: Tipo de Camas */}
      <div className="space-y-3 border-t border-border pt-5">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Bed Configuration</h4>
        <div className="flex flex-col gap-2">
          {Object.values(BedType).map((bed) => {
            const isSelected = filters.bedType === bed;
            return (
              <button
                key={bed}
                type="button"
                onClick={() => handleToggleBedType(bed)}
                className="flex items-center gap-2.5 text-xs text-text-secondary hover:text-text-primary transition-colors text-left"
              >
                <div className={cn(
                  "h-4 w-4 rounded-sm border border-border flex items-center justify-center transition-colors",
                  isSelected ? "bg-accent border-accent text-background" : "bg-background"
                )}>
                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                <span>{bed}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seção: Disponibilidade do Quarto */}
      <div className="space-y-3 border-t border-border pt-5">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Availability</h4>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleToggleStatus(false)}
            className="flex items-center gap-2.5 text-xs text-text-secondary hover:text-text-primary transition-colors text-left"
          >
            <div className={cn(
              "h-4 w-4 rounded-full border border-border flex items-center justify-center transition-colors",
              filters.roomStatus === undefined ? "border-accent bg-accent/20" : "bg-background"
            )}>
              {filters.roomStatus === undefined && <div className="h-2 w-2 rounded-full bg-accent" />}
            </div>
            <span>All Accommodations</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggleStatus(true)}
            className="flex items-center gap-2.5 text-xs text-text-secondary hover:text-text-primary transition-colors text-left"
          >
            <div className={cn(
              "h-4 w-4 rounded-full border border-border flex items-center justify-center transition-colors",
              filters.roomStatus === 'Available' ? "border-accent bg-accent/20" : "bg-background"
            )}>
              {filters.roomStatus === 'Available' && <div className="h-2 w-2 rounded-full bg-accent" />}
            </div>
            <span>Available Rooms Only</span>
          </button>
        </div>
      </div>

      {/* Botão de Limpar */}
      {hasActiveFilters && (
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="w-full text-xs h-9 border-dashed flex items-center gap-2"
        >
          <X className="h-3.5 w-3.5" />
          Clear active filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR (Fica fixo na lateral esquerda) */}
      <aside className="hidden lg:block w-64 bg-surface border border-border rounded-lg p-6 h-fit sticky top-24">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
          <h3 className="font-heading font-medium text-sm text-text-primary flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-accent" />
            Filters
          </h3>
        </div>
        {renderFiltersContent()}
      </aside>

      {/* MOBILE TRIGGER BUTTON & BOTTOM SHEET */}
      <div className="block lg:hidden w-full">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full h-11 flex items-center justify-center gap-2 text-xs">
              <SlidersHorizontal className="h-4 w-4 text-accent" />
              Filter sanctuaries
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-lg bg-surface border-t border-border text-text-primary">
            <SheetHeader className="text-left border-b border-border pb-4 mb-4">
              <SheetTitle className="font-heading text-lg font-bold flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-accent" />
                Refine Search
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-[calc(80vh-100px)] pb-10">
              {renderFiltersContent()}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}