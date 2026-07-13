import { axiosInstance } from '@/lib/axios';
import { 
  ApiResponse, 
  PaginationResponse, 
  AdminGetUserResponse, 
  AdminUserQueryRequest 
} from '@/types';

export const adminService = {
  /**
   * Obtém a lista paginada e filtrada de usuários cadastrados no ecossistema
   * Rota Autenticada (Admin)
   * 
   * NOTA DE INTEGRAÇÃO (Fase 7 — Sincronização):
   * Os parâmetros de paginação e busca migraram do corpo (body) para a Query String (URL parameters)
   * do endpoint GET `/Admin/users?pageIndex=1&pageSize=10&search=...&role=...`
   * 
   * @param params Contrato do DTO de busca AdminUserQueryRequest
   */
  async getUsers(params: AdminUserQueryRequest): Promise<ApiResponse<PaginationResponse<AdminGetUserResponse>>> {
    const { search, role, pagination } = params;

    // Converte e achata o DTO estruturado para os parâmetros planos de Query String da URL
    const queryParams = {
      pageIndex: pagination?.pageIndex || 1,
      pageSize: pagination?.pageSize || 10,
      search: search || undefined,
      role: role === 'all' ? undefined : role,
    };

    const { data } = await axiosInstance.get<ApiResponse<PaginationResponse<AdminGetUserResponse>>>('/Admin/users', {
      params: queryParams,
    });

    return data;
  },

  /**
   * Alterna o estado de ativação de uma conta (Bloquear ou Ativar Usuário)
   * Rota Autenticada (Admin)
   * @param id ID único da conta do usuário (Guid)
   * @param isBanned Novo estado de banimento pretendido
   */
  async banUser(id: string, isBanned: boolean): Promise<ApiResponse<{ message: string }>> {
    const { data } = await axiosInstance.put<ApiResponse<{ message: string }>>(`/Admin/Users/${id}/ban`, {
      isBanned,
    });
    return data;
  },
};