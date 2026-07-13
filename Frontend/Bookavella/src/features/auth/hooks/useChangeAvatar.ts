import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { authService } from '../services/authService';
import { ChangeAvatarRequest } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { ApiResponse, User } from '@/types';

export function useChangeAvatar() {
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (data: ChangeAvatarRequest) => authService.changeAvatar(data),
    onSuccess: (response, variables) => {
      if (!response.success) {
        toast.error(response.message || 'Falha ao atualizar o avatar.');
        return;
      }

      const newUrl = variables.avatarUrl;

      // 1. Sincroniza o AuthContext global utilizando o parâmetro de variáveis da mutation
      updateUser({ avatarUrl: newUrl });

      // 2. Atualiza o usuário persistido no localStorage local
      const cachedUserStr = localStorage.getItem('bookavella_user');
      if (cachedUserStr) {
        try {
          const cachedUser = JSON.parse(cachedUserStr) as User;
          const updatedUser = { ...cachedUser, avatarUrl: newUrl };
          localStorage.setItem('bookavella_user', JSON.stringify(updatedUser));
        } catch {
          // Trata falhas de parsing de localStorage corrompido
          localStorage.removeItem('bookavella_user');
        }
      }

      // 3. Alerta com a mensagem de sucesso retornada pela API
      toast.success(response.message || 'Avatar atualizado com sucesso');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const apiMessage = error.response?.data?.message;
      toast.error(apiMessage || 'Erro ao realizar a atualização do avatar.');
    },
  });
}