using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.Repository;
using Hoteldotnetserver.Entities;
using MapsterMapper;
namespace Hoteldotnetserver.Services
{
    public class ReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IMapper _mapper;
        private readonly IPropertiesRepository _propertyRepository;

        public ReviewService(IReviewRepository reviewRepository, IMapper mapper, IPropertiesRepository propertyRepository)
        {
            _reviewRepository = reviewRepository;
            _mapper = mapper;
            _propertyRepository = propertyRepository;
        }

        public async Task<ReviewResponse> CreateCommentAsync(CreateCommentRequest request, Guid userId)
        {
            // Check if the property exists
            var checkReview = await _propertyRepository.GetPropertiesAsync(request.propertyId);
            if (checkReview == null)
            {
                throw new Exception("Property not found.");
            }
            var review = _mapper.Map<Reviews>(request);
            review._userId = userId;
            await _reviewRepository.CreateReviewAsync(review);
            return new ReviewResponse { Message = "Comment created successfully." };
        }
        public async Task<ReviewResponse> UpdateCommentAsync(UpdateCommentRequest request, Guid reviewId, Guid userId)
        {
            var existingReview = await _reviewRepository.GetReviewByIdAsync(reviewId);
            if (existingReview == null)
            {
                throw new Exception("Review not found.");
            }
            if (existingReview._userId != userId)
            {
                throw new Exception("You are not authorized to update this review.");
            }
            _mapper.Map(request, existingReview);
            await _reviewRepository.UpdateReviewAsync(existingReview);
            return new ReviewResponse { Message = "Comment updated successfully." };
        }
        public async Task<ReviewResponse> DeleteCommentAsync(Guid reviewId, Guid userId)
        {
            var existingReview = await _reviewRepository.GetReviewByIdAsync(reviewId);
            if (existingReview == null)
            {
                throw new Exception("Review not found.");
            }
            if (existingReview._userId != userId)
            {
                throw new Exception("You are not authorized to delete this review.");
            }
            await _reviewRepository.DeleteReviewAsync(reviewId);
            return new ReviewResponse { Message = "Comment deleted successfully." };
        }
        public async Task<PaginationResponse<CommentAndRatingResponse>> GetAllCommentsAsync(ReviewQueryRequest request)
        {
            return await _reviewRepository.GetAllReviewsAsync(request);
        }
        public async Task<Reviews?> GetCommentByIdAsync(Guid reviewId)
        {
            return await _reviewRepository.GetReviewByIdAsync(reviewId);
        }
        public async Task<AverageReview> GetAverageReviewAsync(Guid propertyId)
        {
            return await _reviewRepository.GetAverageReviewAsync(propertyId);
        }
        
    }
}