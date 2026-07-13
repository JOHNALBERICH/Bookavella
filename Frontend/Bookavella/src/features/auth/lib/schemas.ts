import { z } from 'zod';

// ═══ LOGIN SCHEMA ═══
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;


// ═══ REGISTER SCHEMA ═══
export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Name must be between 3 and 50 characters' })
      .max(50, { message: 'Name must be between 3 and 50 characters' }),
    email: z
      .string()
      .min(1, { message: 'Email address is required' })
      .email({ message: 'Please enter a valid email address' }),
    phoneNumber: z
      .string()
      .min(9, { message: 'Please enter a valid phone number' })
      .max(15, { message: 'Please enter a valid phone number' }),
    gender: z
    .string()
    .min(1, 'Please select your gender'),
    nationality:z
    .string()
    .min(1, 'Please select your nationality'),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(100, { message: 'Password cannot exceed 100 characters' }),
    confirmpassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: 'Passwords do not match',
    path: ['confirmpassword'], // Vincula o erro de inconsistência diretamente ao campo de confirmação
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;


// ═══ RESET PASSWORD SCHEMA ═══
// Nota Arquitetural: Estendemos o tipo base adicionando confirmPassword apenas no escopo de formulário
export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email address is required' })
      .email({ message: 'Please enter a valid email address' }),
    newPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;


// ═══ UPDATE PROFILE SCHEMA ═══
// Nota Arquitetural: userId e avatarUrl são excluídos do formulário, pois são controlados de forma implícita e isolada
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be between 3 and 50 characters' })
    .max(50, { message: 'Name must be between 3 and 50 characters' }),
  phoneNumber: z
    .string()
    .min(9, { message: 'Please enter a valid phone number' })
    .max(15, { message: 'Please enter a valid phone number' }),
  gender: z
    .string()
    .optional()
    .or(z.literal('')),
  nationality: z
    .string()
    .optional()
    .or(z.literal('')),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;


// ═══ CHANGE AVATAR SCHEMA ═══
export const changeAvatarSchema = z.object({
  avatarUrl: z
    .string()
    .min(1, { message: 'Please enter a valid image URL' })
    .url({ message: 'Please enter a valid image URL' }),
});

export type ChangeAvatarFormValues = z.infer<typeof changeAvatarSchema>;    