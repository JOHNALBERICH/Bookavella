import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { discountService } from '../services/discountService';
import { Discount, ApiResponse } from '@/types';
import { toast } from 'sonner';

/**
 * Consulta reativa com cálculo estrito de validade de cupom no cliente
 * @param code String do cupom
 * @param enabled Gatilho condicional para disparar a query
 */
export function useDiscountByCode(code: string, enabled: boolean) {
  return useQuery({
    queryKey: ['discount', code],
    queryFn: async () => {
      const response = await discountService.getDiscountByCode(code);
      const discount = response.data;
      
      const now = new Date();
      const startDate = discount?.startDate ? new Date(discount.startDate) : new Date();
      const endDate = discount?.endDate ? new Date(discount.endDate) : new Date();
      
      // Validação baseada no estado ativo e intervalo de datas vigente
      const isValid = discount
        ? discount.isActive && now >= startDate && now <= endDate
        : false;

      return {
        ...response,
        isValid,
      };
    },
    enabled: enabled && !!code,
  });
}

/**
 * Hook de Estado encapsulado para gerenciar as mutações de desconto no carrinho de compras
 */
export function useApplyDiscount() {
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);

  const applyDiscount = useCallback(async (code: string) => {
    try {
      const response = await discountService.getDiscountByCode(code);
      const discount = response.data;

      if (!response.success || !discount) {
        toast.error('Invalid or expired code');
        setAppliedDiscount(null);
        return;
      }

      const now = new Date();
      const startDate = discount.startDate ? new Date(discount.startDate) : new Date();
      const endDate = discount.endDate ? new Date(discount.endDate) : new Date();

      // Critério estrito de validação estrutural no cliente
      const isValid = discount.isActive && now >= startDate && now <= endDate;

      if (isValid) {
        setAppliedDiscount(discount);
        toast.success('Discount applied successfully');
      } else {
        toast.error('Invalid or expired code');
        setAppliedDiscount(null);
      }
    } catch {
      toast.error('Invalid or expired code');
      setAppliedDiscount(null);
    }
  }, []);

  const removeDiscount = useCallback(() => {
    setAppliedDiscount(null);
    toast.success('Discount removed');
  }, []);

  /**
   * Retorna o valor de precificação recalculado com base na porcentagem de amortização
   */
  const computedPrice = useCallback((basePrice: number): number => {
    if (!appliedDiscount) return basePrice;
    
    const percentage = appliedDiscount.discountPercentage;
    const discountAmount = basePrice * (percentage / 100);
    return Math.max(0, basePrice - discountAmount);
  }, [appliedDiscount]);

  return {
    appliedDiscount,
    applyDiscount,
    removeDiscount,
    computedPrice,
  };
}