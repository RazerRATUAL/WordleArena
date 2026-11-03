import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import RefreshIcon from "@mui/icons-material/Refresh";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

const getRankBadge = (rank) => {
  if (rank === 1) return <Typography sx={{ fontSize: "1.4rem" }}>🥇</Typography>;
  if (rank === 2) return <Typography sx={{ fontSize: "1.4rem" }}>🥈</Typography>;
  if (rank === 3) return <Typography sx={{ fontSize: "1.4rem" }}>🥉</Typography>;
  return <Typography fontWeight="bold" color="text.secondary">#{rank}</Typography>;
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getLeaderboard(50);
      setLeaderboard(data);
    } catch (err) {
      setError("Unable to connect to the leaderboard service. Ensure the .NET API is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={800} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EmojiEventsIcon color="primary" fontSize="large" /> Global Leaderboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Compete with players worldwide. Scores are calculated using guesses used and win streaks.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchLeaderboard}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Table aria-label="leaderboard table">
            <TableHead sx={{ backgroundColor: "action.hover" }}>
              <TableRow>
                <TableCell align="center" sx={{ width: 80, fontWeight: 700 }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Player</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Score</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Won / Played</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Win Rate</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>Streak</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    No scores recorded yet. Be the first to win a game!
                  </TableCell>
                </TableRow>
              ) : (
                leaderboard.map((row) => {
                  const isCurrent = user && user.username === row.username;

                  return (
                    <TableRow
                      key={row.username}
                      sx={{
                        backgroundColor: isCurrent ? "rgba(33, 150, 243, 0.08)" : "inherit",
                        "&:hover": { backgroundColor: "action.hover" },
                      }}
                    >
                      <TableCell align="center">{getRankBadge(row.rank)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: isCurrent ? "primary.main" : "secondary.main", width: 34, height: 34, fontSize: "0.9rem" }}>
                            {row.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography fontWeight={isCurrent ? 700 : 500}>
                            {row.username}
                          </Typography>
                          {isCurrent && (
                            <Chip label="You" size="small" color="primary" sx={{ height: 20, fontSize: "0.7rem" }} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={700} color="primary.main">
                          {row.score.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {row.gamesWon} / {row.gamesPlayed}
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontWeight={600}>
                          {row.winRate}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                          <WhatshotIcon sx={{ color: "#ff9800", fontSize: 18 }} />
                          <Typography fontWeight={600}>
                            {row.currentStreak}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            (max {row.maxStreak})
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Leaderboard;
