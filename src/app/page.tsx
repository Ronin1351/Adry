'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Box, Container, Typography, Button, Grid, Card, CardContent, CardActions, Chip, Avatar } from '@mui/material';
import { 
  Home, 
  Person, 
  Business, 
  Message, 
  Search, 
  Payment,
  Verified,
  Star,
  LocationOn,
  Schedule
} from '@mui/icons-material';
import Link from 'next/link';

export default function AdryHomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on user role
      if (user?.role === 'EMPLOYEE') {
        router.push('/employee/dashboard');
      } else if (user?.role === 'EMPLOYER') {
        router.push('/employer/dashboard');
      } else if (user?.role === 'ADMIN') {
        router.push('/admin/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const features = [
    {
      icon: <Person sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'For Housekeepers',
      description: 'Create your profile, showcase your skills, and get discovered by families looking for trusted help.',
      action: 'Create Profile',
      href: '/register?role=employee',
      color: 'primary',
    },
    {
      icon: <Business sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'For Employers',
      description: 'Find verified housekeepers in your area. Browse profiles for free, pay only when you want to contact them.',
      action: 'Find Help',
      href: '/register?role=employer',
      color: 'secondary',
    },
    {
      icon: <Verified sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Verified Profiles',
      description: 'All housekeepers are verified with proper documents including PhilID, PhilHealth, and Pag-IBIG.',
      action: 'Learn More',
      href: '/verification',
      color: 'success',
    },
    {
      icon: <Message sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Direct Communication',
      description: 'Message and schedule interviews directly with candidates. No middlemen, no hidden fees.',
      action: 'How It Works',
      href: '/how-it-works',
      color: 'info',
    },
  ];

  const stats = [
    { number: '500+', label: 'Verified Housekeepers' },
    { number: '1,200+', label: 'Happy Families' },
    { number: '98%', label: 'Success Rate' },
    { number: '₱600', label: 'Per 3 Months' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Find Trusted Housekeepers in the Philippines
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9, maxWidth: '800px', mx: 'auto' }}>
            Connect with verified, experienced housekeepers. Browse profiles for free, 
            pay only when you want to contact them. Safe, secure, and reliable.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/register?role=employee"
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: 'grey.100' }
              }}
              startIcon={<Person />}
            >
              I'm a Housekeeper
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/register?role=employer"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                px: 4,
                py: 1.5,
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
              startIcon={<Business />}
            >
              I Need Help
            </Button>
          </Box>
          
          {/* Stats */}
          <Grid container spacing={4} sx={{ mt: 6 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" component="div" fontWeight="bold">
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose Adry?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          The most trusted platform for household help in the Philippines
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    component={Link}
                    href={feature.href}
                    variant="contained"
                    size="large"
                    color={feature.color as any}
                  >
                    {feature.action}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Simple, transparent, and effective
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
                  <Search sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  1. Browse & Search
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Search through verified housekeeper profiles. Filter by location, skills, experience, and salary range.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
                  <Payment sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  2. Subscribe to Contact
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Pay ₱600 every 3 months to unlock messaging and interview scheduling with candidates.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'success.main', width: 80, height: 80, mx: 'auto', mb: 2 }}>
                  <Schedule sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  3. Connect & Hire
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Message candidates, schedule interviews, and find the perfect match for your household.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FF6F00 0%, #FF9800 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of families and housekeepers who trust Adry for their household needs.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              href="/register?role=employee"
              sx={{ 
                bgcolor: 'white', 
                color: 'secondary.main',
                px: 4,
                py: 1.5,
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Start as Housekeeper
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/register?role=employer"
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                px: 4,
                py: 1.5,
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Find Housekeeper
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}