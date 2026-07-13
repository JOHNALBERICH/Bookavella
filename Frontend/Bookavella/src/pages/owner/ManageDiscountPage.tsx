import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { discountService } from '@/features/discount/services/discountService';
import { propertyService } from '@/features/property/services/propertyService';
import { roomService } from '@/features/room/services/roomService';
import { CreateDiscountRequest, UpdateDiscountRequest } from '@/features/discount/types';
import { Discount, Room } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Input } from '../../../@/components/ui/input';
import { Button } from '../../../@/components/ui/button';
import { Loader2, Plus, Trash2, Edit, Tag, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ManageDiscountsPage() {
  const { currentUser } = useAuth();
  const ownerId = currentUser?.id || '';
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  // 1. Carrega as propriedades do dono
  const { data: propertiesResponse } = useQuery({
    queryKey: ['properties', 'owner', ownerId],
    queryFn: () => propertyService.getOwnerProperties(ownerId),
    enabled: !!ownerId,
  });

  const ownedProperties = propertiesResponse || [];
  const ownedPropertyIds = ownedProperties.map((p) => p.id);

  // 2. Carrega todos os quartos para resolver o nome das acomodações de forma relacional local
  const roomQueries = useQueries({
  queries: ownedPropertyIds.map(id => ({
    queryKey: ['rooms', id],
    queryFn: () => roomService.getRoomsByPropertyId(id)
  }))
});

  const allRooms = roomQueries.flatMap((q) => q.data || []);
  const ownerRooms = allRooms.filter((room) => ownedPropertyIds.includes(room.propertyId));
  const ownerRoomIds = ownerRooms.map((room) => room.roomId);

  // 3. Carrega todos os descontos cadastrados globalmente
  const { data: discountsResponse, isLoading: loadingDiscounts } = useQuery({
    queryKey: ['discounts', 'all'],
    queryFn: () => discountService.getAllDiscounts(),
  });

  const rawDiscounts = discountsResponse?.data || [];

  // Filtra de forma relacional no cliente os descontos que pertencem aos quartos deste proprietário
  const ownerDiscounts = rawDiscounts.filter((discount) => ownerRoomIds.includes(discount.roomId));

  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: (data: CreateDiscountRequest) => discountService.createDiscount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts','all'] });
      toast.success('Discount coupon launched');
      setIsModalOpen(false);
      resetForm();
    },
    onError: () => toast.error('Failed to create coupon.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ code, payload }: { code: string; payload: UpdateDiscountRequest }) =>
      discountService.updateDiscount(code, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      toast.success('Discount coupon modified');
      setIsModalOpen(false);
      resetForm();
    },
    onError: () => toast.error('Failed to modify coupon.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (code: string) => discountService.deleteDiscount(code),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] });
      toast.success(response.message || 'Coupon deleted successfully');
    },
    onError: () => toast.error('Failed to delete coupon.'),
  });

  // --- FORM STATE ---
  const [form, setForm] = useState({
    roomId: '',
    discountCode: '',
    discountPercentage: 10,
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const resetForm = () => {
    setForm({
      roomId: '',
      discountCode: '',
      discountPercentage: 10,
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setEditingDiscount(null);
  };

  const handleEditOpen = (discount: Discount) => {
    setEditingDiscount(discount);
    setForm({
      roomId: discount.roomId,
      discountCode: discount.discountCode,
      discountPercentage: discount.discountPercentage,
      startDate: discount.startDate.split('T')[0], // Sanitiza formato para input date de HTML
      endDate: discount.endDate.split('T')[0],
      isActive: discount.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (code: string) => {
    if (window.confirm('Are you sure you want to delete this promotional coupon?')) {
      deleteMutation.mutate(code);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.roomId || !form.discountCode) {
      toast.error('Please fill required fields.');
      return;
    }

    if (editingDiscount) {
      // Executa mutação de alteração parcial
      updateMutation.mutate({
        code: editingDiscount.discountCode,
        payload: {
          roomId: form.roomId,
          discountCode: form.discountCode,
          discountPercentage: form.discountPercentage,
          startDate: form.startDate,
          endDate: form.endDate,
          isActive: form.isActive,
        },
      });
    } else {
      // Executa mutação de criação
      createMutation.mutate(form as CreateDiscountRequest);
    }
  };

  return (
    <div className="space-y-8 text-text-primary font-body pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-heading font-semibold">Promotions & Discounts</h1>
          <p className="text-xs text-text-secondary">Configure discount codes to incentivize your bedroom booking conversions.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-10 text-xs px-4 flex items-center gap-1.5 cursor-pointer">
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      {loadingDiscounts ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      ) : ownerDiscounts.length === 0 ? (
        <div className="h-72 border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-8 bg-surface/30 gap-4 text-center">
          <Tag className="h-8 w-8 text-text-tertiary" />
          <h3 className="text-sm font-semibold">No promotional coupons launched</h3>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-md overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-background/50 text-text-secondary uppercase tracking-wider text-[10px]">
                <th className="p-4 font-semibold">Code</th>
                <th className="p-4 font-semibold">Accommodation</th>
                <th className="p-4 font-semibold">Amortization</th>
                <th className="p-4 font-semibold">Valid Period</th>
                <th className="p-4 font-semibold">Active</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ownerDiscounts.map((d) => {
                const matchedRoom = ownerRooms.find((r) => r.roomId === d.roomId);

                return (
                  <tr key={d.discountId} className="hover:bg-background/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-accent uppercase">{d.discountCode}</td>
                    <td className="p-4 text-text-primary">{matchedRoom?.roomName || 'Sanctuary details loading...'}</td>
                    <td className="p-4 font-bold text-success">-{d.discountPercentage}%</td>
                    <td className="p-4 text-text-secondary">
                      {new Date(d.startDate).toLocaleDateString('pt-BR')} to {new Date(d.endDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      {d.isActive ? (
                        <span className="text-xs text-success font-semibold flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Active</span>
                      ) : (
                        <span className="text-xs text-text-tertiary font-medium flex items-center gap-1"><X className="h-3.5 w-3.5" /> Paused</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="ghost" className="h-8 px-2 text-[11px] flex items-center gap-1" onClick={() => handleEditOpen(d)}>
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button variant="ghost" className="h-8 px-2 text-[11px] text-error hover:bg-error/10 hover:text-error" onClick={() => handleDelete(d.discountCode)}>
                          <Trash2 className="h-3.5 w-3.5" /> Delete
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

      {/* CREATE & EDIT FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-[420px] bg-surface border-border text-text-primary shadow-lg animate-in fade-in zoom-in duration-normal">
            <CardHeader className="relative pb-4 flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-heading">{editingDiscount ? 'Edit Discount Coupon' : 'Launch New Coupon'}</CardTitle>
                <CardDescription className="text-xs text-text-secondary">Configure promotional percentage cuts.</CardDescription>
              </div>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-text-secondary hover:text-text-primary cursor-pointer focus:outline-none">
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Select de Quartos do Proprietário */}
                {!editingDiscount && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Select Accommodation</label>
                    <select
                      value={form.roomId}
                      onChange={e => setForm({...form, roomId: e.target.value})}
                      className="w-full bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none focus:border-accent"
                    >
                      <option value="">Choose Room...</option>
                      {ownerRooms.map((room) => (
                        <option key={room.roomId} value={room.roomId}>{room.roomName}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Código do Cupom */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Coupon Code</label>
                  <Input required value={form.discountCode} onChange={e => setForm({...form, discountCode: e.target.value})} placeholder="e.g. LUXURY20" className="bg-background text-sm h-10 border-border uppercase font-mono" />
                </div>

                {/* Porcentagem */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Percentage (1-100%)</label>
                  <Input type="number" min={1} max={100} required value={form.discountPercentage} onChange={e => setForm({...form, discountPercentage: Number(e.target.value)})} className="bg-background text-sm h-10 border-border" />
                </div>

                {/* Datas de Vigência */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Start Date</label>
                    <input type="date" required value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none focus:border-accent" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">End Date</label>
                    <input type="date" required value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full bg-background border border-border text-xs h-10 px-3 rounded-sm text-text-primary focus:outline-none focus:border-accent" />
                  </div>
                </div>

                {/* Toggle de Ativo */}
                <div className="flex items-center justify-between p-3 rounded-sm bg-background border border-border text-xs">
                  <span className="font-semibold">Coupon Active State</span>
                  <button
                    type="button"
                    onClick={() => setForm({...form, isActive: !form.isActive})}
                    className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    style={{ backgroundColor: form.isActive ? 'var(--color-accent)' : 'var(--color-border)' }}
                  >
                    <span className={cn("pointer-events-none block h-4 w-4 rounded-full bg-[#FFFFFF] shadow-lg ring-0 transition-transform", form.isActive ? "translate-x-4" : "translate-x-0")} />
                  </button>
                </div>

                {/* Ações */}
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); resetForm(); }} className="h-10 text-xs cursor-pointer">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="h-10 text-xs px-6 cursor-pointer">
                    {createMutation.isPending || updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Settings'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}