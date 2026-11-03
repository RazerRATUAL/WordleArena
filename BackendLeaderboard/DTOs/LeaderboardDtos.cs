using System.ComponentModel.DataAnnotations;

namespace BackendLeaderboard.DTOs
{
    public class LeaderboardEntryDto
    {
        public int Rank { get; set; }
        public string Username { get; set; } = string.Empty;
        public int Score { get; set; }
        public int GamesPlayed { get; set; }
        public int GamesWon { get; set; }
        public int CurrentStreak { get; set; }
        public int MaxStreak { get; set; }
        public double WinRate { get; set; }
    }

    public class SubmitScoreRequest
    {
        [Required]
        public bool Won { get; set; }

        [Range(1, 6)]
        public int Attempts { get; set; }

        public string TargetWord { get; set; } = string.Empty;
    }

    public class SubmitScoreResponse
    {
        public int PointsEarned { get; set; }
        public int NewScore { get; set; }
        public int GamesPlayed { get; set; }
        public int GamesWon { get; set; }
        public int CurrentStreak { get; set; }
        public int MaxStreak { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
