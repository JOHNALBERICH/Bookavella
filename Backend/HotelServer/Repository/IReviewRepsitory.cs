using Hoteldotnetserver.Entities;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.DTO.Request;
namespace  Hoteldotnetserver.Repository
{
    public interface IReviewRepository
    {
        Task<Reviews> CreateReviewAsync(Reviews review);
        Task UpdateReviewAsync(Reviews review);
        Task DeleteReviewAsync(Guid id);
        Task<Reviews?> GetReviewByIdAsync(Guid id);
        Task<PaginationResponse<CommentAndRatingResponse>> GetAllReviewsAsync(ReviewQueryRequest request);
        Task<AverageReview> GetAverageReviewAsync(Guid propertyId);
        Task<IEnumerable<Reviews>> GetReviewsByPropertyIdAsync(Guid propertyId);
    }
}