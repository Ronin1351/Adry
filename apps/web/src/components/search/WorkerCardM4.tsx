'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SearchResult } from '@/lib/search/meilisearch-m4';
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

interface WorkerCardProps {
  worker: SearchResult;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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

  const getEmploymentTypeText = (type: string) => {
    switch (type) {
      case 'LIVE_IN':
        return 'Live-in';
      case 'LIVE_OUT':
        return 'Live-out';
      case 'BOTH':
        return 'Live-in & Live-out';
      default:
        return type;
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

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            {worker.photoUrl ? (
              <Image
                src={worker.photoUrl}
                alt={`${worker.firstName} profile photo`}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
                priority={false}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            {/* Name and Location */}
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {worker.firstName}
              </h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {worker.city}, {worker.province}
              </div>
            </div>

            {/* Employment Type and Experience */}
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getEmploymentTypeColor(worker.employmentType)}>
                {getEmploymentTypeText(worker.employmentType)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {worker.experience} years exp
              </Badge>
            </div>

            {/* Headline */}
            {worker.headline && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {worker.headline}
              </p>
            )}

            {/* Skills */}
            <div className="flex flex-wrap gap-1 mb-3">
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
              {formatCurrency(worker.salaryMin)} - {formatCurrency(worker.salaryMax)}/month
            </div>

            {/* Availability */}
            {worker.availabilityDate && (
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <Calendar className="w-4 h-4 mr-1" />
                Available from {formatDate(worker.availabilityDate)}
              </div>
            )}

            {/* Profile Score */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                Profile Score: {worker.profileScore}%
              </div>
              <div className="text-xs text-gray-500">
                Updated {formatDate(worker.updatedAt)}
              </div>
            </div>

            {/* Action Button */}
            <Link href={`/workers/${worker.slug}`}>
              <Button className="w-full" size="sm">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
