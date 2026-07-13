import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants';
import { toast } from 'sonner';
import {
  Menu, Heart, LogOut, User as UserIcon,
  Settings, Shield, LayoutDashboard, Compass
} from 'lucide-react';
import { Button } from '../../@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '../../@/components/ui/dropdown-menu';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from '../../@/components/ui/sheet';

export default function GuestNavbar() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('bookavella_token');
    localStorage.removeItem('bookavella_user');
    navigate(ROUTES.HOME);
    toast.success('Logged out successfully');
  };

  const roles = currentUser?.role ;
  const isAdmin = roles === 'Admin';
  const isOwner = roles === 'PropertyOwner';
  const isRegularUser = roles === 'Users' || roles === 'Guests';

  return (
    <header className="sticky top-0 z-50 w-full h-16 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to={ROUTES.HOME}
          className="font-heading text-2xl font-bold tracking-wider text-accent hover:opacity-90 transition-opacity"
        >
          BOOKAVELLA
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <Link
            to={ROUTES.SEARCH}
            className="hover:text-zinc-100 transition-colors flex items-center gap-1.5"
          >
            <Compass className="h-4 w-4 text-accent" />
            Explore
          </Link>

          {!isAuthenticated ? (
            <Link
              to={ROUTES.LOGIN}
              className="hover:text-zinc-100 transition-colors font-medium"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              {isRegularUser && (
                <Link
                  to="/guest/favorites"
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  <Heart className="h-5 w-5" />
                </Link>
              )}

              {isOwner && (
                <Link
                  to={ROUTES.OWNER.DASHBOARD}
                  className="text-xs font-medium text-accent hover:text-accent-hover transition-colors flex items-center gap-1.5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Owner Portal
                </Link>
              )}

              {isAdmin && (
                <Link
                  to={ROUTES.ADMIN.DASHBOARD}
                  className="text-xs font-medium text-text-primary hover:text-accent transition-colors flex items-center gap-1.5"
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 focus-visible:ring-0">
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage src={currentUser?.avatarUrl || ''} alt={currentUser?.name || 'User'} />
                      <AvatarFallback className="bg-surface text-text-secondary text-xs uppercase">
                        {currentUser?.name?.substring(0, 2) || 'US'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-surface border border-border text-text-primary"
                  align="end"
                >
                  <DropdownMenuLabel className="font-heading font-medium text-xs text-text-secondary px-3 py-2">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />

                  {isRegularUser && (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/guest/booking-history" className="w-full flex items-center gap-2">
                          <Settings className="h-4 w-4 text-text-secondary" />
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/guest/favorites" className="w-full flex items-center gap-2">
                          <Heart className="h-4 w-4 text-text-secondary" />
                          Favorites
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/guest/profile" className="w-full flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-text-secondary" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/guest/settings" className="w-full flex items-center gap-2">
                          <Settings className="h-4 w-4 text-text-secondary" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {isOwner && (
                    <>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to={ROUTES.OWNER.DASHBOARD} className="w-full flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4 text-text-secondary" />
                          Owner Portal
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/guest/profile" className="w-full flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-text-secondary" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {isAdmin && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to={ROUTES.ADMIN.DASHBOARD} className="w-full flex items-center gap-2">
                        <Shield className="h-4 w-4 text-text-secondary" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-error hover:bg-error/10 focus:text-error focus:bg-error/10 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </nav>

        {/* MOBILE NAV */}
        <div className="flex md:hidden items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-0 h-9 w-9">
                <Menu className="h-6 w-6 text-text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-surface border-l border-border text-text-primary">
              <SheetHeader className="text-left border-b border-border pb-4">
                <SheetTitle className="font-heading text-xl font-bold text-accent">
                  BOOKAVELLA
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col justify-between h-[calc(100vh-80px)] py-6">
                <nav className="flex flex-col space-y-3">
                  <Link
                    to={ROUTES.SEARCH}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium hover:text-accent py-2 transition-colors flex items-center gap-2"
                  >
                    <Compass className="h-4 w-4" />
                    Explore
                  </Link>

                  {isAuthenticated ? (
                    <>
                      {isRegularUser && (
                        <Link
                          to="/guest/favorites"
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-medium hover:text-accent py-2 transition-colors flex items-center gap-2"
                        >
                          <Heart className="h-4 w-4" />
                          Favorites
                        </Link>
                      )}
                      <Link
                        to="/guest/profile"
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium hover:text-accent py-2 transition-colors flex items-center gap-2"
                      >
                        <UserIcon className="h-4 w-4" />
                        Profile
                      </Link>
                      {isOwner && (
                        <Link
                          to={ROUTES.OWNER.DASHBOARD}
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-medium hover:text-accent py-2 transition-colors flex items-center gap-2"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Owner Portal
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          to={ROUTES.ADMIN.DASHBOARD}
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-medium hover:text-accent py-2 transition-colors flex items-center gap-2"
                        >
                          <Shield className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 pt-4">
                      <Button variant="outline" asChild className="w-full">
                        <Link to={ROUTES.LOGIN} onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="w-full">
                        <Link to="/register" onClick={() => setIsOpen(false)}>
                          Register
                        </Link>
                      </Button>
                    </div>
                  )}
                </nav>

                {isAuthenticated && (
                  <Button
                    variant="destructive"
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 h-10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}