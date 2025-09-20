'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Rating,
} from '@mui/material';
import {
  LocationOn,
  Work,
  AttachMoney,
  Schedule,
  CheckCircle,
  Star,
  Message,
  CalendarToday,
  Person,
  Phone,
  Email,
  Language,
  Verified,
  Share,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { EmployeeProfile } from '../../types/adry';

interface AdryPublicProfileProps {
  profile: EmployeeProfile;
}

export function AdryPublicProfile({ profile }: AdryPublicProfileProps) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [contactDialog, setContactDialog] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);

  const formatSalary = (amount: number) => {
    return `₱${amount.toLocaleString()}`;
  };

  const getEmploymentTypeLabel = (type: string) => {
    switch (type) {
      case 'LIVE_IN': return 'Live-in';
      case 'LIVE_OUT': return 'Live-out';
      case 'BOTH': return 'Both Live-in & Live-out';
      default: return type;
    }
  };

  const getCivilStatusLabel = (status: string) => {
    switch (status) {
      case 'SINGLE': return 'Single';
      case 'MARRIED': return 'Married';
      case 'WIDOWED': return 'Widowed';
      case 'DIVORCED': return 'Divorced';
      case 'SEPARATED': return 'Separated';
      default: return status;
    }
  };

  const getDocumentStatus = () => {
    const verified = profile.documents?.filter(doc => doc.status === 'VERIFIED').length || 0;
    const total = profile.documents?.length || 0;
    return { verified, total };
  };

  const docStatus = getDocumentStatus();

  const handleContact = () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    
    if (user?.role !== 'EMPLOYER') {
      // Show message that only employers can contact
      return;
    }
    
    setContactDialog(true);
  };

  const handleShortlist = () => {
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    
    setIsShortlisted(!isShortlisted);
    // API call to add/remove from shortlist
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={profile.profilePhotoUrl}
                  sx={{ width: 120, height: 120, mb: 2 }}
                >
                  {profile.firstName[0]}{profile.lastName[0]}
                </Avatar>
                <Typography variant="h4" gutterBottom>
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  {profile.isVerified && (
                    <Chip
                      icon={<Verified />}
                      label="Verified"
                      color="success"
                      size="small"
                    />
                  )}
                  <Chip
                    label={getEmploymentTypeLabel(profile.employmentType)}
                    color="primary"
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Message />}
                    onClick={handleContact}
                    disabled={!isAuthenticated || user?.role !== 'EMPLOYER'}
                  >
                    Contact
                  </Button>
                  <IconButton
                    onClick={handleShortlist}
                    color={isShortlisted ? 'error' : 'default'}
                  >
                    {isShortlisted ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <IconButton>
                    <Share />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOn color="action" />
                    <Typography variant="body1">
                      {profile.location}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Work color="action" />
                    <Typography variant="body1">
                      {profile.experience} years experience
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AttachMoney color="action" />
                    <Typography variant="body1">
                      {formatSalary(profile.salaryMin)} - {formatSalary(profile.salaryMax)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Schedule color="action" />
                    <Typography variant="body1">
                      Available: {new Date(profile.availabilityDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              {profile.bio && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    About
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {profile.bio}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Skills */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skills & Specialties
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profile.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Languages */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Languages
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profile.languages.map((language) => (
                  <Chip
                    key={language}
                    label={language}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Work Experience */}
        {profile.workHistory && profile.workHistory.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Work Experience
                </Typography>
                <List>
                  {profile.workHistory.map((job, index) => (
                    <Box key={job.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Work color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={job.position}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.primary">
                                {job.employerName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {new Date(job.startDate).toLocaleDateString()} - {job.endDate ? new Date(job.endDate).toLocaleDateString() : 'Present'}
                              </Typography>
                              {job.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  {job.description}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < profile.workHistory.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* References */}
        {profile.references && profile.references.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  References
                </Typography>
                <List>
                  {profile.references.map((ref) => (
                    <ListItem key={ref.id}>
                      <ListItemIcon>
                        <Person color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={ref.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.primary">
                              {ref.relationship} - {ref.company}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {ref.phoneNumber}
                              {ref.email && ` • ${ref.email}`}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Document Verification */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Document Verification
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: docStatus.verified > 0 ? 'success.main' : 'warning.main' }}>
                  {docStatus.verified > 0 ? <CheckCircle /> : <Work />}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {docStatus.verified} of {docStatus.total} Documents Verified
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {docStatus.verified >= 3 ? 'All required documents verified!' : 'More documents needed for verification'}
                  </Typography>
                </Box>
              </Box>
              <List dense>
                {profile.documents?.map((doc) => (
                  <ListItem key={doc.id}>
                    <ListItemIcon>
                      <CheckCircle 
                        color={doc.status === 'VERIFIED' ? 'success' : 'disabled'} 
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={doc.type.replace('_', ' ')}
                      secondary={`Status: ${doc.status}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Contact Dialog */}
      <Dialog open={contactDialog} onClose={() => setContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Contact {profile.firstName} {profile.lastName}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            You need an active subscription to message housekeepers and schedule interviews.
          </Alert>
          <Typography variant="body1" gutterBottom>
            Subscribe to Adry for ₱600 every 3 months to unlock:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Message color="primary" />
              </ListItemIcon>
              <ListItemText primary="Unlimited messaging with housekeepers" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CalendarToday color="primary" />
              </ListItemIcon>
              <ListItemText primary="Schedule interviews" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Person color="primary" />
              </ListItemIcon>
              <ListItemText primary="View full contact details" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              // Redirect to subscription page
              window.location.href = '/subscription';
            }}
          >
            Subscribe Now
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
