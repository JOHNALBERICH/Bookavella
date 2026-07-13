export interface CreateDiscountRequest {
  roomId: string;
  discountCode: string;
  discountPercentage: number;
  endDate: string;
  startDate: string;
  isActive: boolean;
}

export interface UpdateDiscountRequest {
  discountCode?: string;
  discountPercentage?: number;
  endDate: string;
  startDate: string;
  isActive?: boolean;
  roomId: string;
}