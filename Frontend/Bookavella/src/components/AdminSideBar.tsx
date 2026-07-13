import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants';
import { toast } from 'sonner';
import { 
  LayoutDashboard, Users, Building2, CheckSquare, MessageSquare, 
  BarChart3, Settings, LogOut, ShieldAlert 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  onItemClick?: () => void; // Callback para fechar o Sheet responsivo no mobile
}

export default function AdminSidebar({ onItemClick }: AdminSidebarProps) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('bookavella_token');
    localStorage.removeItem('bookavella_user');
    navigate(ROUTES.HOME);
    toast.success('Logged out from Admin Panel');
    if (onItemClick) onItemClick();
  };

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname !== '/admin') return false;
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Manage Properties', path: '/admin/properties', icon: Building2 },
    { label: 'Manage Amenities', path: '/admin/amenities', icon: CheckSquare },
    { label: 'Review Moderation', path: '/admin/reviews', icon: MessageSquare },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col justify-between bg-surface font-body border-r border-border">
      {/* Topo / Brand Area de Alta Segurança */}
      <div className="flex flex-col">
        <div className="p-6 border-b border-border space-y-2">
          <Link to="/admin" className="font-heading text-xl font-bold tracking-wider text-text-primary block">
            BV / <span className="text-error">SYSTEM</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error/10 border border-error/20 text-[9px] font-bold uppercase tracking-wider text-error">
            <ShieldAlert className="h-3 w-3 shrink-0" />
            Admin Panel
          </div>
        </div>

        {/* Links de Navegação Administrativa (Acento border-error) */}
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
                  'flex items-center gap-3 px-5 py-3 text-xs font-semibold tracking-wide uppercase transition-all border-l-2 hover:bg-background/40',
                  active
                    ? 'border-error text-error bg-error/5'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Rodapé / Conta Ativa */}
      <div className="p-5 border-t border-border bg-background/25 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={currentUser?.avatarUrl || ''} alt={currentUser?.name || 'Admin'} />
            <AvatarFallback className="bg-surface text-text-secondary text-xs uppercase font-body">
              {currentUser?.name?.substring(0, 2) || 'AD'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-text-primary truncate">{currentUser?.name}</span>
            <span className="text-[10px] text-text-tertiary truncate">Global Admin</span>
          </div>
        </div>

        <div className="flex flex-col">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-error hover:bg-error/5 rounded-sm transition-all text-left cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out Panel</span>
          </button>
        </div>
      </div>
    </div>
  );
}