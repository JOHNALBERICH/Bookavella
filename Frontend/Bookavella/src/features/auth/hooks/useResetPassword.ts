import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { authService } from '../services/authService';
import { ResetPasswordRequest } from '../types';
import { ApiResponse } from '@/types';
import { ROUTES } from '@/constants';

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: () => {
      toast.success('Senha redefinida com sucesso');
      navigate(ROUTES.LOGIN);
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const apiMessage = error.response?.data?.message;
      toast.error(apiMessage || 'Erro ao processar a redefinição de senha.');
    },
  });
}