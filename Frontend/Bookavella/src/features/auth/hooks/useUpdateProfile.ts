import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { authService } from '../services/authService';
import { UpdateProfileRequest } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { ApiResponse } from '@/types';

export function useUpdateProfile() {
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authService.updateProfile(data),
    onSuccess: (response) => {
      if (!response.success || !response.data) {
        toast.error(response.message || 'Não foi possível salvar as alterações.');
        return;
      }

      const updatedUser = response.data;

      // 1. Sincroniza síncronamente o AuthContext global (Fase 1 - Task 8)
      updateUser(updatedUser);

      // 2. Atualiza a persistência local (única fonte de verdade estática do cliente)
      localStorage.setItem('bookavella_user', JSON.stringify(updatedUser));

      // 3. Notificação de sucesso
      toast.success('Perfil atualizado com sucesso');
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const apiMessage = error.response?.data?.message;
      toast.error(apiMessage || 'Erro ao salvar as informações de perfil.');
    },
  });
}