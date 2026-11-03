using System;
using System.ComponentModel.DataAnnotations;

namespace BackendLeaderboard.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(30)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public int Score { get; set; } = 0;

        public int GamesPlayed { get; set; } = 0;

        public int GamesWon { get; set; } = 0;

        public int CurrentStreak { get; set; } = 0;

        public int MaxStreak { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
