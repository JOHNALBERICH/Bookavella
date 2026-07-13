import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '@/features/room/services/roomService';
import { RoomType, BedType, RoomStatus } from '@/types';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../@/components/ui/card';
import { Input } from '../../../@/components/ui/input';
import { Button } from '../../../@/components/ui/button';

export default function CreateRoomPage() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id || '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [imageUrls, setImageUrls] = useState<string[]>(['']);

  const createMutation = useMutation({
    mutationFn: (data: any) => roomService.createRoom(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Room announced successfully');
      navigate(`/owner/properties/${propertyId}/rooms`);
    },
    onError: () => {
      toast.error('Failed to announce room.');
    },
  });

  const [form, setForm] = useState({
    roomName: '',
    roomDescription: '',
    roomType: RoomType.Standard,
    bedType: BedType.Double,
    bedCount: 1,
    maxGuests: 2,
    valuePerNight: 150,
    roomStatus: RoomStatus.Available,
  });

  const handleAddImageUrl = () => setImageUrls([...imageUrls, '']);
  const handleRemoveImageUrl = (index: number) => setImageUrls(imageUrls.filter((_, i) => i !== index));
  const handleImageUrlChange = (index: number, val: string) => {
    const updated = [...imageUrls];
    updated[index] = val;
    setImageUrls(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      imageUrls: imageUrls.filter(Boolean),
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8 font-body text-text-primary">
      <div className="space-y-1">
        <h1 className="text-2xl font-heading font-semibold">Add Room</h1>
        <p className="text-xs text-text-secondary">Register a new premium bedroom design on your property.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-surface border-border">
          <CardHeader><CardTitle className="text-sm font-heading">Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Room Name</label>
              <Input required value={form.roomName} onChange={e => setForm({...form, roomName: e.target.value})} placeholder="Villas Suite #1" className="bg-background text-sm h-10 border-border" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Description</label>
              <textarea required value={form.roomDescription} onChange={e => setForm({...form, roomDescription: e.target.value})} placeholder="Room details..." className="w-full bg-background border border-border rounded-sm text-sm p-3 min-h-[100px] text-text-primary focus:outline-none focus:border-accent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Category</label>
                <select value={form.roomType} onChange={e => setForm({...form, roomType: e.target.value as RoomType})} className="w-full bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none">
                  {Object.values(RoomType).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Bed Type</label>
                <select value={form.bedType} onChange={e => setForm({...form, bedType: e.target.value as BedType})} className="w-full bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none">
                  {Object.values(BedType).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Bed Count</label>
                <Input type="number" required value={form.bedCount} onChange={e => setForm({...form, bedCount: Number(e.target.value)})} className="bg-background text-sm h-10 border-border" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Max Guests</label>
                <Input type="number" required value={form.maxGuests} onChange={e => setForm({...form, maxGuests: Number(e.target.value)})} className="bg-background text-sm h-10 border-border" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Value per Night (R$)</label>
                <Input type="number" required value={form.valuePerNight} onChange={e => setForm({...form, valuePerNight: Number(e.target.value)})} className="bg-background text-sm h-10 border-border" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEC Image URLs */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-sm font-heading">Room Images</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Provide image links of this bedroom.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex gap-2">
                <Input required type="url" value={url} onChange={e => handleImageUrlChange(idx, e.target.value)} placeholder="https://..." className="bg-background text-xs h-9 border-border" />
                {imageUrls.length > 1 && (
                  <Button type="button" onClick={() => handleRemoveImageUrl(idx)} variant="destructive" className="h-9 w-9 p-0 shrink-0"><Trash2 className="h-4 w-4" /></Button>
                )}
              </div>
            ))}
            <Button type="button" onClick={handleAddImageUrl} variant="outline" className="text-xs h-9 flex items-center gap-1"><Plus className="h-4 w-4" /> Add Image URL</Button>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button type="submit" disabled={createMutation.isPending} className="h-10 text-xs px-6 cursor-pointer">
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Launch Room'}
          </Button>
        </div>
      </form>
    </div>
  );
}