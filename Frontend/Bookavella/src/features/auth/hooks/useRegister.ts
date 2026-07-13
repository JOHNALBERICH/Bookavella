import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { authService } from '../services/authService';
import { RegisterUserRequest } from '../types';
import { ApiResponse } from '@/types';
import { ROUTES } from '@/constants';

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterUserRequest) => authService.registerUser(data),
    onSuccess: (response) => {
      if (response && response.success === false) {
        toast.error(response.message || 'Registration failed.');
        return;
      }
      
      toast.success(response?.message || 'Registration successful. Redirecting to login...');
      
      // UX IMPROVEMENT: 1 segundo de atraso antes da transição física de rota
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 1000);
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const apiMessage = error.response?.data?.message;
      toast.error(apiMessage || 'Registration failed. Please check parameters.');
    },
  });
}