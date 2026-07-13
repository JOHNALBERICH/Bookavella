import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '@/features/room/services/roomService';
import { Button } from '../../../@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState'; // Importação do EmptyState
import { Plus, Edit, Trash2, Loader2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageRoomsPage() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id || '';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: roomsResponse, isLoading } = useQuery({
    queryKey: ['rooms', 'all'],
    queryFn: () => roomService.getRoomsByPropertyId(propertyId), //Fixed getRoom() before
  }); 

  const propertyRooms = roomsResponse??[];
  console.log(JSON.stringify(propertyRooms, null, 2));

  const deleteMutation = useMutation({
    mutationFn: (roomId: string) => roomService.deleteRoom(roomId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['rooms', 'all'] });
      toast.success(response.message || 'Room deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete room.');
    },
  });

  const handleDelete = (roomId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this room?');
    if (confirmed) {
      deleteMutation.mutate(roomId);
    }
  };

  return (
    <div className="space-y-8 text-text-primary font-body pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-heading font-semibold">Manage Accommodations</h1>
          <p className="text-xs text-text-secondary">Control room types, status and prices of this hotel.</p>
        </div>
        <Button onClick={() => navigate(`/owner/properties/${propertyId}/rooms/create`)} className="h-10 text-xs px-4 flex items-center gap-1.5 cursor-pointer">
          <Plus className="h-4 w-4" /> Add Room
        </Button>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <span className="text-xs text-text-secondary">Loading rooms...</span>
        </div>
      ) : propertyRooms.length === 0 ? (
        /* ACOPLAMENTO DO EMPTYSTATE DE GESTÃO DE QUARTOS DO HOTEL */
        <EmptyState
          icon={FolderOpen}
          title="No rooms added to this property"
          description="Register your first premium bedroom configuration and pricing to enable guests checking in."
          action={
            <Button onClick={() => navigate(`/owner/properties/${propertyId}/rooms/create`)} className="h-9 text-xs flex items-center gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" /> Add First Room
            </Button>
          }
        />
      ) : (
        <div className="bg-surface border border-border rounded-md overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50 text-text-secondary uppercase tracking-wider text-[10px]">
                <th className="p-4 font-semibold">Room Name</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Bed config</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {propertyRooms.map(room => (
                <tr key={room.roomId} className="hover:bg-background/20 transition-colors">
                  <td className="p-4 font-medium text-text-primary">{room.roomName}</td>
                  <td className="p-4 text-text-secondary">{room.roomType}</td>
                  <td className="p-4 text-text-secondary">{room.bedCount}x {room.bedType}</td>
                  <td className="p-4"><StatusBadge status={room.roomStatus} type="room" /></td>
                  <td className="p-4 font-bold">R$ {room.valuePerNight}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" className="h-8 px-2 text-[11px] flex items-center gap-1" onClick={() => navigate(`/owner/properties/${propertyId}/rooms/${room.roomId}/edit`)}>
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button variant="ghost" className="h-8 px-2 text-[11px] flex items-center gap-1 text-error hover:bg-error/10 hover:text-error" onClick={() => handleDelete(room.roomId)}>
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}