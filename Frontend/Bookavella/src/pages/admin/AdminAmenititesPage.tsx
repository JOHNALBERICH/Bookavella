import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { amenityService } from '../../features/amentity/services/amenityService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Input } from '../../../@/components/ui/input';
import { Button } from '../../../@/components/ui/button';
import { Loader2, Plus, AlertTriangle, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';

// ═══ TODO: RECOMENDAÇÃO DE ENDPOINTS DE BACKEND (BACKEND GAPS) ═══
//
// 1. DELETE /Amenities/{id} (Admin Delete Amenity)
//    - Permissão: Role "Admin" obrigatória
//    - PathParam: id (Guid da comodidade mestre)
//    - Returns: ApiResponse<{ message: string }>
//    - Comentário: O backend atual não possui um endpoint para exclusão física ou lógica de comodidades.
//      Qualquer termo digitado incorretamente por um proprietário parceiro ou administrador ficará retido
//      perpetuamente no banco de dados mestre global, gerando poluição do catálogo e inconsistência de dados.

export default function AdminAmenitiesPage() {
  const queryClient = useQueryClient();
  const [newAmenityName, setNewAmenityName] = useState<string>('');

  // 1. Carrega todas as comodidades mestre salvas no banco
  const { data: amenitiesResponse, isLoading } = useQuery({
    queryKey: ['amenities', 'admin'],
    queryFn: () => amenityService.getAllAmenities(),
  });

  const amenities = amenitiesResponse?.data || [];

  // 2. Mutação de Cadastro de nova comodidade global
  const createMutation = useMutation({
    mutationFn: (name: string) => amenityService.createAmenity(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
      toast.success('Amenity created successfully in master catalog!');
      setNewAmenityName('');
    },
    onError: () => {
      toast.error('Failed to create amenity.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmenityName.trim()) {
      toast.error('Please enter a valid amenity name.');
      return;
    }
    createMutation.mutate(newAmenityName.trim());
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 font-body text-text-primary">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-6">
        <h1 className="text-2xl font-heading font-semibold">Global Amenities Catalog</h1>
        <p className="text-xs text-text-secondary">Inspect and expand the master list of hotel conveniences.</p>
      </div>

      {/* BACKEND DELETION GAP WARNING */}
      <div className="p-4 rounded-sm bg-error/10 border border-error/20 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-error shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-error uppercase">No Deletion Endpoint Configured</span>
          <p className="text-[11px] text-text-secondary leading-relaxed max-w-2xl">
            The database currently lacks a `DELETE /Amenities` route. Admin moderation team is unable to clean up duplicated, misspelled or deprecated amenities from the list below. This database constraint needs resolution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Formulário de Criação (Acento Administrativo error) */}
        <div className="md:col-span-4">
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-sm font-heading">Add Master Amenity</CardTitle>
              <CardDescription className="text-[11px]">Declare a new global amenity option.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Amenity Name</label>
                  <Input 
                    required 
                    value={newAmenityName} 
                    onChange={e => setNewAmenityName(e.target.value)} 
                    placeholder="e.g. Helipad Access" 
                    className="bg-background text-sm h-10 border-border focus:border-error" 
                  />
                </div>
                <Button type="submit" disabled={createMutation.isPending} className="w-full h-10 text-xs flex items-center gap-1.5 cursor-pointer bg-error hover:bg-error/90 text-background">
                  {createMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4" /> Save Amenity
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Listagem Global de Comodidades */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-2">
            <LayoutGrid className="h-4.5 w-4.5 text-error" />
            <h3 className="text-sm font-semibold tracking-wide">Amenities Master Database ({amenities.length})</h3>
          </div>

          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {amenities.map(amenity => (
                <div 
                  key={amenity.amenityId} 
                  className="px-3 py-2 border border-border bg-surface/50 rounded-sm text-xs text-text-secondary font-medium hover:border-error/40 transition-colors"
                >
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