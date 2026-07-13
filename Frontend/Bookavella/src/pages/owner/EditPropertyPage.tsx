import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/features/property/services/propertyService';
import { UpdatePropertyRequest } from '@/features/property/types';
import { PropertyStatus } from '@/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Input } from '../../../@/components/ui/input';
import { Button } from '../../../@/components/ui/button';

export default function EditPropertyPage() {
  const { id } = useParams();
  const propertyId = id || '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: detailsResponse, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => propertyService.getPropertyDetails(propertyId),
    enabled: !!propertyId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePropertyRequest) => propertyService.updateProperty(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
      toast.success('Property updated successfully');
      navigate('/owner/properties');
    },
    onError: () => {
      toast.error('Failed to update property.');
    },
  });

  const [form, setForm] = useState<UpdatePropertyRequest>({
    name: '',
    description: '',
    type: 'Hotel',
    city: '',
    country: '',
    address: '',
    value_perNight: 100,
    status: PropertyStatus.Available,
    Amenities: [] as string[] ,
    ImageUrl: [] as string[],
  });

  useEffect(() => {
  if (!detailsResponse) return;

  const p = detailsResponse;
console.log(detailsResponse);
  setForm({
    name: p.name,
    description: p.description,
    type: p.propertyType,
    city: p.city,
    country: p.country,
    address: p.address,
    value_perNight: p.value_perNight,
    status: p.status,
    Amenities: p.propertyAmenities?.map(a => a.amenityId) ?? [],
    ImageUrl: p.propertyImages?.map(i => i.url) ?? [],
  });
}, [detailsResponse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <span className="text-xs text-text-secondary">Loading rascunho...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8 font-body text-text-primary">
      <div className="space-y-1">
        <h1 className="text-2xl font-heading font-semibold">Edit Property</h1>
        <p className="text-xs text-text-secondary">Modify structural settings and fonctionnement state of your hotel.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-surface border-border">
          <CardHeader><CardTitle className="text-sm font-heading">Settings details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Property Name</label>
              <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-background text-sm h-10 border-border" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Description</label>
              <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-background border border-border rounded-sm text-sm p-3 min-h-[100px] text-text-primary focus:outline-none focus:border-accent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Operating Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value as PropertyStatus})} className="w-full bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none">
                  <option value={PropertyStatus.Available}>Available</option>
                  <option value={PropertyStatus.Unavailable}>Unavailable</option>
                  <option value={PropertyStatus.UnderMaintenance}>Under Maintenance</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Per Night (R$)</label>
                <Input type="number" required value={form.value_perNight} onChange={e => setForm({...form, value_perNight: Number(e.target.value)})} className="bg-background text-sm h-10 border-border" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 border-t border-[#27272A] pt-4">
          <Button type="submit" disabled={updateMutation.isPending} className="h-10 text-xs px-6 cursor-pointer">
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}