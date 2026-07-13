import { ReactNode, lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

// Importações físicas de layouts fixos de portais
import GuestLayout from '@/layouts/GuestLayout';
import OwnerLayout from '@/layouts/OwnerLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Importação síncrona do componente de carregamento estrutural (Fase 7 - Task 1)
import PageSkeleton from '@/components/PageSkeleton';

// ═══ CARREGAMENTO PREGUIÇOSO DE PÁGINAS (LAZY IMPORTS) ═══

// --- Páginas Públicas (Hóspedes) ---
const HomePage = lazy(() => import('@/pages/guest/HomePage'));
const SearchPage = lazy(() => import('@/pages/guest/SearchPage'));
const PropertyDetailPage = lazy(() => import('@/pages/guest/PropertyDetailPage'));
const RoomDetailPage = lazy(() => import('@/pages/guest/RoomDetailPage'));
const LoginPage = lazy(() => import('../pages/guest/LoginPage'));
const RegisterPage = lazy(() => import('../pages/guest/RegisterPage'));
const RegisterOwnerPage = lazy(() => import('../pages/guest/RegisterOwnerPage'));
const ResetPasswordPage = lazy(() => import('../pages/guest/ResetPasswordPage'));

// --- Páginas Protegidas (Hóspedes Autenticados) ---
const BookingPage = lazy(() => import('@/pages/guest/BookingPage'));
const PaymentPage = lazy(() => import('../pages/guest/PaymentPage'));
const BookingHistoryPage = lazy(() => import('../pages/guest/BookingHistoryPage'));
const FavoritesPage = lazy(() => import('../pages/guest/FavoritePage'));
const ProfilePage = lazy(() => import('../pages/guest/ProfileDetailPage'));
const SettingsPage = lazy(() => import('../pages/guest/SettingsPage'));

// --- Páginas do Proprietário (Owner Portal) ---
const OwnerDashboard = lazy(() => import('@/pages/owner/OwnerDashboard'));
const OwnerPropertiesPage = lazy(() => import('../pages/owner/OwnerPropertiesPage'));
const CreatePropertyPage = lazy(() => import('../pages/owner/CreatePropertyPage'));
const OwnerPropertyDetailPage = lazy(() => import('../pages/owner/OwnerPropertyDetailPage'));
const EditPropertyPage = lazy(() => import('../pages/owner/EditPropertyPage'));
const ManageRoomsPage = lazy(() => import('../pages/owner/ManageRoomPage'));
const CreateRoomPage = lazy(() => import('../pages/owner/CreateRoomPage'));
const EditRoomPage = lazy(() => import('../pages/owner/EditRoomPage'));
const ManageAmenitiesPage = lazy(() => import('../pages/owner/ManageAmenitiesPage'));
const ManageDiscountsPage = lazy(() => import('@/pages/owner/ManageDiscountPage'));
const OwnerBookingsPage = lazy(() => import('@/pages/owner/OwnerBookingPage'));
const OwnerPaymentsPage = lazy(() => import('@/pages/owner/OwnerPaymentPage'));
const OwnerReviewsPage = lazy(() => import('@/pages/owner/OwnerReviewPage'));
const StatisticsPage = lazy(() => import('@/pages/owner/StatisticsPage'));

// --- Páginas do Administrador (Admin Portal) ---
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDasboard'));
const ManageUsersPage = lazy(() => import('@/pages/admin/ManageUserPage'));
const AdminPropertiesPage = lazy(() => import('@/pages/admin/ManagePropertiesPage'));
const AdminAmenitiesPage = lazy(() => import('@/pages/admin/AdminAmenititesPage'));
const ReviewModerationPage = lazy(() => import('@/pages/admin/ReviewModerationPage'));
const ReportsPage = lazy(() => import('@/pages/admin/ReportPage'));
const SystemSettingsPage = lazy(() => import('@/pages/admin/SystemSettingPage'));

// --- Rota de Exceção ---
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// ═══ COMPONENTE DE GUARDA DE ROTAS (PROTECTED ROUTE) ═══

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children?: ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  console.log("Auth:", {
    isAuthenticated,
    currentUser,
    role: currentUser?.role,
    allowedRoles
});

  // Apresenta o esqueleto completo na montagem síncrona
  if (isLoading) {
    return <PageSkeleton />;
  }

  // Redireciona para login caso desautenticado
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const hasAllowedRole = allowedRoles.includes(currentUser.role as UserRole);
  console.log("Has role?", hasAllowedRole);
  // Redireciona para home pública caso não possua privilégios
  if (!hasAllowedRole) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

// ═══ LAYOUT CENTRALIZADO DE ENTRADA (ROOT LAYOUT) ═══

export function RootLayout() {
  return (
    // Injeta o PageSkeleton estrutural como fallback de transição (Fase 7 - Task 1)
    <Suspense fallback={<PageSkeleton />}>
      <Outlet />
    </Suspense>
  );
}

// ═══ CONFIGURAÇÃO DA ÁRVORE DE ROTEAMENTO (ROUTING TREE) ═══

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // 1. Grupo Público e Geral (GuestLayout)
      {
        path: '',
        element: <GuestLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: '/search', element: <SearchPage /> },
          { path: '/properties/:id', element: <PropertyDetailPage /> },
          { path: '/properties/:id/rooms/:roomId', element: <RoomDetailPage /> },
          { path: '/auth/login', element: <LoginPage /> },
          { path: '/auth/register', element: <RegisterPage /> },
          { path: '/auth/owner/register', element: <RegisterOwnerPage /> },
          { path: '/reset-password', element: <ResetPasswordPage /> },
        ],
      },

      // 2. Grupo Protegido - Hóspedes e Usuários Gerais
      {
        path: 'guest',
        element: <ProtectedRoute allowedRoles={[UserRole.User, UserRole.Guests]} />,
        children: [
          {
            element: <GuestLayout />,
            children: [
              { path: 'booking/checkout', element: <BookingPage /> },
              { path: 'payment', element: <PaymentPage /> },
              { path: 'booking-history', element: <BookingHistoryPage /> },
              { path: 'favorites', element: <FavoritesPage /> },
              { path: 'profile', element: <ProfilePage /> },
              { path: 'settings', element: <SettingsPage /> },
            ],
          },
        ],
      },

      // 3. Grupo Protegido - Proprietários de Imóveis (Owner Portal)
      {
        path: 'owner',
        element: <ProtectedRoute allowedRoles={[UserRole.PropertyOwner]} />,
        children: [
          {
            element: <OwnerLayout />,
            children: [
              { index: true, element: <OwnerDashboard /> },
              { path: 'properties', element: <OwnerPropertiesPage /> },
              { path: 'properties/create', element: <CreatePropertyPage /> },
              { path: 'properties/:id', element: <OwnerPropertyDetailPage /> },
              { path: 'properties/:id/edit', element: <EditPropertyPage /> },
              { path: 'properties/:id/rooms', element: <ManageRoomsPage /> },
              { path: 'properties/:id/rooms/create', element: <CreateRoomPage /> },
              { path: 'properties/:id/rooms/:roomId/edit', element: <EditRoomPage /> },
              { path: 'amenities', element: <ManageAmenitiesPage /> },
              { path: 'discounts', element: <ManageDiscountsPage /> },
              { path: 'bookings', element: <OwnerBookingsPage /> },
              { path: 'payments', element: <OwnerPaymentsPage /> },
              { path: 'reviews', element: <OwnerReviewsPage /> },
              { path: 'statistics', element: <StatisticsPage /> },
            ],
          },
        ],
      },

      // 4. Grupo Protegido - Administradores (Admin Portal)
      {
        path: 'admin',
        element: <ProtectedRoute allowedRoles={[UserRole.Admin]} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: 'users', element: <ManageUsersPage /> },
              { path: 'properties', element: <AdminPropertiesPage /> },
              { path: 'amenities', element: <AdminAmenitiesPage /> },
              { path: 'reviews', element: <ReviewModerationPage /> },
              { path: 'reports', element: <ReportsPage /> },
              { path: 'settings', element: <SystemSettingsPage /> },
            ],
          },
        ],
      },

      // 5. Rota Fallback para 404 (Não Encontrado)
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);