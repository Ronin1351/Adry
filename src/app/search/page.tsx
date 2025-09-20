'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Pagination,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Work,
  AttachMoney,
  Schedule,
  CheckCircle,
  Star,
  FilterList,
} from '@mui/icons-material';
import { PHILIPPINES_PROVINCES, HOUSEKEEPING_SKILLS, LANGUAGES } from '../../types/adry';

export default function SearchPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    employmentType: '',
    skills: [] as string[],
    salaryRange: [5000, 25000],
    experience: '',
    languages: [] as string[],
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for demonstration
  const mockResults = [
    {
      id: '1',
      firstName: 'Maria',
      lastName: 'Santos',
      age: 28,
      location: 'Quezon City, Metro Manila',
      skills: ['Cooking', 'Childcare', 'Laundry'],
      experience: 5,
      salaryMin: 8000,
      salaryMax: 12000,
      employmentType: 'LIVE_IN',
      isVerified: true,
      profilePhotoUrl: null,
      languages: ['Tagalog', 'English'],
      availabilityDate: '2024-02-01',
    },
    {
      id: '2',
      firstName: 'Ana',
      lastName: 'Cruz',
      age: 32,
      location: 'Makati City, Metro Manila',
      skills: ['General Housekeeping', 'Cooking', 'Elderly Care'],
      experience: 8,
      salaryMin: 10000,
      salaryMax: 15000,
      employmentType: 'BOTH',
      isVerified: true,
      profilePhotoUrl: null,
      languages: ['Tagalog', 'English', 'Cebuano'],
      availabilityDate: '2024-01-15',
    },
    {
      id: '3',
      firstName: 'Rosa',
      lastName: 'Garcia',
      age: 25,
      location: 'Taguig City, Metro Manila',
      skills: ['Cooking', 'Laundry', 'Ironing'],
      experience: 3,
      salaryMin: 6000,
      salaryMax: 10000,
      employmentType: 'LIVE_OUT',
      isVerified: false,
      profilePhotoUrl: null,
      languages: ['Tagalog'],
      availabilityDate: '2024-01-20',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, [filters, searchTerm, page]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
    // Trigger search
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      employmentType: '',
      skills: [],
      salaryRange: [5000, 25000],
      experience: '',
      languages: [],
    });
    setSearchTerm('');
  };

  const formatSalary = (amount: number) => {
    return `₱${amount.toLocaleString()}`;
  };

  const getEmploymentTypeLabel = (type: string) => {
    switch (type) {
      case 'LIVE_IN': return 'Live-in';
      case 'LIVE_OUT': return 'Live-out';
      case 'BOTH': return 'Both';
      default: return type;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Find Your Perfect Housekeeper
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Browse verified housekeeper profiles. Search and filter to find the right match for your household.
        </Typography>

        {/* Search Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by name, skills, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ minWidth: 120 }}
          >
            Search
          </Button>
        </Box>

        {/* Filter Toggle */}
        <Button
          variant="outlined"
          startIcon={<FilterList />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ mb: 2 }}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        {showFilters && (
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Filters
                </Typography>

                {/* Location */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    label="Location"
                  >
                    <MenuItem value="">All Locations</MenuItem>
                    {PHILIPPINES_PROVINCES.map((province) => (
                      <MenuItem key={province} value={province}>
                        {province}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Employment Type */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    value={filters.employmentType}
                    onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                    label="Employment Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="LIVE_IN">Live-in</MenuItem>
                    <MenuItem value="LIVE_OUT">Live-out</MenuItem>
                    <MenuItem value="BOTH">Both</MenuItem>
                  </Select>
                </FormControl>

                {/* Skills */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Skills
                  </Typography>
                  <FormGroup>
                    {HOUSEKEEPING_SKILLS.slice(0, 10).map((skill) => (
                      <FormControlLabel
                        key={skill}
                        control={
                          <Checkbox
                            checked={filters.skills.includes(skill)}
                            onChange={(e) => {
                              const newSkills = e.target.checked
                                ? [...filters.skills, skill]
                                : filters.skills.filter(s => s !== skill);
                              handleFilterChange('skills', newSkills);
                            }}
                          />
                        }
                        label={skill}
                      />
                    ))}
                  </FormGroup>
                </Box>

                {/* Salary Range */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Salary Range: {formatSalary(filters.salaryRange[0])} - {formatSalary(filters.salaryRange[1])}
                  </Typography>
                  <Slider
                    value={filters.salaryRange}
                    onChange={(_, newValue) => handleFilterChange('salaryRange', newValue)}
                    valueLabelDisplay="auto"
                    min={3000}
                    max={30000}
                    step={1000}
                    valueLabelFormat={(value) => formatSalary(value)}
                  />
                </Box>

                {/* Experience */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Experience</InputLabel>
                  <Select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    label="Experience"
                  >
                    <MenuItem value="">Any Experience</MenuItem>
                    <MenuItem value="0-1">0-1 years</MenuItem>
                    <MenuItem value="2-3">2-3 years</MenuItem>
                    <MenuItem value="4-5">4-5 years</MenuItem>
                    <MenuItem value="6+">6+ years</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  fullWidth
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Results */}
        <Grid item xs={12} md={showFilters ? 9 : 12}>
          {/* Results Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              {loading ? 'Searching...' : `${results.length} housekeepers found`}
            </Typography>
            {!isAuthenticated && (
              <Alert severity="info" sx={{ maxWidth: 400 }}>
                <Typography variant="body2">
                  Sign up to contact housekeepers and schedule interviews.
                </Typography>
              </Alert>
            )}
          </Box>

          {/* Results List */}
          {loading ? (
            <Grid container spacing={2}>
              {[1, 2, 3].map((i) => (
                <Grid item xs={12} key={i}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Skeleton variant="circular" width={60} height={60} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Skeleton variant="text" width="60%" />
                          <Skeleton variant="text" width="40%" />
                          <Skeleton variant="text" width="80%" />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {results.map((profile) => (
                <Grid item xs={12} key={profile.id}>
                  <Card sx={{ '&:hover': { boxShadow: 3 } }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Avatar
                          src={profile.profilePhotoUrl}
                          sx={{ width: 80, height: 80 }}
                        >
                          {profile.firstName[0]}{profile.lastName[0]}
                        </Avatar>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6">
                              {profile.firstName} {profile.lastName}
                            </Typography>
                            {profile.isVerified && (
                              <CheckCircle color="success" fontSize="small" />
                            )}
                            <Chip
                              label={getEmploymentTypeLabel(profile.employmentType)}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {profile.location}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              • {profile.age} years old
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Work fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {profile.experience} years experience
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <AttachMoney fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {formatSalary(profile.salaryMin)} - {formatSalary(profile.salaryMax)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {profile.skills.slice(0, 3).map((skill) => (
                              <Chip
                                key={skill}
                                label={skill}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                            {profile.skills.length > 3 && (
                              <Chip
                                label={`+${profile.skills.length - 3} more`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              Available: {new Date(profile.availabilityDate).toLocaleDateString()}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="outlined"
                                size="small"
                                disabled={!isAuthenticated}
                              >
                                View Profile
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                disabled={!isAuthenticated}
                              >
                                Contact
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination */}
          {results.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={10}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                color="primary"
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
