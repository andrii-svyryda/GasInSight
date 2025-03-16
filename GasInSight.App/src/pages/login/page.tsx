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
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={12}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            backdropFilter: "blur(12px)",
            background: "rgba(255, 255, 255, 0.95)",
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
                {"Sign In"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
