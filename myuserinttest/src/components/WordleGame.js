import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Snackbar, Alert, Container, Chip, Tooltip, IconButton, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WordleGrid from "./WordleGrid";
import Keyboard from "./Keyboard";
import GameModal from "./GameModal";
import DictionaryModal from "./DictionaryModal";
import { getRandomWord, TARGET_WORDS } from "../data/words";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

// Standard Wordle duplicate-handling evaluator
export const evaluateGuess = (guess, target) => {
  const result = Array(WORD_LENGTH).fill("absent");
  const targetChars = target.split("");
  const guessChars = guess.split("");

  // Letter frequency map
  const letterCounts = {};
  for (const char of targetChars) {
    letterCounts[char] = (letterCounts[char] || 0) + 1;
  }

  // First pass: mark correct letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = "correct";
      letterCounts[guessChars[i]] -= 1;
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;

    const char = guessChars[i];
    if (letterCounts[char] && letterCounts[char] > 0) {
      result[i] = "present";
      letterCounts[char] -= 1;
    } else {
      result[i] = "absent";
    }
  }

  return result;
};

const WordleGame = ({ onOpenAuth }) => {
  const { user, refreshUser } = useAuth();

  const [targetWord, setTargetWord] = useState(() => getRandomWord());
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [letterStatuses, setLetterStatuses] = useState({});
  const [shakeRow, setShakeRow] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [pointsEarned, setPointsEarned] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [dictionaryOpen, setDictionaryOpen] = useState(false);

  // Reset game with a new random word
  const resetGame = useCallback(() => {
    setTargetWord(getRandomWord());
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setGameWon(false);
    setLetterStatuses({});
    setPointsEarned(0);
    setModalOpen(false);
  }, []);

  const triggerShake = (message) => {
    setToastMessage(message);
    setShakeRow(true);
    setTimeout(() => setShakeRow(false), 500);
  };

  const handleScoreSubmission = useCallback(
    async (won, attemptsCount) => {
      if (!user) return;
      try {
        const response = await api.submitScore({
          won,
          attempts: attemptsCount,
          targetWord,
        });
        setPointsEarned(response.pointsEarned);
        await refreshUser();
      } catch (err) {
        console.error("Score submission error:", err);
      }
    },
    [user, targetWord, refreshUser]
  );

  const submitGuess = useCallback(async () => {
    if (currentGuess.length !== WORD_LENGTH) {
      triggerShake("Word must be 5 letters");
      return;
    }

    // Optional validation against word bank
    const upperGuess = currentGuess.toUpperCase();
    if (!TARGET_WORDS.includes(upperGuess)) {
      triggerShake("Word not in list");
      return;
    }

    const statuses = evaluateGuess(upperGuess, targetWord);
    const newGuesses = [...guesses, { word: upperGuess, statuses }];
    setGuesses(newGuesses);
    setCurrentGuess("");

    // Update keyboard statuses
    setLetterStatuses((prev) => {
      const updated = { ...prev };
      upperGuess.split("").forEach((letter, i) => {
        const currentStatus = updated[letter];
        const newStatus = statuses[i];

        if (newStatus === "correct") {
          updated[letter] = "correct";
        } else if (newStatus === "present" && currentStatus !== "correct") {
          updated[letter] = "present";
        } else if (!currentStatus) {
          updated[letter] = "absent";
        }
      });
      return updated;
    });

    const isWin = upperGuess === targetWord;
    const isLoss = !isWin && newGuesses.length >= MAX_GUESSES;

    if (isWin) {
      setGameWon(true);
      setGameOver(true);
      await handleScoreSubmission(true, newGuesses.length);
      setTimeout(() => setModalOpen(true), 900);
    } else if (isLoss) {
      setGameWon(false);
      setGameOver(true);
      await handleScoreSubmission(false, newGuesses.length);
      setTimeout(() => setModalOpen(true), 900);
    }
  }, [currentGuess, guesses, targetWord, handleScoreSubmission]);

  const handleKeyPress = useCallback(
    (key) => {
      if (gameOver) return;

      if (key === "ENTER") {
        submitGuess();
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key)) {
        if (currentGuess.length < WORD_LENGTH) {
          setCurrentGuess((prev) => prev + key);
        }
      }
    },
    [currentGuess, gameOver, submitGuess]
  );

  // Physical Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      const key = e.key.toUpperCase();
      if (key === "ENTER") {
        handleKeyPress("ENTER");
      } else if (key === "BACKSPACE") {
        handleKeyPress("BACKSPACE");
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  return (
    <Container maxWidth="sm" sx={{ py: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Game Header Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: 500,
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 1.5,
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 800, letterSpacing: 1 }}>
            WORDLE ARENA
          </Typography>
          {user && (
            <Chip
              icon={<WhatshotIcon sx={{ color: "#ff9800 !important" }} />}
              label={`Streak: ${user.currentStreak}`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            startIcon={<MenuBookIcon />}
            onClick={() => setDictionaryOpen(true)}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              textTransform: "none",
              borderColor: "rgba(83, 141, 78, 0.5)",
            }}
          >
            Dictionary
          </Button>

          <Tooltip title="New Word">
            <IconButton onClick={resetGame} color="inherit">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Grid */}
      <WordleGrid
        guesses={guesses}
        currentGuess={currentGuess}
        maxGuesses={MAX_GUESSES}
        wordLength={WORD_LENGTH}
        shakeCurrentRow={shakeRow}
      />

      {/* Virtual Keyboard */}
      <Keyboard onKeyPress={handleKeyPress} letterStatuses={letterStatuses} />

      {/* Alert toast for short words or invalid entries */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={2000}
        onClose={() => setToastMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" variant="filled" sx={{ fontWeight: "bold" }}>
          {toastMessage}
        </Alert>
      </Snackbar>

      {/* Victory / Defeat Modal */}
      <GameModal
        open={modalOpen}
        won={gameWon}
        targetWord={targetWord}
        attempts={guesses.length}
        pointsEarned={pointsEarned}
        user={user}
        onPlayAgain={resetGame}
        onOpenAuth={onOpenAuth}
      />

      {/* Dictionary / Word Bank Modal */}
      <DictionaryModal
        open={dictionaryOpen}
        onClose={() => setDictionaryOpen(false)}
        onSelectWord={(word) => {
          if (!gameOver) {
            setCurrentGuess(word);
          }
        }}
      />
    </Container>
  );
};

export default WordleGame;
