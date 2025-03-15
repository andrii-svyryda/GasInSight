import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          GasInSight
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Comprehensive monitoring and management system for gas facilities
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          {isAuthenticated ? (
            <Button variant="contained" component={Link} to="/dashboard" size="large">
              Go to Dashboard
            </Button>
          ) : (
            <Button variant="contained" component={Link} to="/login" size="large">
              Login
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  );
};
