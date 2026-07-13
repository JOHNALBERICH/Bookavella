using Hoteldotnetserver.Data;
using Hoteldotnetserver.Repository;
using Hoteldotnetserver.DTO.Response;
using Hoteldotnetserver.DTO.Request;
using Hoteldotnetserver.Entities;
using Microsoft.EntityFrameworkCore;
namespace Hoteldotnetserver.Implementation
{
    public class ReviewImpl : IReviewRepository
    {
        public readonly HotelDbContext db;
        public ReviewImpl(HotelDbContext db)
        {
            this.db = db;
        }
        public async Task<Reviews> CreateReviewAsync(Reviews review)
        {
            db.Reviews.Add(review);
            await db.SaveChangesAsync();
            return review;
        }
        public async Task UpdateReviewAsync(Reviews review)
        {
            db.Reviews.Update(review);
            await db.SaveChangesAsync();
        }
        public async Task DeleteReviewAsync(Guid id)
        {
            var review = await db.Reviews.FindAsync(id);
            if (review != null)
            {
                db.Reviews.Remove(review);
                await db.SaveChangesAsync();
            }
        }
        public async Task<Reviews?> GetReviewByIdAsync(Guid id)
        {
            return await db.Reviews.FindAsync(id);
        }
        public async Task<PaginationResponse<CommentAndRatingResponse>> GetAllReviewsAsync(ReviewQueryRequest request)
        {
            var query = db.Reviews.AsQueryable();

            if (!string.IsNullOrEmpty(request.Search))
            {
                query = query.Where(r => r._comment.Contains(request.Search));
            }

            var totalCount = await query.CountAsync();

            var reviews = await query
                .OrderByDescending(r => r._createdAt)
                .Skip((request.Pagination.PageIndex - 1) * request.Pagination.PageSize)
                .Take(request.Pagination.PageSize)
                .ToListAsync();

            var response = new PaginationResponse<CommentAndRatingResponse>
            {
                TotalCount = totalCount,
                PageIndex = request.Pagination.PageIndex,
                PageSize = request.Pagination.PageSize,
                Items = reviews.Select(r => new CommentAndRatingResponse
                {
                    
                    UserName = r.User.name,
                    Rating = r._rating,
                    Comment = r._comment,
                    UserAvatar = r.User.AvatarUrl,
                }).ToList()
            };

            return response;
        }
        public async Task<AverageReview> GetAverageReviewAsync(Guid propertyId)
        {
            var averageRating = await db.Reviews
                .Where(r => r._propertyId == propertyId)
                .AverageAsync(r => (double?)r._rating) ?? 0.0;

            return new AverageReview
            {
                AverageRating = averageRating
            };
        }
        public async Task<IEnumerable<Reviews>> GetReviewsByPropertyIdAsync(Guid propertyId)
        {
            return await db.Reviews
                .Where(r => r._propertyId == propertyId)
                .Include(r => r.User) // Include the User entity to access user details
                .ToListAsync();
        }
        
    }
}