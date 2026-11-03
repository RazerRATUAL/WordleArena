import React from "react";
import { Box, Button } from "@mui/material";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

const getKeyColor = (status, themeMode) => {
  if (status === "correct") return { bg: "#538d4e", color: "#ffffff" };
  if (status === "present") return { bg: "#b59f3b", color: "#ffffff" };
  if (status === "absent") return { bg: "#3a3a3c", color: "#ffffff" };
  return { bg: "#818384", color: "#ffffff" };
};

const Keyboard = ({ onKeyPress, letterStatuses = {} }) => {
  return (
    <Box sx={{ width: "100%", maxWidth: 500, mx: "auto", px: 1, my: 2 }}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "5px",
            my: "4px",
          }}
        >
          {row.map((key) => {
            const isSpecial = key === "ENTER" || key === "BACKSPACE";
            const status = letterStatuses[key];
            const colors = getKeyColor(status);

            return (
              <Button
                key={key}
                variant="contained"
                onClick={() => onKeyPress(key)}
                sx={{
                  minWidth: isSpecial ? { xs: 45, sm: 65 } : { xs: 28, sm: 40 },
                  height: 52,
                  px: isSpecial ? 1 : 0.5,
                  fontSize: isSpecial ? { xs: "0.7rem", sm: "0.85rem" } : "1.1rem",
                  fontWeight: "bold",
                  backgroundColor: colors.bg,
                  color: colors.color,
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: colors.bg,
                    filter: "brightness(1.15)",
                  },
                }}
              >
                {key === "BACKSPACE" ? <BackspaceOutlinedIcon fontSize="small" /> : key}
              </Button>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default Keyboard;
