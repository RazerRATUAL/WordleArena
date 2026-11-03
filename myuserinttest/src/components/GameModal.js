import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import ReplayIcon from "@mui/icons-material/Replay";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const GameModal = ({
  open,
  won,
  targetWord,
  attempts,
  pointsEarned,
  user,
  onPlayAgain,
  onOpenAuth,
}) => {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", pb: 1, pt: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: won ? "#4caf50" : "#f44336",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          {won ? <EmojiEventsIcon fontSize="large" /> : null}
          {won ? "SPLENDID!" : "GAME OVER"}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", pb: 2 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          The word was:
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            letterSpacing: 4,
            color: "primary.main",
            mb: 2,
          }}
        >
          {targetWord}
        </Typography>

        {won && (
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: "rgba(76, 175, 80, 0.08)",
              border: "1px solid rgba(76, 175, 80, 0.3)",
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Solved in {attempts} {attempts === 1 ? "guess" : "guesses"}!
            </Typography>
            {user ? (
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                +{pointsEarned} points awarded to your profile!
              </Typography>
            ) : null}
          </Paper>
        )}

        {user ? (
          <Box sx={{ display: "flex", justifyContent: "space-around", my: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {user.score}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Score
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ color: "#ff9800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <WhatshotIcon fontSize="small" sx={{ mr: 0.5 }} />
                {user.currentStreak}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Streak
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {user.gamesPlayed > 0
                  ? Math.round((user.gamesWon / user.gamesPlayed) * 100)
                  : 0}
                %
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Win Rate
              </Typography>
            </Box>
          </Box>
        ) : (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: "rgba(33, 150, 243, 0.08)",
              border: "1px solid rgba(33, 150, 243, 0.3)",
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" sx={{ mb: 1.5 }}>
              Playing as Guest. Log in to track your streak and rank on the global leaderboard!
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PersonAddIcon />}
              onClick={onOpenAuth}
            >
              Sign In / Register
            </Button>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 0, justifyContent: "center" }}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          startIcon={<ReplayIcon />}
          onClick={onPlayAgain}
          sx={{ px: 4, py: 1.2, fontWeight: "bold" }}
        >
          Play Again
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameModal;
