import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Container,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { name: "Play", path: "/", icon: <SportsEsportsIcon fontSize="small" sx={{ mr: 0.5 }} /> },
  { name: "Leaderboard", path: "/leaderboard", icon: <EmojiEventsIcon fontSize="small" sx={{ mr: 0.5 }} /> },
  { name: "About", path: "/about", icon: <InfoOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} /> },
];

const NavBar = ({ onOpenAuth }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  return (
    <AppBar position="sticky" elevation={2} sx={{ backgroundColor: "#1e1e24" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          {/* Brand Logo - Desktop */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "inherit",
              mr: 4,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                bgcolor: "#538d4e",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                color: "#ffffff",
                fontSize: "1.2rem",
              }}
            >
              W
            </Box>
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 800,
                letterSpacing: ".1rem",
                color: "#ffffff",
              }}
            >
              WORDLE<span style={{ color: "#538d4e" }}>ARENA</span>
            </Typography>
          </Box>

          {/* Mobile Menu Icon */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {navLinks.map((link) => (
                <MenuItem
                  key={link.name}
                  component={Link}
                  to={link.path}
                  onClick={handleCloseNavMenu}
                  selected={location.pathname === link.path}
                >
                  <Typography textAlign="center">{link.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Brand Logo - Mobile */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                bgcolor: "#538d4e",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                color: "#ffffff",
                fontSize: "1rem",
              }}
            >
              W
            </Box>
            <Typography variant="h6" fontWeight={800} color="#ffffff">
              WORDLE
            </Typography>
          </Box>

          {/* Desktop Nav Links */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Button
                  key={link.name}
                  component={Link}
                  to={link.path}
                  sx={{
                    my: 2,
                    color: isActive ? "#ffffff" : "#b0b3b8",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: isActive ? 700 : 500,
                    borderBottom: isActive ? "2px solid #538d4e" : "2px solid transparent",
                    borderRadius: 0,
                    px: 2,
                    "&:hover": {
                      color: "#ffffff",
                      backgroundColor: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  {link.icon}
                  {link.name}
                </Button>
              );
            })}
          </Box>

          {/* Auth State in Navbar */}
          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 1.5 }}>
            {user ? (
              <>
                <Chip
                  label={`${user.score} pts`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(83, 141, 78, 0.25)",
                    color: "#81c784",
                    fontWeight: 700,
                    border: "1px solid #538d4e",
                    display: { xs: "none", sm: "flex" },
                  }}
                />
                <Tooltip title="User Menu">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: "#538d4e", width: 36, height: 36, fontSize: "0.95rem" }}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  keepMounted
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {user.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Score: {user.score} | Streak: {user.currentStreak}
                    </Typography>
                  </Box>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography textAlign="center">Sign Out</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                size="small"
                startIcon={<PersonIcon />}
                onClick={onOpenAuth}
                sx={{
                  bgcolor: "#538d4e",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#467742" },
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
