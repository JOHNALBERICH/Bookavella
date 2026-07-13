import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/features/property/services/propertyService';
import { PropertyStatus } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '../../../@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, Search, Trash2, Eye, Building2 } from 'lucide-react';
import { toast } from 'sonner';

// ═══ TODO: RECOMENDAÇÃO DE ENDPOINTS DE BACKEND (BACKEND GAPS) ═══
//
// 1. DELETE /Properties/{id} (Admin Force Delete)
//    - Permissão: Role "Admin" obrigatória
//    - PathParam: id (Guid da propriedade)
//    - Returns: ApiResponse<{ message: string }>
//    - Comentário: O endpoint atual /Properties/Delete-Property/{id} (Fase 5) é compartilhado por proprietários.
//      Recomenda-se criar uma rota administrativa isolada para auditoria centralizada.
//
// 2. Extensão do DTO PropertySearchResponse
//    - Campos faltantes: status (PropertyStatus) e createdAt (string)
//    - Comentário: O DTO atual de busca não retorna estes atributos, forçando o frontend a utilizar
//      fallbacks locais provisórios para exibir na tabela de moderação.

export default function AdminPropertiesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | PropertyStatus>('all');

  // 1. Carrega todas as propriedades registradas (Admin visualiza todo o catálogo)
  const { data: propertiesResponse, isLoading } = useQuery({
    queryKey: ['properties', 'admin', 'list'],
    queryFn: () => propertyService.searchProperties({}),
  });

  const allProperties = propertiesResponse?.data || [];

  // 2. Mutação de Exclusão Forçada (Força a deleção do hotel e seus quartos vinculados)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertyService.deleteProperty(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success(response.message || 'Property force-deleted successfully by Admin.');
    },
    onError: () => {
      toast.error('Failed to force-delete property. Admin authorization required.');
    },
  });

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      'WARNING: You are about to FORCE DELETE this property. This action will permanently remove all associated rooms, image portfolios, bookings, and payments. Proceed?'
    );
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };

  // Regra de Filtragem e Busca em Nível de Cliente (Client-side search)
  const filteredProperties = allProperties.filter((p) => {
    const matchesSearch =
      p.propertyname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase());

    // GAP WARNING: O DTO de busca (PropertySearchResponse) não traz status. Assumimos Available temporariamente.
    const currentStatus = (p as { status?: PropertyStatus }).status || PropertyStatus.Available;
    const matchesStatus = activeTab === 'all' ? true : currentStatus === activeTab;

    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'all', label: 'All Properties' },
    { id: PropertyStatus.Available, label: 'Available' },
    { id: PropertyStatus.Unavailable, label: 'Unavailable' },
    { id: PropertyStatus.UnderMaintenance, label: 'Maintenance' },
  ];

  return (
    <div className="space-y-8 text-text-primary font-body pb-12">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-6">
        <h1 className="text-2xl font-heading font-semibold">Properties Moderation</h1>
        <p className="text-xs text-text-secondary">Monitor, inspect and force-manage listed hotel sanctuaries.</p>
      </div>

      {/* Search & Tabs Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Pesquisa */}
        <div className="relative w-full md:w-80 h-10 bg-surface border border-border rounded-sm px-3 flex items-center text-text-primary transition-all focus-within:border-error">
          <Search className="h-4 w-4 text-text-tertiary shrink-0 mr-2" />
          <input
            type="text"
            placeholder="Search by hotel name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-0 p-0 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none h-full"
          />
        </div>

        {/* Abas de Filtros por Status */}
        <div className="flex items-center bg-surface border border-border p-1 rounded-sm gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'px-3 py-1.5 rounded-sm text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap',
                  isActive 
                    ? 'bg-error text-background' 
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Listagem */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <span className="text-xs text-text-secondary">Loading properties...</span>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="h-72 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-8 bg-surface/30 gap-4 text-center">
          <Building2 className="h-8 w-8 text-text-tertiary" />
          <h3 className="text-sm font-semibold">No properties registered</h3>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-md overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50 text-text-secondary uppercase tracking-wider text-[10px]">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Owner</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Created</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProperties.map((p) => {
                // GAP WARNING: O DTO de busca (PropertySearchResponse) não traz status e createdAt do banco.
                // Adicionamos fallbacks provisórios e sugerimos a extensão do DTO no backend.
                const status = (p as { status?: PropertyStatus }).status || PropertyStatus.Available;
                const createdDate = (p as { createdAt?: string }).createdAt 
                  ? new Date(p.createdAt).toLocaleDateString('pt-BR') 
                  : '01/07/2026'; // Data corrente de montagem da Fase 6

                return (
                  <tr key={p.id} className="hover:bg-background/20 transition-colors">
                    <td className="p-4 font-medium text-text-primary">{p.propertyname}</td>
                    <td className="p-4 text-text-secondary">{p.ownername}</td>
                    <td className="p-4 text-text-secondary">{p.city}</td>
                    <td className="p-4 text-text-secondary capitalize">{p.propertytype}</td>
                    <td className="p-4">
                      <StatusBadge status={status} type="property" />
                    </td>
                    <td className="p-4 text-text-secondary">{createdDate}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          variant="ghost" 
                          className="h-8 px-2 text-[11px] flex items-center gap-1"
                          onClick={() => navigate(`/properties/${p.id}`)}
                        >
                          <Eye className="h-3.5 w-3.5" /> Inspect
                        </Button>
                        
                        {/* Botão de Exclusão Forçada (Acento error administrativo) */}
                        <Button 
                          variant="ghost" 
                          disabled={deleteMutation.isPending}
                          className="h-8 px-2 text-[11px] text-error hover:bg-error/10 hover:text-error"
                          onClick={() => handleDelete(p.id)}
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-3.5 w-3.5" /> Force Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}