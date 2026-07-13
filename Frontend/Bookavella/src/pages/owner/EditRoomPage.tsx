import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '@/features/room/services/roomService';
import { RoomType, BedType, RoomStatus, UpdateRoomsRequest} from '@/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Input } from '../../../@/components/ui/input';
import { Button } from '../../../@/components/ui/button';

export default function EditRoomPage() {
  const { id, roomId } = useParams<{ id: string; roomId: string }>();
  const rId = roomId || '';
  const propertyId = id || '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: detailsResponse, isLoading } = useQuery({
    queryKey: ['room', rId],
    queryFn: () => roomService.getRoomDetails(rId),
    enabled: !!rId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateRoomsRequest) => roomService.updateRoom(propertyId, rId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['room', rId] });
      toast.success('Room updated successfully');
      navigate(`/owner/properties/${propertyId}/rooms`);
    },
    onError: () => {
      toast.error('Failed to update room.');
    },
  });

  const [form, setForm] = useState<UpdateRoomsRequest>({
    roomId: rId,
    roomName: '',
    roomDescription: '',
    roomType: RoomType.Standard,
    bedType: BedType.Double,
    bedCount: 1,
    maxGuests: 2,
    valuePerNight: 100,
    roomStatus: RoomStatus.Available,
    imageUrls: [] as string[], // just fixed
  });

  useEffect(() => {
    if (detailsResponse) {
      const r = detailsResponse || {};
      setForm({
        roomId: r.roomId,
        roomName: r.roomName,
        roomDescription: r.roomDescription,
        roomType: r.roomType,
        bedType: r.bedType,
        bedCount: r.bedCount,
        maxGuests: r.maxGuests,
        valuePerNight: r.price,
        roomStatus: r.roomStatus,
        imageUrls: r.imageUrls,
      });
    }
  }, [detailsResponse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
        <span className="text-xs text-text-secondary">Loading details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8 font-body text-text-primary">
      <div className="space-y-1">
        <h1 className="text-2xl font-heading font-semibold">Edit Room</h1>
        <p className="text-xs text-text-secondary">Modify specifications or prices of this accommodation.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-surface border-border">
          <CardHeader><CardTitle className="text-sm font-heading">Room Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Room Name</label>
              <Input required value={form.roomName} onChange={e => setForm({...form, roomName: e.target.value})} className="bg-background text-sm h-10 border-border" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Description</label>
              <textarea required value={form.roomDescription} onChange={e => setForm({...form, roomDescription: e.target.value})} className="w-full bg-background border border-border rounded-sm text-sm p-3 min-h-[100px] text-text-primary focus:outline-none focus:border-accent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Operating Status</label>
                <select value={form.roomStatus} onChange={e => setForm({...form, roomStatus: e.target.value as RoomStatus})} className="w-full bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none">
                  <option value={RoomStatus.Available}>Available</option>
                  <option value={RoomStatus.Booked}>Booked (Occupied)</option>
                  <option value={RoomStatus.Unavailable}>Unavailable</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Per Night (R$)</label>
                <Input type="number" required value={form.valuePerNight} onChange={e => setForm({...form, valuePerNight: Number(e.target.value)})} className="bg-background text-sm h-10 border-border" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 border-t border-[#27272A] pt-4">
          <Button type="submit" disabled={updateMutation.isPending} className="h-10 text-xs px-6 cursor-pointer">
            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Accommodation'}
          </Button>
        </div>
      </form>
    </div>
  );
}