import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/features/property/services/propertyService';
import { 
  PropertiesFilterRequest, 
  PropertySearchResponse, 
  PaginationResponse, 
  PropertyStatus 
} from '@/types';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import Pagination from '@/components/Pagination';
import { Button } from '../../../@/components/ui/button';
import { Input } from '../../../@/components/ui/input';
import { cn } from '@/lib/utils';
import { Loader2, Search, Trash2, Eye, Building2, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPropertiesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [nameQuery, setNameQuery] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('All');
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize = 10;

  // 1. Constrói o payload de filtros conforme PropertiesFilterRequest (Fase 6 - Task 9)
  const filterParams: PropertiesFilterRequest = {
    Name: nameQuery || undefined,
    PropertyType: propertyType === 'All' ? undefined : propertyType,
    'Pagination.PageIndex': pageIndex,
    'Pagination.PageSize': pageSize,
  };

  // 2. Query de Busca Administrativa (Admin vê tudo)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['properties', 'admin', 'filter', filterParams],
    queryFn: () => propertyService.searchProperties(filterParams as any),
  });

  // 3. Mutação para Forçar Exclusão de Anúncios Inadequados
  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertyService.deleteProperty(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success(response.message || 'Property force-deleted successfully by Administrator.');
    },
    onError: () => {
      toast.error('Failed to delete property. Admin permission required.');
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

  // ◄ PERFORMANCE E RESILIÊNCIA: Desempacotamento dinâmico que suporta tanto o novo wrapper 
  // PaginationResponse quanto listas planas padrão retornadas pela API.
  const items: PropertySearchResponse[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data as unknown as PaginationResponse<PropertySearchResponse>)?.items || [];

  const totalCount: number = Array.isArray(data?.data)
    ? data.data.length
    : (data?.data as unknown as PaginationResponse<PropertySearchResponse>)?.totalCount || 0;

  const handleResetFilters = () => {
    setNameQuery('');
    setPropertyType('All');
    setPageIndex(1);
  };

  const propertyTypes = ['All', 'Hotel', 'Boutique', 'Resort', 'Villa', 'Apartment'];

  return (
    <div className="space-y-8 text-text-primary font-body pb-12">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-6">
        <h1 className="text-2xl font-heading font-semibold">Listed Properties Moderation</h1>
        <p className="text-xs text-text-secondary">Inspect, filter and force-delete listed hotel sanctuaries.</p>
      </div>

      {/* Filter and Search Actions (Acento Administrativo error) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Input de Busca */}
        <div className="relative w-full md:w-80 h-10 bg-surface border border-border rounded-sm px-3 flex items-center text-text-primary transition-all focus-within:border-error">
          <Search className="h-4 w-4 text-text-tertiary shrink-0 mr-2" />
          <Input
            type="text"
            placeholder="Search by hotel name..."
            value={nameQuery}
            onChange={(e) => {
              setNameQuery(e.target.value);
              setPageIndex(1);
            }}
            className="border-0 bg-transparent h-full px-0 focus-visible:ring-0 shadow-none text-xs text-text-primary placeholder:text-text-tertiary"
          />
        </div>

        {/* Seletor de Categoria */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-4 w-4 text-text-tertiary shrink-0" />
          <select
            value={propertyType}
            onChange={(e) => {
              setPropertyType(e.target.value);
              setPageIndex(1);
            }}
            className="bg-surface border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none focus:border-error"
          >
            {propertyTypes.map((t) => (
              <option key={t} value={t}>{t}s</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade de Resultados */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <span className="text-xs text-text-secondary">Loading properties database...</span>
        </div>
      ) : items.length === 0 ? (
        /* ACOPLAMENTO DO EMPTYSTATE REUTILIZÁVEL */
        <EmptyState
          icon={Building2}
          title="No properties found for your search"
          description="We couldn't find any hotel listings matching your active filters in our database."
          action={
            <Button onClick={handleResetFilters} variant="outline" className="h-9 text-xs cursor-pointer">
              Reset Search Criteria
            </Button>
          }
        />
      ) : (
        /* TABELA DE MODERAÇÃO DE PROPRIEDADES */
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-md overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/50 text-text-secondary uppercase tracking-wider text-[10px]">
                  <th className="p-4 font-semibold">Property Name</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Owner Name</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Created Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((p) => {
                  // GAP WARNING: O DTO de busca não retorna status da propriedade. 
                  // Mapeamos de forma segura para PropertyStatus.Available temporariamente.
                  const status = (p as any).status || PropertyStatus.Available;
                  const date = p.createdAt 
                    ? new Date(p.createdAt).toLocaleDateString('pt-BR') 
                    : '01/07/2026';

                  return (
                    <tr key={p.id} className="hover:bg-background/20 transition-colors">
                      <td className="p-4 font-medium text-text-primary">{p.propertyname}</td>
                      <td className="p-4 text-text-secondary">{p.city}, {p.country}</td>
                      <td className="p-4 text-text-secondary">{p.ownername}</td>
                      <td className="p-4 text-text-secondary capitalize">{p.propertytype}</td>
                      <td className="p-4">
                        <StatusBadge status={status} type="property" />
                      </td>
                      <td className="p-4 text-text-secondary">{date}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            className="h-8 px-2 text-[11px] flex items-center gap-1.5"
                            onClick={() => navigate(`/properties/${p.id}`)}
                          >
                            <Eye className="h-3.5 w-3.5" /> Inspect
                          </Button>
                          
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

          {/* Paginação */}
          <Pagination
            total={totalCount}
            page={pageIndex}
            pageSize={pageSize}
            onChange={setPageIndex}
          />
        </div>
      )}
    </div>
  );
}