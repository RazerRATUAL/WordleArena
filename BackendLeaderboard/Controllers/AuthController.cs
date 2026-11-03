using System.Security.Claims;
using BackendLeaderboard.DTOs;
using BackendLeaderboard.Models;
using BackendLeaderboard.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackendLeaderboard.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly LeaderboardDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthController(LeaderboardDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var normalizedUsername = request.Username.Trim();

            var exists = await _context.Users.AnyAsync(u => u.Username.ToLower() == normalizedUsername.ToLower());
            if (exists)
            {
                return Conflict(new { message = "Username is already taken." });
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                Username = normalizedUsername,
                PasswordHash = passwordHash,
                Score = 0,
                GamesPlayed = 0,
                GamesWon = 0,
                CurrentStreak = 0,
                MaxStreak = 0,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                Username = user.Username,
                Score = user.Score,
                GamesPlayed = user.GamesPlayed,
                GamesWon = user.GamesWon,
                CurrentStreak = user.CurrentStreak,
                MaxStreak = user.MaxStreak
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == request.Username.Trim().ToLower());
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                Username = user.Username,
                Score = user.Score,
                GamesPlayed = user.GamesPlayed,
                GamesWon = user.GamesWon,
                CurrentStreak = user.CurrentStreak,
                MaxStreak = user.MaxStreak
            });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
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

            return Ok(new UserProfileDto
            {
                Id = user.Id,
                Username = user.Username,
                Score = user.Score,
                GamesPlayed = user.GamesPlayed,
                GamesWon = user.GamesWon,
                CurrentStreak = user.CurrentStreak,
                MaxStreak = user.MaxStreak
            });
        }
    }
}
