import React from "react";
import { Container, Typography, Paper, Box, Grid, Card, CardContent, Chip, Divider } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import SecurityIcon from "@mui/icons-material/Security";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

const About = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>
        About Wordle Arena
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Wordle Arena is a modern full-stack web application combining the classic 5-letter word puzzle game with competitive global leaderboard tracking, secure authentication, and persistent user statistics.
      </Typography>

      <Grid container spacing={3} sx={{ my: 2 }}>
        <Grid item xs={12} sm={6}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <CodeIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Frontend Architecture
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Built with React 18 and Material-UI (MUI). Features a custom game loop handling letter frequency evaluation, physical and on-screen keyboard synchronization, responsive styling, and animated tile feedback.
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                <Chip label="React 18" size="small" />
                <Chip label="Material-UI (MUI)" size="small" />
                <Chip label="React Router v6" size="small" />
                <Chip label="Context API" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <StorageIcon color="secondary" />
                <Typography variant="h6" fontWeight={700}>
                  Backend Architecture
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Powered by ASP.NET Core (.NET 8) Web API with Entity Framework Core and an embedded SQLite database for self-contained, zero-configuration deployment.
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                <Chip label="ASP.NET Core 8" size="small" />
                <Chip label="EF Core" size="small" />
                <Chip label="SQLite" size="small" />
                <Chip label="REST API" size="small" />
                <Chip label="Swagger / OpenAPI" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <SecurityIcon color="success" />
                <Typography variant="h6" fontWeight={700}>
                  Security & Auth
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Stateless authentication using industry-standard JSON Web Tokens (JWT) and one-way password hashing via BCrypt (salt + work factor), preventing plain-text credential leaks.
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                <Chip label="JWT Bearer" size="small" />
                <Chip label="BCrypt Password Hashing" size="small" />
                <Chip label="CORS Policy" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <SportsEsportsIcon color="warning" />
                <Typography variant="h6" fontWeight={700}>
                  Scoring System
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Points reward efficiency and consistency: 1st guess: 100 pts, 2nd: 80 pts, 3rd: 60 pts, 4th: 45 pts, 5th: 30 pts, 6th: 20 pts. Maintaining consecutive win streaks adds bonus multipliers.
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                <Chip label="Streak Multipliers" size="small" />
                <Chip label="Efficiency Scoring" size="small" />
                <Chip label="Win Rate Stats" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={1} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          How to Play
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" component="div">
          <ul>
            <li>Guess the 5-letter word in 6 attempts or fewer.</li>
            <li>Each guess must be a valid 5-letter English word. Hit <strong>Enter</strong> to submit.</li>
            <li><strong>Green Tile:</strong> Letter is in the correct position.</li>
            <li><strong>Yellow Tile:</strong> Letter is in the word but in the wrong spot.</li>
            <li><strong>Gray Tile:</strong> Letter is not in the word.</li>
          </ul>
        </Typography>
      </Paper>
    </Container>
  );
};

export default About;
