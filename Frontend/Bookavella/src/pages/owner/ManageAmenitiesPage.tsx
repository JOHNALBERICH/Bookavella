import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { amenityService } from '../../features/amentity/services/amenityService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Input } from '../../../@/components/ui/input';
import { Button } from '../../../@/components/ui/button';
import { Loader2, Plus, Info, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageAmenitiesPage() {
  const queryClient = useQueryClient();
  const [newAmenityName, setNewAmenityName] = useState<string>('');

  const { data: amenitiesResponse, isLoading } = useQuery({
    queryKey: ['amenities'],
    queryFn: () => amenityService.getAllAmenities(),
    staleTime: Infinity,
  });

  const amenities = amenitiesResponse ??[];

  const createMutation = useMutation({
    mutationFn: (name: string) => amenityService.createAmenity(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      toast.success('Amenity created successfully');
      setNewAmenityName('');
    },
    onError: () => {
      toast.error('Failed to create amenity.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmenityName.trim()) {
      toast.error('Please fill name.');
      return;
    }
    createMutation.mutate(newAmenityName);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 font-body text-text-primary">
      <div className="space-y-1 border-b border-border pb-6">
        <h1 className="text-2xl font-heading font-semibold">Manage Amenities</h1>
        <p className="text-xs text-text-secondary">Explore and create structural amenities for property listings.</p>
      </div>

      {/* UX WARNING BANNER */}
      <div className="p-4 rounded-sm bg-info/10 border border-info/20 flex items-start gap-3">
        <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
        <p className="text-[11px] text-text-secondary leading-relaxed">
          {/* GAP WARNING: No backend do Bookavella, as comodidades cadastradas são compartilhadas e globais. 
              Qualquer novo registro adicionado por você ficará disponível na lista de opções gerais para todos os parceiros. */}
          <strong>Note:</strong> Amenities created here are saved inside the system's global master table. 
          They will instantly become available as selectable criteria for all property owner portfolios across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Formulário de Criação (Lateral Direita) */}
        <div className="md:col-span-4">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-heading">Add New Amenity</CardTitle>
              <CardDescription className="text-[11px]">Declare a new global amenity.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Name</label>
                  <Input 
                    required 
                    value={newAmenityName} 
                    onChange={e => setNewAmenityName(e.target.value)} 
                    placeholder="In-room Fireplace" 
                    className="bg-background text-sm h-10 border-border" 
                  />
                </div>
                <Button type="submit" disabled={createMutation.isPending} className="w-full h-10 text-xs flex items-center gap-1.5 cursor-pointer">
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Save Amenity</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Listagem (Lateral Esquerda) */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-2">
            <LayoutGrid className="h-4.5 w-4.5 text-accent" />
            <h3 className="text-sm font-semibold tracking-wide">Registered Amenities ({amenities.length})</h3>
          </div>

          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {amenities.map(amenity => (
                <div key={amenity.amenityId} className="px-3 py-2 border border-border bg-surface/50 rounded-sm text-xs text-text-secondary font-medium">
                  {amenity.amenityName}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}