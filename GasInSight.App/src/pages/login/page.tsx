import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../store/api/authApi";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setTokens } from "../../store/slices/authSlice";
import videoBackground from "../../assets/video/video-back2.mp4";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = authApi.useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login({ username, password }).unwrap();
      dispatch(setTokens(result));
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid username or password");
      console.error("Login failed:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Video Background */}
      <Box
        component="video"
        autoPlay
        muted
        loop
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
        }}
      >
        <source src={videoBackground} type="video/mp4" />
        Your browser does not support the video tag.
      </Box>
      
      {/* Dark overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: -1,
        }}
      />

      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={12}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            backdropFilter: "blur(12px)",
            background: "rgba(255, 255, 255, 0.85)",
          }}
        >
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              component="h1"
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 1,
                letterSpacing: "-0.02em",
              }}
            >
              Log in to Gas Insights
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="dense"
              size="small"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="dense"
              size="small"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            {error && (
              <Typography
                color="error"
                sx={{
                  mt: 1,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                }}
              >
                {error}
              </Typography>
            )}

            <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
              <Button
                fullWidth
                type="submit"
                size="small"
                variant="contained"
                loading={isLoading}
                sx={{
                  py: 1,
                  minWidth: "120px",
                }}
                disabled={!username || !password}
              >
                {"Login"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
