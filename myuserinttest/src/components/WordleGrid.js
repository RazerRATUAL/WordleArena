import React from "react";
import { Box, Typography } from "@mui/material";

const getTileStyle = (status) => {
  switch (status) {
    case "correct":
      return {
        backgroundColor: "#538d4e",
        borderColor: "#538d4e",
        color: "#ffffff",
      };
    case "present":
      return {
        backgroundColor: "#b59f3b",
        borderColor: "#b59f3b",
        color: "#ffffff",
      };
    case "absent":
      return {
        backgroundColor: "#3a3a3c",
        borderColor: "#3a3a3c",
        color: "#ffffff",
      };
    default:
      return {
        backgroundColor: "transparent",
        borderColor: "#565758",
        color: "inherit",
      };
  }
};

const WordleGrid = ({ guesses, currentGuess, maxGuesses = 6, wordLength = 5, shakeCurrentRow }) => {
  const rows = [];

  for (let i = 0; i < maxGuesses; i++) {
    const isCompleted = i < guesses.length;
    const isCurrent = i === guesses.length;

    let letters = Array(wordLength).fill("");
    let statuses = Array(wordLength).fill("");

    if (isCompleted) {
      letters = guesses[i].word.split("");
      statuses = guesses[i].statuses;
    } else if (isCurrent) {
      letters = currentGuess.padEnd(wordLength, " ").split("").slice(0, wordLength);
    }

    rows.push(
      <Box
        key={i}
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "6px",
          my: "3px",
          animation: isCurrent && shakeCurrentRow ? "shake 0.4s ease-in-out" : "none",
          "@keyframes shake": {
            "0%, 100%": { transform: "translateX(0)" },
            "20%, 60%": { transform: "translateX(-6px)" },
            "40%, 80%": { transform: "translateX(6px)" },
          },
        }}
      >
        {letters.map((char, colIndex) => {
          const letter = char.trim();
          const status = statuses[colIndex];
          const style = getTileStyle(status);
          const hasLetter = letter.length > 0;

          return (
            <Box
              key={colIndex}
              sx={{
                width: { xs: 52, sm: 62 },
                height: { xs: 52, sm: 62 },
                border: "2px solid",
                borderColor: hasLetter && !isCompleted ? "#878a8c" : style.borderColor,
                backgroundColor: style.backgroundColor,
                color: style.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", sm: "2.1rem" },
                borderRadius: "4px",
                transition: "all 0.25s ease-in-out",
                userSelect: "none",
                transform: isCompleted ? "rotateX(0deg)" : hasLetter ? "scale(1.02)" : "none",
              }}
            >
              <Typography
                variant="h4"
                component="span"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.75rem", sm: "2rem" },
                  lineHeight: 1,
                }}
              >
                {letter}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Box sx={{ my: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {rows}
    </Box>
  );
};

export default WordleGrid;
