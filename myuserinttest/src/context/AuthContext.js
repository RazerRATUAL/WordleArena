import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("wordle_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await api.getMe();
          setUser(profile);
        } catch (err) {
          console.warn("Session expired or invalid token:", err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    localStorage.setItem("wordle_token", data.token);
    setToken(data.token);
    setUser({
      username: data.username,
      score: data.score,
      gamesPlayed: data.gamesPlayed,
      gamesWon: data.gamesWon,
      currentStreak: data.currentStreak,
      maxStreak: data.maxStreak,
    });
    return data;
  };

  const register = async (username, password) => {
    const data = await api.register(username, password);
    localStorage.setItem("wordle_token", data.token);
    setToken(data.token);
    setUser({
      username: data.username,
      score: data.score,
      gamesPlayed: data.gamesPlayed,
      gamesWon: data.gamesWon,
      currentStreak: data.currentStreak,
      maxStreak: data.maxStreak,
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("wordle_token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const profile = await api.getMe();
        setUser(profile);
      } catch (err) {
        console.error("Failed to refresh user profile:", err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
