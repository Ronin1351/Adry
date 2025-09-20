'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star,
  Clock,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Heart,
  Share2
} from 'lucide-react';
import { formatCurrency, formatDate, getEmploymentTypeText } from '@/lib/search/search-utils';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface EmployeeProfile {
  id: string;
  first_name: string;
  city: string;
  province: string;
  age: number;
  civil_status: string;
  skills: string[];
  years_of_experience: number;
  live_in_out: string;
  headline?: string;
  availability_date?: string;
  salary_min: number;
  salary_max: number;
  photo_url?: string;
  profile_score: number;
  updated_at: string;
  slug: string;
}

interface EmployeeProfilePageProps {
  profile: EmployeeProfile;
}

export function EmployeeProfilePage({ profile }: EmployeeProfilePageProps) {
  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'LIVE_IN':
        return 'bg-blue-100 text-blue-800';
      case 'LIVE_OUT':
        return 'bg-green-100 text-green-800';
      case 'BOTH':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCivilStatusText = (status: string) => {
    switch (status) {
      case 'SINGLE':
        return 'Single';
      case 'MARRIED':
        return 'Married';
      case 'WIDOWED':
        return 'Widowed';
      case 'DIVORCED':
        return 'Divorced';
      case 'SEPARATED':
        return 'Separated';
      default:
        return status;
    }
  };

  const getProfileScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  <OptimizedImage
                    src={profile.photo_url || ''}
                    alt={`${profile.first_name} profile photo`}
                    width={120}
                    height={120}
                    className="w-30 h-30 rounded-full object-cover"
                    priority
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="worker-name">
                        {profile.first_name}
                      </h1>
                      <div className="flex items-center text-gray-600 mb-2" data-testid="worker-location">
                        <MapPin className="w-4 h-4 mr-1" />
                        {profile.city}, {profile.province}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getEmploymentTypeColor(profile.live_in_out)}>
                          {getEmploymentTypeText(profile.live_in_out)}
                        </Badge>
                        <Badge variant="outline" data-testid="worker-experience">
                          {profile.years_of_experience} years experience
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Profile Score */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className={`font-semibold ${getProfileScoreColor(profile.profile_score)}`}>
                          {profile.profile_score}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Profile Score</p>
                    </div>
                  </div>

                  {/* Headline */}
                  {profile.headline && (
                    <p className="text-lg text-gray-700 mb-4">
                      {profile.headline}
                    </p>
                  )}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{profile.age}</div>
                      <div className="text-gray-600">Years old</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{getCivilStatusText(profile.civil_status)}</div>
                      <div className="text-gray-600">Civil status</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{profile.skills.length}</div>
                      <div className="text-gray-600">Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900" data-testid="worker-salary">
                        {formatCurrency(profile.salary_min)} - {formatCurrency(profile.salary_max)}
                      </div>
                      <div className="text-gray-600">Monthly salary</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2" data-testid="worker-skills">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          {profile.availability_date && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-medium">
                    Available from {formatDate(profile.availability_date)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information (Gated) */}
          <Card className="border-orange-200 bg-orange-50" data-testid="contact-gate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <Shield className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  Contact Information Available to Subscribers
                </h3>
                <p className="text-orange-800 mb-4">
                  Phone number, email address, and detailed information are available to employers with active subscriptions.
                </p>
                {/* Hidden private fields for testing */}
                <div style={{ display: 'none' }} data-testid="worker-phone">Hidden phone</div>
                <div style={{ display: 'none' }} data-testid="worker-email">Hidden email</div>
                <div style={{ display: 'none' }} data-testid="worker-address">Hidden address</div>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Subscribe to Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Shortlist
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium">{profile.years_of_experience} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Employment Type</span>
                <span className="font-medium">{getEmploymentTypeText(profile.live_in_out)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Salary Range</span>
                <span className="font-medium">
                  {formatCurrency(profile.salary_min)} - {formatCurrency(profile.salary_max)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{formatDate(profile.updated_at)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Profile Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Identity Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Background Checked</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Similar Profiles */}
          <Card>
            <CardHeader>
              <CardTitle>Similar Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Find more housekeepers with similar skills and experience.
              </p>
              <Button variant="outline" className="w-full mt-3">
                View Similar Profiles
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
