export interface CreateReviewRequest {
  comment: string;
  rating: number; // Classificação decimal ou inteira de 1 a 5
  propertyId: string; // Guid do hotel avaliado
}

export interface UpdateReviewRequest {
  comment: string;
  rating: number;
}