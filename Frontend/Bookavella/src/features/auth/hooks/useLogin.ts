import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { authService } from '../services/authService';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants';
import { ApiResponse, User, AuthResponse } from '@/types';

function decodeToken(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map((c) =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

export function useLogin() {
  const { login: setAuthContext } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),

    onSuccess: (response) => {
      // Backend trả về AuthResponse trực tiếp — không wrapped trong ApiResponse
      // Handle cả 2 cases: direct response hoặc wrapped
      const rawData = (response as unknown as { data: AuthResponse }).data ?? (response as unknown as AuthResponse);
      console.log("LOGIN RESPONSE", rawData);
      const token = rawData.token;
      const email = rawData.email;
      const role = rawData.role;
      const name = rawData.name;
      const phoneNumber = rawData.phoneNumber;

      if (!token) {
        toast.error('Authentication failed. Please try again.');
        return;
      }

      const decoded = decodeToken(token);
      const nameIdentifierClaim =
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
      const userId =
        (decoded[nameIdentifierClaim] as string) ||
        (decoded.sub as string) ||
        '';

      const user: User = {
  id: userId,
  name: name || '',
  phoneNumber: phoneNumber || '',
  email: email || '',
  emailVerified: false,
  createdDate: '',
  updatedDate: '',
  isActivated: true,
  role: role || 'Users' || 'Guests' || 'Admin' || 'PropertyOwner', // Default role if not provided
  permissions: false,
  avatarUrl: '',
  gender: '',
  nationality: '',
};


      setAuthContext(token, user);

      toast.success('Login successful. Welcome back!');

      // Redirect theo role — chỉ navigate 1 lần
      const targetRoute: string =
        role === 'Admin'
          ? ROUTES.ADMIN.DASHBOARD
          : role === 'PropertyOwner'
          ? ROUTES.OWNER.DASHBOARD
          : ROUTES.HOME;

      setTimeout(() => {
        navigate(targetRoute);
      }, 1000);
    },

    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const apiMessage = error.response?.data?.message;
      toast.error(apiMessage || 'Login failed. Please check your credentials.');
    },
  });
}