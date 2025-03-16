import { Box, Button, Container, Typography, AppBar, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import gasLogo from '../../assets/icons/gas-logo.svg';
import videoBackground from '../../assets/video/video-back.mp4';

export const LandingPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img 
              src={gasLogo} 
              alt="GasInSight Logo" 
              style={{ 
                width: '36px', 
                height: '36px', 
                marginRight: '12px'
              }} 
            />
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'black' }}>
              GasInSight
            </Typography>
          </Box>
          <Box>
            <Button 
                variant="contained" 
                component={Link} 
                to="/dashboard"
                sx={{ 
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                Dashboard
              </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Toolbar placeholder to push content below AppBar */}
      <Toolbar />

      {/* Main content with video background */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: 'white',
          minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
          overflow: 'hidden'
        }}
      >
        {/* Video Background */}
        <Box
          component="video"
          autoPlay
          muted
          loop
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1
          }}
        >
          <source src={videoBackground} type="video/mp4" />
          Your browser does not support the video tag.
        </Box>
        
        {/* Dark overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: -1
          }}
        />

        <Container maxWidth="md" sx={{ textAlign: 'center', py: 10, position: 'relative', zIndex: 1 }}>
          <Typography
            component="h1"
            variant="h2"
            sx={{ fontWeight: 'bold', my: 3, fontSize: '3.5rem' }}
          >
            Advanced Gas Monitoring Solutions
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, fontSize: '1.4rem' }}>
            Real-time insights for your critical infrastructure — monitor your facilities with precision and confidence
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            <Button 
              variant="outlined" 
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                fontSize: '1.2rem',
                padding: '12px 24px',
                borderWidth: '2px',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: '2px'
                }
              }}
              component={Link}
              to="/dashboard"
              size="large"
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
