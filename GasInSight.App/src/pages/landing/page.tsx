import { Box, Button, Container, Typography, AppBar, Toolbar, Grid, TextField, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import gasLogo from '../../assets/icons/gas-logo.svg';
import videoBackground from '../../assets/video/video-back2.mp4';
import TimelineIcon from '@mui/icons-material/Timeline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BuildIcon from '@mui/icons-material/Build';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SecurityIcon from '@mui/icons-material/Security';
import SensorsIcon from '@mui/icons-material/Sensors';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import dashboardImage from '../../assets/dash.jpg';
import mapImage from '../../assets/map.jpg';
import facilityBackground from '../../assets/fac.webp';

// Animated counter component
const AnimatedCounter = ({ end, duration = 2000, title }: { end: number; duration?: number; title: string }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;
    const startValue = 0;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * (end - startValue) + startValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    
    animationFrame = requestAnimationFrame(step);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, isVisible]);

  return (
    <Box ref={countRef} sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{ 
        width: { xs: 180, md: 220 },
        height: { xs: 180, md: 220 },
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': { 
          transform: 'scale(1.05)',
          boxShadow: '0 0 25px rgba(79, 195, 247, 0.3)'
        }
      }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#4fc3f7',
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}
        >
          {count.toLocaleString()}
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
        {title}
      </Typography>
    </Box>
  );
};

export const LandingPage = () => {
  // Form state for contact form
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // Form submission status
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    message: '',
    isError: false
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    message: false
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {
      name: formState.name.trim() === '',
      email: formState.email.trim() === '',
      message: formState.message.trim() === ''
    };
    
    setFormErrors(errors);
    
    // Return true if form is valid (no errors)
    return !Object.values(errors).some(error => error);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      setFormStatus({
        submitted: true,
        message: 'Please fill in all required fields.',
        isError: true
      });
      return;
    }
    
    // Here you would typically send the form data to a server
    // For now, we'll just simulate a successful submission
    
    // Show success message
    setFormStatus({
      submitted: true,
      message: 'Thank you for your message! We will get back to you soon.',
      isError: false
    });
    
    // Clear form fields
    setFormState({
      name: '',
      email: '',
      message: ''
    });
    
    // Reset the form status after 5 seconds
    setTimeout(() => {
      setFormStatus({
        submitted: false,
        message: '',
        isError: false
      });
    }, 5000);
  };

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
            Advanced Monitoring Solutions
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

      {/* Features and Benefits Section */}
      <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography 
            component="h2" 
            variant="h3" 
            align="center" 
            sx={{ mb: 6, fontWeight: 'bold', color: '#333' }}
          >
            Features & Benefits
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, 
            gap: 4 
          }}>
            {/* Feature 1 */}
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'white', 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-8px)' }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Real-Time Monitoring
                </Typography>
              </Box>
              <Typography variant="body1">
                Track all your gas infrastructure metrics in real-time with high-precision sensors and instant data transmission.
              </Typography>
            </Box>
            
            {/* Feature 2 */}
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'white', 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-8px)' }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AnalyticsIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Advanced Analytics
                </Typography>
              </Box>
              <Typography variant="body1">
                Gain valuable insights through our sophisticated data analysis tools that help identify patterns and potential issues.
              </Typography>
            </Box>
            
            {/* Feature 3 */}
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'white', 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-8px)' }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BuildIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Predictive Maintenance
                </Typography>
              </Box>
              <Typography variant="body1">
                Prevent costly downtime with our AI-powered predictive maintenance system that alerts you before failures occur.
              </Typography>
            </Box>
            
            {/* Feature 4 */}
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'white', 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-8px)' }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Comprehensive Reporting
                </Typography>
              </Box>
              <Typography variant="body1">
                Generate detailed reports on gas composition, flow rates, pressure levels, and more with just a few clicks.
              </Typography>
            </Box>
            
            {/* Feature 5 */}
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'white', 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-8px)' }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Safety Compliance
                </Typography>
              </Box>
              <Typography variant="body1">
                Stay compliant with industry regulations through automated monitoring of safety parameters and alert systems.
              </Typography>
            </Box>
            
            {/* Feature 6 */}
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'white', 
              borderRadius: 2, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'translateY(-8px)' }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SensorsIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  Multi-Sensor Integration
                </Typography>
              </Box>
              <Typography variant="body1">
                Monitor a wide range of parameters including temperature, pressure, flow, gas composition, and more with our unified sensor network.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Dashboard Showcase Section */}
      <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              component="h2" 
              variant="h3" 
              sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}
            >
              Powerful Analytics Dashboard
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ color: '#666', maxWidth: '800px', mx: 'auto' }}
            >
              Monitor all your critical gas infrastructure parameters in real-time with our intuitive and comprehensive dashboard
            </Typography>
          </Box>
          
          <Box sx={{ 
            position: 'relative',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            borderRadius: 4,
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 85%, rgba(0,0,0,0.1) 100%)',
              zIndex: 1
            }
          }}>
            <Box 
              component="img"
              src={dashboardImage}
              alt="GasInSight Analytics Dashboard"
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
                transform: 'translateY(0)',
                transition: 'transform 0.5s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-10px)'
                }
              }}
            />
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: 3,
            mt: 6 
          }}>
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'white', 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              maxWidth: '300px',
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                Real-Time Data
              </Typography>
              <Typography variant="body2">
                View live sensor readings with millisecond updates for immediate awareness of your system's status
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'white', 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              maxWidth: '300px',
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                Interactive Charts
              </Typography>
              <Typography variant="body2">
                Drill down into historical data with interactive charts that reveal patterns and trends over time
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'white', 
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              maxWidth: '300px',
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
                Customizable Views
              </Typography>
              <Typography variant="body2">
                Personalize your monitoring experience with customizable dashboards tailored to your specific needs
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Supported Facilities Section */}
      <Box sx={{ py: 8, backgroundColor: '#1a2035', color: 'white' }}>
        <Container maxWidth="lg">
          <Typography 
            component="h2" 
            variant="h3" 
            align="center" 
            sx={{ mb: 6, fontWeight: 'bold', color: 'white' }}
          >
            Facilities We Support
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 4 
          }}>
            {/* Facility 1 */}
            <Box sx={{ 
              p: 4, 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.02)'
              }
            }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#4fc3f7' }}>
                Gas Processing Plants
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Comprehensive monitoring of gas composition, flow rates, and pressure levels in processing facilities that separate natural gas liquids from natural gas.
              </Typography>
            </Box>
            
            {/* Facility 2 */}
            <Box sx={{ 
              p: 4, 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.02)'
              }
            }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#4fc3f7' }}>
                LNG Terminals
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Advanced monitoring solutions for liquefaction, storage, and regasification processes at liquefied natural gas terminals with critical temperature control.
              </Typography>
            </Box>
            
            {/* Facility 3 */}
            <Box sx={{ 
              p: 4, 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.02)'
              }
            }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#4fc3f7' }}>
                Pipeline Networks
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Real-time monitoring of extensive pipeline networks with leak detection, pressure management, and flow rate optimization across long distances.
              </Typography>
            </Box>
            
            {/* Facility 4 */}
            <Box sx={{ 
              p: 4, 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.02)'
              }
            }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#4fc3f7' }}>
                Storage Facilities
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Continuous monitoring of underground and above-ground gas storage facilities with volume tracking, pressure management, and safety systems.
              </Typography>
            </Box>
            
            {/* Facility 5 */}
            <Box sx={{ 
              p: 4, 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.02)'
              }
            }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#4fc3f7' }}>
                Compressor Stations
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                Specialized monitoring for compressor stations with vibration analysis, temperature control, and power consumption optimization.
              </Typography>
            </Box>
            
            {/* Facility 6 */}
            <Box sx={{ 
              p: 4, 
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'scale(1.02)'
              }
            }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#4fc3f7' }}>
                Gas Distribution Networks
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                End-to-end monitoring of urban and industrial gas distribution networks with pressure regulation, flow measurement, and safety compliance.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Global Coverage Map Section */}
      <Box sx={{ py: 8, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 6
          }}>
            {/* Text Content */}
            <Box sx={{ flex: 1, order: { xs: 2, md: 1 } }}>
              <Typography 
                component="h2" 
                variant="h3" 
                sx={{ fontWeight: 'bold', color: '#333', mb: 3 }}
              >
                Global Monitoring Network
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ color: '#555', mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}
              >
                Our extensive network of monitoring facilities spans across key gas infrastructure locations worldwide. With GasInSight, you gain access to a comprehensive view of your entire operation, regardless of geographic distribution.
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ color: '#555', mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}
              >
                The interactive map allows you to navigate between facilities, check their status in real-time, and respond quickly to any alerts or anomalies detected by our advanced monitoring system.
              </Typography>
              <Button 
                variant="contained" 
                component={Link}
                to="/dashboard"
                sx={{ 
                  backgroundColor: '#1976d2',
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                Explore Our Network
              </Button>
            </Box>
            
            {/* Map Image */}
            <Box 
              sx={{ 
                flex: 1, 
                order: { xs: 1, md: 2 },
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -15,
                  left: -15,
                  width: '100%',
                  height: '100%',
                  border: '2px solid #1976d2',
                  borderRadius: 2,
                  zIndex: 0
                }
              }}
            >
              <Box 
                component="img"
                src={mapImage}
                alt="GasInSight Global Monitoring Network Map"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  position: 'relative',
                  zIndex: 1
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ 
        py: 10, 
        backgroundColor: '#1a2035', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `linear-gradient(rgba(26, 32, 53, 0.85), rgba(26, 32, 53, 0.9)), url(${facilityBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            component="h2" 
            variant="h3" 
            align="center" 
            sx={{ mb: 8, fontWeight: 'bold', color: 'white' }}
          >
            Global Impact
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, 
            gap: { xs: 6, md: 4 },
            justifyItems: 'center'
          }}>
            <AnimatedCounter end={2845} title="Gas Processing Plants" />
            <AnimatedCounter end={1723} title="LNG Terminals" />
            <AnimatedCounter end={3156} title="Pipeline Networks" />
            <AnimatedCounter end={2418} title="Storage Facilities" />
            <AnimatedCounter end={1952} title="Compressor Stations" />
            <AnimatedCounter end={2637} title="Distribution Networks" />
          </Box>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box sx={{ 
        py: 6, 
        backgroundColor: '#0a101f', 
        color: 'white',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Company Information */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>GasInSight</Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Leading provider of advanced gas monitoring and analytics solutions for industrial facilities worldwide.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                Drahomanova Street, 18, Rivne, Rivne region, 33028
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  contact@gasinsight.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2">
                  +380 66 044 69 37
                </Typography>
              </Box>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Contact Us</Typography>
              <Paper elevation={0} sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
                  {formStatus.submitted && (
                    <Box sx={{ 
                      p: 2, 
                      mb: 2, 
                      backgroundColor: formStatus.isError ? 'rgba(255, 72, 72, 0.1)' : 'rgba(63, 140, 255, 0.1)', 
                      borderRadius: 1,
                      border: formStatus.isError ? '1px solid rgba(255, 72, 72, 0.3)' : '1px solid rgba(63, 140, 255, 0.3)'
                    }}>
                      <Typography variant="body2" color={formStatus.isError ? 'error' : 'primary'}>
                        {formStatus.message}
                      </Typography>
                    </Box>
                  )}
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Your Name"
                    name="name"
                    autoComplete="name"
                    variant="outlined"
                    value={formState.name}
                    onChange={handleInputChange}
                    error={formErrors.name}
                    helperText={formErrors.name ? "Name is required" : ""}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'rgb(255, 72, 72)',
                      },
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    variant="outlined"
                    value={formState.email}
                    onChange={handleInputChange}
                    error={formErrors.email}
                    helperText={formErrors.email ? "Email is required" : ""}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'rgb(255, 72, 72)',
                      },
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="message"
                    label="Message"
                    id="message"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={formState.message}
                    onChange={handleInputChange}
                    error={formErrors.message}
                    helperText={formErrors.message ? "Message is required" : ""}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'rgb(255, 72, 72)',
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      mt: 1, 
                      mb: 1, 
                      py: 1.2,
                      backgroundColor: '#3f8cff',
                      '&:hover': {
                        backgroundColor: '#2a70e0',
                      }
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Copyright */}
          <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
              &copy; {new Date().getFullYear()} GasInSight. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
