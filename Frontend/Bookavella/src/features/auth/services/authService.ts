import { axiosInstance } from '@/lib/axios';
import { ApiResponse, User } from '@/types';
import {
  RegisterUserRequest,
  RegisterOwnerRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  ChangeAvatarRequest,
  ChangeAvatarResponse,
  
} from '../types';
import { AuthResponse } from '@/types';
export const authService = {
  /**
   * Autentica o usuário na plataforma (Hóspede, Proprietário ou Admin)
   * @param email endereço de e-mail cadastrado
   * @param password senha do usuário
   * @returns Retorna o token JWT e as informações do perfil do usuário
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await axiosInstance.post<AuthResponse>('/Auth/Login', {
      email,
      password,
    });
    return data;
  },

  /**
   * Efetua o cadastro de um novo Hóspede (Guest)
   */
  async registerUser(payload: RegisterUserRequest): Promise<ApiResponse<User>> {
    const { data } = await axiosInstance.post<ApiResponse<User>>('/Auth/Register', payload);
    return data;
  },

  /**
   * Efetua o cadastro de um novo Proprietário de Imóvel (PropertyOwner)
   */
  async registerOwner(payload: RegisterOwnerRequest): Promise<ApiResponse<User>> {
    const { data } = await axiosInstance.post<ApiResponse<User>>('/Auth/PropertyOwner/Register', payload);
    return data;
  },

  async registerAdmin(payload: RegisterUserRequest): Promise<ApiResponse<User>> {
    const { data } = await axiosInstance.post<ApiResponse<User>>('/Auth/Admin/Register', payload);
    return data;
  },
  /**
   * Solicita a redefinição de senha do usuário
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<void> {
    await axiosInstance.post('/Auth/ResetPassword', payload);
  },

  /**
   * Atualiza as informações cadastrais do perfil do usuário logado
   * Rota autenticada: O token JWT é injetado pelo interceptor do Axios
   */
  async updateProfile(payload: UpdateProfileRequest): Promise<ApiResponse<User>> {
    const { data } = await axiosInstance.put<ApiResponse<User>>('/Auth/Update-Infor', payload);
    return data;
  },

  /**
   * Atualiza a URL do avatar do usuário logado
   * Rota autenticada: O token JWT é injetado pelo interceptor do Axios
   */
  async changeAvatar(payload: ChangeAvatarRequest): Promise<ApiResponse<ChangeAvatarResponse>> {
    const { data } = await axiosInstance.patch<ApiResponse<ChangeAvatarResponse>>('/Auth/Change-Avatar', payload);
    return data;
  },
};