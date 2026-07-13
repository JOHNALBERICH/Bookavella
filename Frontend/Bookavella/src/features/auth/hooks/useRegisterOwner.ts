import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { authService } from '../services/authService';
import { RegisterUserRequest } from '../types';
import { ApiResponse } from '@/types';
import { ROUTES } from '@/constants';

export function useRegisterOwner() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterUserRequest) => authService.registerOwner(data),
    onSuccess: (response) => {
      
      toast.success('Registration successful. Your account may require approval.');
      
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