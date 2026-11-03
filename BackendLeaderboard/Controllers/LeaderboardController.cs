using System.Security.Claims;
using BackendLeaderboard.DTOs;
using BackendLeaderboard.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendLeaderboard.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaderboardController : ControllerBase
    {
        private readonly LeaderboardDbContext _context;

        public LeaderboardController(LeaderboardDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLeaderboard([FromQuery] int limit = 50)
        {
            if (limit <= 0 || limit > 100)
                limit = 50;

            var users = await _context.Users
                .AsNoTracking()
                .OrderByDescending(u => u.Score)
                .ThenByDescending(u => u.GamesWon)
                .ThenBy(u => u.CreatedAt)
                .Take(limit)
                .ToListAsync();

            var leaderboard = users.Select((u, index) => new LeaderboardEntryDto
            {
                Rank = index + 1,
                Username = u.Username,
                Score = u.Score,
                GamesPlayed = u.GamesPlayed,
                GamesWon = u.GamesWon,
                CurrentStreak = u.CurrentStreak,
                MaxStreak = u.MaxStreak,
                WinRate = u.GamesPlayed > 0 ? Math.Round((double)u.GamesWon / u.GamesPlayed * 100, 1) : 0
            }).ToList();

            return Ok(leaderboard);
        }

        [HttpPost("score")]
        [Authorize]
        public async Task<IActionResult> SubmitScore([FromBody] SubmitScoreRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            int pointsEarned = 0;
            user.GamesPlayed += 1;

            if (request.Won)
            {
                user.GamesWon += 1;
                user.CurrentStreak += 1;
                if (user.CurrentStreak > user.MaxStreak)
                {
                    user.MaxStreak = user.CurrentStreak;
                }

                // Points calculation: attempts 1..6
                // 1 -> 100, 2 -> 80, 3 -> 60, 4 -> 45, 5 -> 30, 6 -> 20 + streak bonus
                int basePoints = request.Attempts switch
                {
                    1 => 100,
                    2 => 80,
                    3 => 60,
                    4 => 45,
                    5 => 30,
                    _ => 20
                };

                int streakBonus = Math.Min(user.CurrentStreak * 5, 50); // cap streak bonus at 50
                pointsEarned = basePoints + streakBonus;
                user.Score += pointsEarned;
            }
            else
            {
                user.CurrentStreak = 0;
                pointsEarned = 0;
            }

            await _context.SaveChangesAsync();

            return Ok(new SubmitScoreResponse
            {
                PointsEarned = pointsEarned,
                NewScore = user.Score,
                GamesPlayed = user.GamesPlayed,
                GamesWon = user.GamesWon,
                CurrentStreak = user.CurrentStreak,
                MaxStreak = user.MaxStreak,
                Message = request.Won ? $"Great job! +{pointsEarned} points added." : "Game over. Better luck next time!"
            });
        }
    }
}
