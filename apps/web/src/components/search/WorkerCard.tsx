'use client';

import Link from 'next/link';
import { SearchResult, formatCurrency, formatDate, getEmploymentTypeText } from '@/lib/search/search-utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Star,
  Clock,
  User
} from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface WorkerCardProps {
  worker: SearchResult;
}

export function WorkerCard({ worker }: WorkerCardProps) {
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

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200" data-testid="worker-card">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <OptimizedImage
              src={worker.photo_url || ''}
              alt={`${worker.first_name} profile photo`}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover"
              priority={false}
              data-testid="worker-photo"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            {/* Name and Location */}
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors" data-testid="worker-name">
                {worker.first_name}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mt-1" data-testid="worker-location">
                <MapPin className="w-4 h-4 mr-1" />
                {worker.city}, {worker.province}
              </div>
            </div>

            {/* Employment Type and Experience */}
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getEmploymentTypeColor(worker.live_in_out)}>
                {getEmploymentTypeText(worker.live_in_out)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {worker.years_of_experience} years exp
              </Badge>
            </div>

            {/* Headline */}
            {worker.headline && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {worker.headline}
              </p>
            )}

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-3" data-testid="worker-skills">
              {worker.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {worker.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{worker.skills.length - 3} more
                </Badge>
              )}
            </div>

            {/* Salary Range */}
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <DollarSign className="w-4 h-4 mr-1" />
              {formatCurrency(worker.salary_min)} - {formatCurrency(worker.salary_max)}/month
            </div>

            {/* Availability */}
            {worker.availability_date && (
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Calendar className="w-4 h-4 mr-1" />
                Available from {formatDate(worker.availability_date)}
              </div>
            )}

            {/* Updated Date */}
            <div className="text-xs text-gray-500 mb-4">
              Updated {formatDate(worker.updated_at)}
            </div>

            {/* Action Button */}
            <Link href={`/workers/${worker.slug}`}>
              <Button className="w-full" size="sm" data-testid="view-profile-button">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
