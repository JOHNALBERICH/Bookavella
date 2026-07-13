import { z } from 'zod';

// ═══ BOOKING SCHEMA ═══
export const bookingSchema = z
  .object({
    checkInDate: z
      .string()
      .min(1, { message: 'Check-in date is required' })
      .refine((val) => {
        const date = new Date(val);
        const today = new Date();
        // Zera as horas para comparar apenas os dias calendários
        today.setHours(0, 0, 0, 0);
        return date >= today;
      }, { message: 'Check-in date must be today or in the future' }),
    checkOutDate: z
      .string()
      .min(1, { message: 'Check-out date is required' }),
    numGuests: z
      .number()
      .refine(val => typeof val === 'number', {
        message: 'Guests must be a number'
      })
      .min(1, { message: 'At least 1 guest is required' }),
  })
  .refine(
    (data) => {
      const checkIn = new Date(data.checkInDate);
      const checkOut = new Date(data.checkOutDate);
      return checkOut > checkIn;
    },
    {
      message: 'Check-out date must be after check-in date',
      path: ['checkOutDate'], // Vincula o erro de inconsistência ao campo de saída
    }
  );

export type BookingFormValues = z.infer<typeof bookingSchema>;


// ═══ DISCOUNT CODE SCHEMA ═══
export const discountCodeSchema = z.object({
  code: z
    .string()
    .min(3, { message: 'Discount code must be at least 3 characters' })
    .max(50, { message: 'Discount code cannot exceed 50 characters' })
    .optional()
    .or(z.literal('')), // Suporta inputs vazios de HTML de forma reativa
});

export type DiscountCodeFormValues = z.infer<typeof discountCodeSchema>;


// ═══ PAYMENT SCHEMA ═══
// Nota Arquitetural: Estruturado para validar o tipo do pagamento obrigatório.
// Adicionamos os campos de cartão padrão como opcionais/condicionais para faturamentos no cartão de crédito,
// evitando erros de compilação futuros no formulário de faturamento físico.
export const paymentSchema = z.object({
  paymentType: z
    .string()
    .min(1, { message: 'Payment method is required' }),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, { message: 'Card number must be exactly 16 digits' })
    .optional()
    .or(z.literal('')),
  cardHolderName: z
    .string()
    .min(3, { message: 'Card holder name must be at least 3 characters' })
    .optional()
    .or(z.literal('')),
  expirationDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: 'Expiration date must be in MM/YY format' })
    .optional()
    .or(z.literal('')),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, { message: 'CVV must be 3 or 4 digits' })
    .optional()
    .or(z.literal('')),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;