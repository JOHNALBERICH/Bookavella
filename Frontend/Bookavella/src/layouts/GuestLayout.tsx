import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import GuestNavbar from '@/components/GuestNavbar';
import { ROUTES } from '@/constants';

export default function GuestLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary font-body">
      
      {/* Navbar thật — dùng GuestNavbar component */}
      <GuestNavbar />

      {/* Nội dung trang con được inject vào đây */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-tertiary">
          <span>&copy; 2026 Bookavella. Editorial Luxury Hospitality.</span>
          <div className="flex items-center gap-6">
            <Link
              to={ROUTES.SEARCH}
              className="hover:text-text-secondary transition-colors"
            >
              Explore
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="hover:text-text-secondary transition-colors"
            >
              Login
            </Link>
            <span className="text-accent">Premium Design Language</span>
          </div>
        </div>
      </footer>

    </div>
  );
}