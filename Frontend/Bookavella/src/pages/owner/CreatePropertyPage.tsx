import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/features/property/services/propertyService';
import { amenityService } from '@/features/amentity/services/amenityService';
import { CreatePropertyRequest } from '@/features/property/types';
import { ROUTES } from '@/constants';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Input } from '../../../@/components/ui/input';
import { Button } from '../../../@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function CreatePropertyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const [images, setImages] = useState<{ url: string; isPrimary: boolean }[]>([
    { url: '', isPrimary: true }
  ]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Carrega comodidades mestre do sistema
  const { data: amenitiesResponse, isLoading: loadingAmenities } = useQuery({
    queryKey: ['amenities'],
    queryFn: () => amenityService.getAllAmenities(),
  });

  const amenities = amenitiesResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: (data: CreatePropertyRequest) => propertyService.createProperty(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property created successfully');
      navigate(`/properties/${response.id}`);
    },
    onError: () => {
      toast.error('Failed to create property. Please check parameters.');
    },
  });

  // Gerenciador simplificado de URLs de imagens locais
  const handleAddImage = () => setImages([...images, { url: '', isPrimary: false }]);
  const handleRemoveImage = (index: number) => setImages(images.filter((_, i) => i !== index));
  const handleUrlChange = (index: number, val: string) => {
    const updated = [...images];
    updated[index].url = val;
    setImages(updated);
  };
  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, i) => ({ ...img, isPrimary: i === index }));
    setImages(updated);
  };

  const handleAmenityToggle = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(aId => aId !== id) : [...prev, id]
    );
  };

  const [form, setForm] = useState({
    propertyName: '',
    propertyDescription: '',
    city: '',
    country: '',
    address: '',
    propertyType: 'Hotel',
    valuePerNight: 100,
    maxGuests: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.propertyName || !form.city || !form.address) {
      toast.error('Please fill required fields.');
      return;
    }
    // const auth = useAuthStore(); // Assuming you have a hook to get the authenticated user
    createMutation.mutate({
  name: form.propertyName,
  description: form.propertyDescription,

  ownerId: currentUser?.id ?? "",

  city: form.city,
  country: form.country,
  address: form.address,

  propertyType: form.propertyType,

  value_perNight: form.valuePerNight,
  maxGuests: form.maxGuests,

  imageUrls: images
    .map(img => img.url)
    .filter(Boolean),

  propertyAmenities: selectedAmenities,
});
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8 font-body text-text-primary">
      <div className="space-y-1">
        <h1 className="text-2xl font-heading font-semibold text-text-primary">Add Property</h1>
        <p className="text-xs text-text-secondary">Announce a new boutique sanctuary in the Bookavella circle.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SEC 1: BASIC INFO */}
        <Card className="bg-surface border-border">
          <CardHeader><CardTitle className="text-sm font-heading">Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Property Name</label>
              <Input required value={form.propertyName} onChange={e => setForm({...form, propertyName: e.target.value})} placeholder="Aman Tokyo" className="bg-background text-sm h-10 border-border" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Description</label>
              <textarea required value={form.propertyDescription} onChange={e => setForm({...form, propertyDescription: e.target.value})} placeholder="Detailed architecture notes..." className="w-full bg-background border border-border rounded-sm text-sm p-3 min-h-[100px] text-text-primary focus:outline-none focus:border-accent" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Type</label>
                <select value={form.propertyType} onChange={e => setForm({...form, propertyType: e.target.value})} className="w-full bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none">
                  <option value="Hotel">Hotel</option>
                  <option value="Boutique">Boutique</option>
                  <option value="Resort">Resort</option>
                  <option value="Villa">Villa</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">City</label>
                <Input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="Kyoto" className="bg-background text-sm h-10 border-border" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Country</label>
                <Input required value={form.country} onChange={e => setForm({...form, country: e.target.value})} placeholder="Japan" className="bg-background text-sm h-10 border-border" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Address</label>
              <Input required value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="1-1 Otemachi" className="bg-background text-sm h-10 border-border" />
            </div>
          </CardContent>
        </Card>

        {/* SEC 2: PRICING */}
        <Card className="bg-surface border-border">
          <CardHeader><CardTitle className="text-sm font-heading">Pricing & Capacity</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Value per Night (R$)</label>
              <Input type="number" required value={form.valuePerNight} onChange={e => setForm({...form, valuePerNight: Number(e.target.value)})} className="bg-background text-sm h-10 border-border" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Max Guests</label>
              <Input type="number" required value={form.maxGuests} onChange={e => setForm({...form, maxGuests: Number(e.target.value)})} className="bg-background text-sm h-10 border-border" />
            </div>
          </CardContent>
        </Card>

        {/* SEC 3: AMENITIES */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-sm font-heading">Amenities Selection</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Choose which conveniences apply globally to this hotel.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAmenities ? (
              <Loader2 className="h-5 w-5 animate-spin text-accent" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map(amenity => {
                  const isChecked = selectedAmenities.includes(amenity.amenityId);
                  return (
                    <button
                      key={amenity.amenityId}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity.amenityId)}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-sm border text-xs font-semibold tracking-wide text-left cursor-pointer transition-colors',
                        isChecked ? 'border-accent bg-accent/5 text-accent' : 'border-border text-text-secondary hover:text-text-primary'
                      )}
                    >
                      <div className={cn("h-3.5 w-3.5 rounded-sm border flex items-center justify-center", isChecked ? "border-accent bg-accent text-background" : "border-border")} />
                      <span>{amenity.amenityName}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* SEC 4: IMAGES */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-sm font-heading">Image Portfolio</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Add URLs representing of your hotel views.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.map((img, idx) => (
              <div key={idx} className="flex gap-3 items-center border border-border p-3 rounded-sm bg-background/50">
                <Input required type="url" value={img.url} onChange={e => handleUrlChange(idx, e.target.value)} placeholder="https://images.unsplash.com/..." className="flex-1 bg-background text-xs h-9 border-border" />
                <Button type="button" onClick={() => handleSetPrimary(idx)} variant={img.isPrimary ? "default" : "outline"} className="h-9 text-[10px] uppercase font-bold shrink-0">
                  {img.isPrimary ? 'Primary' : 'Set Primary'}
                </Button>
                {images.length > 1 && (
                  <Button type="button" onClick={() => handleRemoveImage(idx)} variant="destructive" className="h-9 w-9 p-0 shrink-0"><Trash2 className="h-4 w-4" /></Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={handleAddImage} variant="outline" className="text-xs h-9 flex items-center gap-1"><Plus className="h-4 w-4" /> Add Image Field</Button>
          </CardContent>
        </Card>

        {/* Action */}
        <div className="flex justify-end gap-3 border-t border-border pt-6">
          <Button type="submit" disabled={createMutation.isPending} className="h-10 text-xs px-6 flex items-center gap-1.5 cursor-pointer">
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Launch Property Portfolio'}
          </Button>
        </div>
      </form>
    </div>
  );
}