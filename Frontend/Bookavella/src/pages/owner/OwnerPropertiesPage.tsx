import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/features/property/services/propertyService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../../../@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState'; // Importação do EmptyState
import { Plus, Table as TableIcon, LayoutGrid, Eye, Edit, Trash2, Loader2, Home } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import PropertyCard from '../../components/PropertyCard';
export default function OwnerPropertiesPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const ownerId = currentUser?.id || '';

  const { data: propertiesResponse = [], isLoading } = useQuery({
    queryKey: ['properties', ownerId],
    queryFn: () => propertyService.getOwnerProperties(ownerId),
    enabled: !!ownerId,
  });

  const rawProperties = propertiesResponse ?? [];
 // const ownerProperties = rawProperties.filter((p) => p.ownername === currentUser?.name);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertyService.deleteProperty(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'owner', ownerId] });
      toast.success(response.message || 'Property deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete property. Please try again.');
    },
  });

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this property? All rooms associated will be deleted.');
    if (confirmed) {
      deleteMutation.mutate(id);
    }
  };
  console.log("currentUser", currentUser);

console.log("propertiesResponse", propertiesResponse);

console.log("raw", rawProperties);

console.log("owner", ownerId);

  return (
    <div className="space-y-8 text-text-primary font-body pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-heading font-semibold">My Properties</h1>
          <p className="text-xs text-text-secondary">Manage and update your hotel portfolio details.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface border border-border p-1 rounded-sm gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={cn('p-1.5 rounded-sm cursor-pointer transition-colors', viewMode === 'table' ? 'bg-accent text-background' : 'text-text-secondary hover:text-text-primary')}
            >
              <TableIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn('p-1.5 rounded-sm cursor-pointer transition-colors', viewMode === 'grid' ? 'bg-accent text-background' : 'text-text-secondary hover:text-text-primary')}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <Button asChild className="h-10 text-xs px-4 flex items-center gap-1.5 cursor-pointer">
            <Link to="/owner/properties/create">
              <Plus className="h-4 w-4" /> Add Property
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <span className="text-xs text-text-secondary">Loading properties...</span>
        </div>
      ) : rawProperties.length === 0 ? (
        /* ACOPLAMENTO DO EMPTYSTATE DE PROPRIEDADES DO DONO */
        <EmptyState
          icon={Home}
          title="You haven't added any properties yet"
          description="Start by adding your first luxury boutique hotel or design sanctuary to list rooms and accept bookings."
          action={
            <Button asChild className="h-9 text-xs flex items-center gap-1.5 cursor-pointer">
              <Link to="/owner/properties/create">
                <Plus className="h-4 w-4" />
                Add Your First Property
              </Link>
            </Button>
          }
        />
      ) : (
        /* Renderização das tabelas/grades */
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rawProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
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
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rawProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-background/20 transition-colors">
                    <td className="p-4 font-medium text-text-primary">{p.propertyname}</td>
                    <td className="p-4 text-text-secondary">{p.ownername}</td>
                    <td className="p-4 text-text-secondary">{p.city}</td>
                    <td className="p-4 text-text-secondary capitalize">{p.propertytype}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" className="h-8 px-2 text-[11px] flex items-center gap-1" onClick={() => navigate(`/owner/properties/${p.id}`)}>
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                        <Button variant="ghost" className="h-8 px-2 text-[11px] flex items-center gap-1" onClick={() => navigate(`/owner/properties/${p.id}/edit`)}>
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button variant="ghost" className="h-8 px-2 text-[11px] flex items-center gap-1 text-error hover:bg-error/10 hover:text-error" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}