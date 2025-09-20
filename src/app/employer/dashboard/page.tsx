'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { getEmployerProfile } from '../../../store/slices/profileSlice';
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
  LinearProgress,
} from '@mui/material';
import {
  Business,
  Search,
  Favorite,
  Message,
  Schedule,
  Payment,
  CheckCircle,
  Warning,
  Person,
  TrendingUp,
  Star,
} from '@mui/icons-material';
import Link from 'next/link';

export default function EmployerDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { employerProfile, isLoading } = useSelector((state: RootState) => state.profile);
  const [subscriptionDialog, setSubscriptionDialog] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(getEmployerProfile(user.id));
    }
  }, [dispatch, user?.id]);

  const hasActiveSubscription = employerProfile?.subscription?.status === 'ACTIVE';
  const subscription = employerProfile?.subscription;

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!employerProfile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please complete your profile to get started.
        </Alert>
        <Button
          component={Link}
          href="/employer/profile"
          variant="contained"
          size="large"
        >
          Create Profile
        </Button>
      </Container>
    );
  }

  const getSubscriptionStatus = () => {
    if (!subscription) return { status: 'No Subscription', color: 'error' as const };
    
    switch (subscription.status) {
      case 'ACTIVE':
        return { status: 'Active', color: 'success' as const };
      case 'EXPIRED':
        return { status: 'Expired', color: 'error' as const };
      case 'PAST_DUE':
        return { status: 'Past Due', color: 'warning' as const };
      case 'CANCELLED':
        return { status: 'Cancelled', color: 'default' as const };
      default:
        return { status: 'Unknown', color: 'default' as const };
    }
  };

  const subscriptionStatus = getSubscriptionStatus();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {employerProfile.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your housekeeper search and subscriptions.
        </Typography>
      </Box>

      {/* Subscription Alert */}
      {!hasActiveSubscription && (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setSubscriptionDialog(true)}
            >
              Subscribe Now
            </Button>
          }
        >
          You need an active subscription to message housekeepers and schedule interviews.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Subscription Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Subscription Status
                </Typography>
                <Chip
                  label={subscriptionStatus.status}
                  color={subscriptionStatus.color}
                  icon={hasActiveSubscription ? <CheckCircle /> : <Warning />}
                />
              </Box>
              
              {subscription ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current Plan: ₱600 every 3 months
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} // Calculate based on time remaining
                      sx={{ height: 6, borderRadius: 3, mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      25 days remaining
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No active subscription. Subscribe to start messaging housekeepers.
                </Typography>
              )}
              
              <Button
                variant="contained"
                fullWidth
                onClick={() => setSubscriptionDialog(true)}
                sx={{ mt: 2 }}
              >
                {hasActiveSubscription ? 'Manage Subscription' : 'Subscribe Now'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Search color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Search Housekeepers" 
                    secondary="Find your perfect match"
                  />
                  <Button
                    component={Link}
                    href="/search"
                    size="small"
                    disabled={!hasActiveSubscription}
                  >
                    Search
                  </Button>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Favorite color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Shortlist" 
                    secondary="0 saved candidates"
                  />
                  <Button
                    component={Link}
                    href="/employer/shortlist"
                    size="small"
                  >
                    View
                  </Button>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Message color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Messages" 
                    secondary="0 unread messages"
                  />
                  <Button
                    component={Link}
                    href="/employer/messages"
                    size="small"
                    disabled={!hasActiveSubscription}
                  >
                    View
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Search Filters */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Saved Search Filters
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Search color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Live-in Housekeepers in Metro Manila"
                    secondary="Created 2 days ago"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Search color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Cooking & Childcare in Quezon City"
                    secondary="Created 1 week ago"
                  />
                </ListItem>
              </List>
              <Button
                component={Link}
                href="/employer/search-filters"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              >
                Manage Filters
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Added to shortlist"
                    secondary="Maria Santos - 2 hours ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Message color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="New message received"
                    secondary="Ana Cruz - 1 day ago"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Schedule color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Interview scheduled"
                    secondary="Tomorrow at 2:00 PM"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Search Activity
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      12
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Profiles Viewed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="secondary">
                      5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Shortlisted
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success">
                      3
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Messages Sent
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info">
                      2
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Interviews Scheduled
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Subscription Dialog */}
      <Dialog open={subscriptionDialog} onClose={() => setSubscriptionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {hasActiveSubscription ? 'Manage Subscription' : 'Subscribe to Adry'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {hasActiveSubscription 
              ? 'Manage your subscription settings and billing information.'
              : 'Subscribe to unlock messaging and interview scheduling with housekeepers.'
            }
          </Typography>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              ₱600 every 3 months
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Message unlimited housekeepers
              • Schedule interviews
              • View full contact details
              • Access to verified profiles
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubscriptionDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              // Handle subscription logic
              setSubscriptionDialog(false);
            }}
          >
            {hasActiveSubscription ? 'Manage' : 'Subscribe Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
