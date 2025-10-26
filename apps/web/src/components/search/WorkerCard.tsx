'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  SearchResult,
  formatCurrency,
  formatDate,
  getEmploymentTypeText,
} from '@/lib/search/search-utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

type EmploymentType = 'LIVE_IN' | 'LIVE_OUT' | 'BOTH' | string;

interface WorkerCardProps {
  worker: SearchResult;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  // Defensive fallbacks
  const skills = Array.isArray(worker.skills) ? worker.skills : [];
  const photoSrc = worker.photo_url && worker.photo_url.trim().length > 0
    ? worker.photo_url
    : '/images/placeholder-avatar.png'; // ensure this exists in your public/ folder

  const employmentClass = useMemo(() => {
    const type = (worker.live_in_out ?? '').toString().toUpperCase() as EmploymentType;
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
  }, [worker.live_in_out]);

  const salaryMin =
    typeof worker.salary_min === 'number' ? worker.salary_min : undefined;
  const salaryMax =
    typeof worker.salary_max === 'number' ? worker.salary_max : undefined;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200" data-testid="worker-card">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <OptimizedImage
              src={photoSrc}
              alt={`${worker.first_name ?? 'Worker'} profile photo`}
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
              <h3
                className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
                data-testid="worker-name"
              >
                {worker.first_name ?? 'Unnamed'}
              </h3>
              {(worker.city || worker.province) && (
                <div
                  className="flex items-center text-sm text-gray-600 mt-1"
                  data-testid="worker-location"
                >
                  <MapPin className="w-4 h-4 mr-1" aria-hidden="true" />
                  {[worker.city, worker.province].filter(Boolean).join(', ')}
                </div>
              )}
            </div>

            {/* Employment Type and Experience */}
            <div className="flex items-center gap-2 mb-3">
              <Badge className={employmentClass} data-testid="employment-type">
                {getEmploymentTypeText(worker.live_in_out)}
              </Badge>
              {typeof worker.years_of_experience === 'number' && (
                <Badge variant="outline" className="text-xs" data-testid="experience">
                  {worker.years_of_experience} years exp
                </Badge>
              )}
            </div>

            {/* Headline */}
            {worker.headline && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2" data-testid="headline">
                {worker.headline}
              </p>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3" data-testid="worker-skills">
                {skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{skills.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Salary Range */}
            {(salaryMin !== undefined || salaryMax !== undefined) && (
              <div className="flex items-center text-sm text-gray-600 mb-2" data-testid="salary">
                <DollarSign className="w-4 h-4 mr-1" aria-hidden="true" />
                {salaryMin !== undefined ? formatCurrency(salaryMin) : '—'}{' '}
                {salaryMax !== undefined ? `- ${formatCurrency(salaryMax)}` : ''}/month
              </div>
            )}

            {/* Availability */}
            {worker.availability_date && (
              <div className="flex items-center text-sm text-gray-600 mb-3" data-testid="availability">
                <Calendar className="w-4 h-4 mr-1" aria-hidden="true" />
                Available from {formatDate(worker.availability_date)}
              </div>
            )}

            {/* Updated Date */}
            {worker.updated_at && (
              <div className="text-xs text-gray-500 mb-4" data-testid="updated-at">
                Updated {formatDate(worker.updated_at)}
              </div>
            )}

            {/* Action Button */}
            {worker.slug && (
              <Button asChild className="w-full" size="sm" data-testid="view-profile-button">
                <Link href={`/workers/${worker.slug}`} aria-label={`View ${worker.first_name ?? 'worker'} profile`}>
                  View Profile
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
