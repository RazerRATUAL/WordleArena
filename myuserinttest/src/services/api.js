const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5057/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("wordle_token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  async register(username, password) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data;
  },

  async login(username, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch user profile");
    }
    return res.json();
  },

  async getLeaderboard(limit = 50) {
    const res = await fetch(`${API_BASE_URL}/leaderboard?limit=${limit}`);
    if (!res.ok) {
      throw new Error("Failed to fetch leaderboard");
    }
    return res.json();
  },

  async submitScore(scoreData) {
    const res = await fetch(`${API_BASE_URL}/leaderboard/score`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(scoreData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to submit score");
    }
    return data;
  },
};
