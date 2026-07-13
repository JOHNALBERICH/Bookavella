import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/AdminService';
import { AdminUserQueryRequest, UserRole } from '@/types';
import EmptyState from '@/components/EmptyState';
import Pagination from '@/components/Pagination';
import { Button } from '../../../@/components/ui/button';
import { Input } from '../../../@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, Loader2, Ban, ShieldAlert, Check, X, Users, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function ManageUsersPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | UserRole>('all');
  const [pageIndex, setPageIndex] = useState<number>(1);
  const pageSize = 10;

  // 1. Prepara o payload de filtros conforme a especificação Query Params (Fase 7)
  const queryParams: AdminUserQueryRequest = {
    search: searchTerm || undefined,
    role: activeTab === 'all' ? undefined : activeTab,
    pagination: {
      pageIndex,
      pageSize,
    },
  };

  // 2. Query de Busca Reativa (Garante cache atualizado a cada alteração de página ou termo)
  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', queryParams],
    queryFn: () => adminService.getUsers(queryParams),
  });

  const items = data?.data?.items || [];
  const totalCount = data?.data?.totalCount || 0;

  // 3. Mutação para Bloqueio/Banimento de Contas Infratoras
  const banMutation = useMutation({
    mutationFn: ({ userId, isBanned }: { userId: string; isBanned: boolean }) =>
      adminService.banUser(userId, isBanned),
    onSuccess: (response) => {
      // Invalida a query mestre para recarregar a tabela sem saltos visuais na tela
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success(response.message || 'Account status updated successfully!');
    },
    onError: () => {
      toast.error('Failed to change user access state.');
    },
  });

  const handleToggleBan = (userId: string, currentBannedState: boolean) => {
    const actionLabel = currentBannedState ? 'UNBAN/ACTIVATE' : 'BAN';
    const confirmed = window.confirm(
      `Are you sure you want to ${actionLabel} this user account? This will immediately alter their active login permissions.`
    );
    if (confirmed) {
      banMutation.mutate({ userId, isBanned: !currentBannedState });
    }
  };

  const tabs = [
    { id: 'all', label: 'All Accounts' },
    { id: UserRole.User, label: 'Guests / Users' },
    { id: UserRole.PropertyOwner, label: 'Property Owners' },
    { id: UserRole.Admin, label: 'System Admins' },
  ];

  return (
    <div className="space-y-8 text-text-primary font-body pb-12">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-6">
        <h1 className="text-2xl font-heading font-semibold">User Administration</h1>
        <p className="text-xs text-text-secondary">Audit and modulate platform permissions, bans, and active sessions.</p>
      </div>

      {/* API INTEGRATION STATUS INFO */}
      <div className="p-4 rounded-sm bg-success/10 border border-success/20 flex items-start gap-3">
        <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-success uppercase">API Integrated: GET /Admin/users</span>
          <p className="text-[11px] text-text-secondary leading-relaxed max-w-2xl">
            This module has been promoted to production. All queries, pages, and filters are integrated to the live database using Query String parameters for optimal performance.
          </p>
        </div>
      </div>

      {/* Filter and Search Actions (Acento Administrativo error) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Input de Busca */}
        <div className="relative w-full md:w-80 h-10 bg-surface border border-border rounded-sm px-3 flex items-center text-text-primary transition-all focus-within:border-error">
          <Search className="h-4 w-4 text-text-tertiary shrink-0 mr-2" />
          <Input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageIndex(1); // Reseta a página ao buscar
            }}
            className="border-0 bg-transparent h-full px-0 focus-visible:ring-0 shadow-none text-xs text-text-primary placeholder:text-text-tertiary"
          />
        </div>

        {/* Abas de Cargos */}
        <div className="flex items-center bg-surface border border-border p-1 rounded-sm gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setPageIndex(1);
                }}
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
          <span className="text-xs text-text-secondary">Loading accounts database...</span>
        </div>
      ) : items.length === 0 ? (
        /* ACOPLAMENTO DO EMPTYSTATE REUTILIZÁVEL */
        <EmptyState
          icon={Users}
          title="No accounts found"
          description="We couldn't find any platform users matching your selected search query or active cargo filters."
          action={
            <Button onClick={() => { setSearchTerm(''); setActiveTab('all'); }} variant="outline" className="h-9 text-xs cursor-pointer">
              Reset Filters
            </Button>
          }
        />
      ) : (
        /* TABELA ADMINISTRATIVA REAL PAGINADA */
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-md overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/50 text-text-secondary uppercase tracking-wider text-[10px]">
                  <th className="p-4 font-semibold">Username</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Verified Phone</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((user) => (
                  <tr key={user.email} className="hover:bg-background/20 transition-colors">
                    <td className="p-4 font-medium text-text-primary">{user.userName}</td>
                    <td className="p-4 text-text-secondary">{user.email}</td>
                    <td className="p-4 text-text-secondary font-mono">{user.phoneNumber || 'N/A'}</td>
                    <td className="p-4 flex gap-1.5 h-14 items-center flex-wrap">
                      {user.role.map((r) => (
                        <span key={r} className="inline-flex items-center px-1.5 py-0.5 bg-background border border-border rounded-sm text-[9px] font-bold uppercase tracking-wider text-text-secondary">
                          {r}
                        </span>
                      ))}
                    </td>
                    <td className="p-4">
                      {user.isBanned ? (
                        <span className="text-xs text-error font-semibold flex items-center gap-1">
                          <X className="h-3.5 w-3.5" /> Banned
                        </span>
                      ) : (
                        <span className="text-xs text-success font-semibold flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Activated
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Ação de Moderação Real (Toggle do estado de banimento) */}
                        <Button
                          disabled={banMutation.isPending}
                          variant="ghost"
                          onClick={() => handleToggleBan(user.userName, user.isBanned)}
                          className={cn(
                            'h-8 px-3 text-[11px] font-medium border focus:outline-none transition-colors cursor-pointer',
                            user.isBanned
                              ? 'border-success/30 text-success hover:bg-success/15'
                              : 'border-error/30 text-error hover:bg-error/15'
                          )}
                        >
                          {banMutation.isPending && banMutation.variables?.userId === user.userName ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : user.isBanned ? (
                            'Unban User'
                          ) : (
                            'Ban User'
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
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