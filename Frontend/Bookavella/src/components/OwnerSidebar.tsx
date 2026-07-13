import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants';
import { toast } from 'sonner';
import { 
  LayoutDashboard, Building2, CheckSquare, Tag, Calendar, 
  CreditCard, MessageSquare, BarChart3, LogOut, User as UserIcon 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface OwnerSidebarProps {
  collapsed?: boolean; // Prop adicionada para suportar o modo compacto em tablets (640px a 1024px)
  onItemClick?: () => void;
}

export default function OwnerSidebar({ collapsed = false, onItemClick }: OwnerSidebarProps) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('bookavella_token');
    localStorage.removeItem('bookavella_user');
    navigate(ROUTES.HOME);
    toast.success('Logged out successfully');
    if (onItemClick) onItemClick();
  };

  const isActive = (path: string) => {
    if (path === '/owner' && location.pathname !== '/owner') return false;
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Dashboard', path: '/owner', icon: LayoutDashboard },
    { label: 'My Properties', path: '/owner/properties', icon: Building2 },
    { label: 'Amenities', path: '/owner/amenities', icon: CheckSquare },
    { label: 'Discounts', path: '/owner/discounts', icon: Tag },
    { label: 'Bookings', path: '/owner/bookings', icon: Calendar },
    { label: 'Payments', path: '/owner/payments', icon: CreditCard },
    { label: 'Reviews', path: '/owner/reviews', icon: MessageSquare },
    { label: 'Statistics', path: '/owner/statistics', icon: BarChart3 },
  ];

  return (
    <div className={cn(
      "h-full flex flex-col justify-between bg-surface font-body border-r border-border transition-all duration-normal",
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Topo / Brand Area */}
      <div className="flex flex-col">
        <div className={cn("border-b border-border flex flex-col justify-center", collapsed ? "p-4 items-center h-16" : "p-6")}>
          <Link to="/owner" className="font-heading text-xl font-bold tracking-wider text-accent block">
            {collapsed ? "BV" : "BV / OWNER"}
          </Link>
          {!collapsed && <p className="text-[10px] text-text-tertiary uppercase tracking-widest mt-1">Property Manager</p>}
        </div>

        {/* Links de Navegação */}
        <nav className="flex flex-col py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onItemClick}
                className={cn(
                  'flex items-center transition-all border-l-2 hover:bg-background/40',
                  collapsed ? 'justify-center p-3 border-transparent' : 'px-5 py-3 gap-3 text-xs font-semibold tracking-wide uppercase',
                  active
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
                title={collapsed ? item.label : undefined} // Tooltip nativo se colapsado
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Roda-pé / Perfil do Usuário */}
      <div className={cn("border-t border-border bg-background/25 flex flex-col gap-4", collapsed ? "p-3 items-center" : "p-5")}>
        <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "")}>
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={currentUser?.avatarUrl || ''} alt={currentUser?.name || 'User'} />
            <AvatarFallback className="bg-surface text-text-secondary text-xs uppercase font-body">
              {currentUser?.name?.substring(0, 2) || 'US'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-text-primary truncate">{currentUser?.name}</span>
              <span className="text-[10px] text-text-tertiary truncate">{currentUser?.email}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <Link
            to="/guest/profile"
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface/50 rounded-sm transition-colors",
              collapsed ? "justify-center p-2" : "px-3 py-2"
            )}
            title={collapsed ? "Profile Settings" : undefined}
          >
            <UserIcon className="h-3.5 w-3.5" />
            {!collapsed && <span>Profile Settings</span>}
          </Link>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-2 text-xs font-medium text-error hover:bg-error/5 rounded-sm transition-all text-left cursor-pointer",
              collapsed ? "justify-center p-2" : "px-3 py-2"
            )}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="h-3.5 w-3.5" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
}