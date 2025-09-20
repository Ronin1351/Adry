'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { getEmployeeProfile } from '../../../store/slices/profileSlice';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import {
  Person,
  CheckCircle,
  Pending,
  Error,
  Message,
  Schedule,
  Visibility,
  VisibilityOff,
  Upload,
  Edit,
} from '@mui/icons-material';
import Link from 'next/link';

export default function EmployeeDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { employeeProfile, isLoading } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (user?.id) {
      dispatch(getEmployeeProfile(user.id));
    }
  }, [dispatch, user?.id]);

  const getDocumentStatus = (documents: any[]) => {
    const verified = documents?.filter(doc => doc.status === 'VERIFIED').length || 0;
    const total = documents?.length || 0;
    return { verified, total };
  };

  const getProfileCompleteness = () => {
    if (!employeeProfile) return 0;
    
    let score = 0;
    const maxScore = 10;
    
    // Basic info (3 points)
    if (employeeProfile.firstName && employeeProfile.lastName) score += 1;
    if (employeeProfile.phoneNumber && employeeProfile.email) score += 1;
    if (employeeProfile.address && employeeProfile.city && employeeProfile.province) score += 1;
    
    // Professional info (3 points)
    if (employeeProfile.bio) score += 1;
    if (employeeProfile.skills && employeeProfile.skills.length > 0) score += 1;
    if (employeeProfile.experience > 0) score += 1;
    
    // Preferences (2 points)
    if (employeeProfile.employmentType) score += 1;
    if (employeeProfile.salaryMin && employeeProfile.salaryMax) score += 1;
    
    // Documents (2 points)
    const docStatus = getDocumentStatus(employeeProfile.documents || []);
    if (docStatus.verified > 0) score += 1;
    if (docStatus.verified >= 3) score += 1; // At least 3 verified documents
    
    return Math.round((score / maxScore) * 100);
  };

  const completeness = getProfileCompleteness();
  const docStatus = getDocumentStatus(employeeProfile?.documents || []);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!employeeProfile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please complete your profile to get started.
        </Alert>
        <Button
          component={Link}
          href="/employee/profile"
          variant="contained"
          size="large"
        >
          Create Profile
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {employeeProfile.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your profile overview and recent activity.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Completeness */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile Completeness
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {completeness}% Complete
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {completeness < 100 ? 'Keep going!' : 'Excellent!'}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={completeness} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Button
                component={Link}
                href="/employee/profile"
                variant="outlined"
                startIcon={<Edit />}
                fullWidth
              >
                {completeness < 100 ? 'Complete Profile' : 'Update Profile'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Document Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Document Verification
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: docStatus.verified > 0 ? 'success.main' : 'warning.main', mr: 2 }}>
                  {docStatus.verified > 0 ? <CheckCircle /> : <Pending />}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {docStatus.verified} of {docStatus.total} Verified
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {docStatus.verified >= 3 ? 'All documents verified!' : 'Upload more documents'}
                  </Typography>
                </Box>
              </Box>
              <Button
                component={Link}
                href="/employee/documents"
                variant="outlined"
                startIcon={<Upload />}
                fullWidth
              >
                Manage Documents
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Visibility */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Profile Visibility
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {employeeProfile.isPublic ? 'Your profile is visible to employers' : 'Your profile is hidden'}
                  </Typography>
                </Box>
                <Chip
                  icon={employeeProfile.isPublic ? <Visibility /> : <VisibilityOff />}
                  label={employeeProfile.isPublic ? 'Public' : 'Hidden'}
                  color={employeeProfile.isPublic ? 'success' : 'default'}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Message color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Messages" 
                    secondary="0 unread messages"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Schedule color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Interviews" 
                    secondary="0 scheduled interviews"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Person color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Profile Views" 
                    secondary="0 views this month"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Profile updated"
                    secondary="2 hours ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Upload color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Document uploaded"
                    secondary="1 day ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Visibility color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Profile made public"
                    secondary="3 days ago"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
