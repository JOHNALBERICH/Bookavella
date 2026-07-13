import { User } from '@/types';

export interface RegisterUserRequest {
  username: string;
  email: string;
  gender:string;
  nationality:string;
  phoneNumber: string;
  password: string;
  confirmpassword?: string;
}

export interface RegisterOwnerRequest {
  username: string;
  email: string;
  gender:string;
  nationality:string;
  phoneNumber: string;
  password: string;
  confirmpassword?: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;

}

export interface UpdateProfileRequest {
  userId: string;
  name: string;
  phoneNumber: string;
  avatarUrl: string;
  gender: string;
  nationality: string;
}

export interface ChangeAvatarRequest {
  avatarUrl: string;
}

// Interface auxiliar para o retorno de atualização de avatar
export interface ChangeAvatarResponse {
  avatarUrl: string;
}