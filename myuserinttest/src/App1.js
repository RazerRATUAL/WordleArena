import React, { useState, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import NavBar from "./components/NavBar";
import WordleGame from "./components/WordleGame";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import AuthModal from "./components/AuthModal";
import { AuthProvider } from "./context/AuthContext";

const App1 = () => {
  const [authOpen, setAuthOpen] = useState(false);

  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "dark",
          background: {
            default: "#121213",
            paper: "#1e1e24",
          },
          primary: {
            main: "#538d4e",
            contrastText: "#ffffff",
          },
          secondary: {
            main: "#b59f3b",
            contrastText: "#ffffff",
          },
        },
        typography: {
          fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
          ].join(","),
        },
        shape: {
          borderRadius: 6,
        },
      }),
    []
  );

  return (
    <AuthProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
          <NavBar onOpenAuth={() => setAuthOpen(true)} />

          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<WordleGame onOpenAuth={() => setAuthOpen(true)} />} />
              <Route path="/cz" element={<Navigate to="/" replace />} />
              <Route path="/blog" element={<Navigate to="/about" replace />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>

          <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
        </Box>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App1;
