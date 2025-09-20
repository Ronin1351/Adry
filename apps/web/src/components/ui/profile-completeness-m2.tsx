'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  Star,
  FileText,
  User,
  Briefcase,
  Settings,
  Phone,
  MapPin
} from 'lucide-react';

interface ProfileCompletenessProps {
  score: number;
  sections: {
    basic: { completed: boolean; score: number; maxScore: number };
    professional: { completed: boolean; score: number; maxScore: number };
    preferences: { completed: boolean; score: number; maxScore: number };
    documents: { completed: boolean; score: number; maxScore: number };
    references: { completed: boolean; score: number; maxScore: number };
    contact: { completed: boolean; score: number; maxScore: number };
  };
  onSectionClick?: (section: string) => void;
  showDetails?: boolean;
}

const SECTION_CONFIG = {
  basic: {
    title: 'Basic Information',
    icon: User,
    description: 'Name, age, location, civil status',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  professional: {
    title: 'Professional Details',
    icon: Briefcase,
    description: 'Skills, experience, headline',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  preferences: {
    title: 'Work Preferences',
    icon: Settings,
    description: 'Salary, employment type, availability',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  documents: {
    title: 'Document Verification',
    icon: FileText,
    description: 'ID documents and verification',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  references: {
    title: 'References',
    icon: Star,
    description: 'Professional references',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  contact: {
    title: 'Contact Information',
    icon: Phone,
    description: 'Phone and email verification',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
};

export function ProfileCompleteness({
  score,
  sections,
  onSectionClick,
  showDetails = true,
}: ProfileCompletenessProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Work';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCompletionIcon = (completed: boolean, score: number) => {
    if (completed) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score > 0) return <Circle className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-gray-400" />;
  };

  const getCompletionText = (completed: boolean, score: number) => {
    if (completed) return 'Complete';
    if (score > 0) return 'In Progress';
    return 'Not Started';
  };

  const getCompletionColor = (completed: boolean, score: number) => {
    if (completed) return 'text-green-600';
    if (score > 0) return 'text-yellow-600';
    return 'text-gray-500';
  };

  const totalPossibleScore = Object.values(sections).reduce(
    (sum, section) => sum + section.maxScore,
    0
  );

  const totalCurrentScore = Object.values(sections).reduce(
    (sum, section) => sum + section.score,
    0
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Profile Completeness
          </CardTitle>
          <Badge 
            variant={score >= 90 ? 'default' : 'secondary'}
            className={getScoreColor(score)}
          >
            {score}%
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {getScoreLabel(score)} profile
            </span>
            <span className="text-sm text-gray-500">
              {totalCurrentScore}/{totalPossibleScore} points
            </span>
          </div>
          <Progress 
            value={score} 
            className="h-2"
            style={{
              background: `linear-gradient(to right, ${getProgressColor(score)} ${score}%, #e5e7eb ${score}%)`
            }}
          />
        </div>
      </CardHeader>

      {showDetails && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(sections).map(([key, section]) => {
              const config = SECTION_CONFIG[key as keyof typeof SECTION_CONFIG];
              const Icon = config.icon;
              const sectionScore = Math.round((section.score / section.maxScore) * 100);
              const isCompleted = section.completed;
              const isInProgress = section.score > 0 && !isCompleted;

              return (
                <div
                  key={key}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                    ${isCompleted 
                      ? `${config.bgColor} ${config.borderColor} border-2` 
                      : isInProgress 
                        ? 'bg-yellow-50 border-yellow-200 border-2' 
                        : 'bg-gray-50 border-gray-200'
                    }
                    hover:shadow-md
                  `}
                  onClick={() => onSectionClick?.(key)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {config.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {config.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress 
                            value={sectionScore} 
                            className="h-1 flex-1"
                          />
                          <span className="text-xs text-gray-500">
                            {sectionScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getCompletionIcon(isCompleted, section.score)}
                      <span className={`text-xs ${getCompletionColor(isCompleted, section.score)}`}>
                        {getCompletionText(isCompleted, section.score)}
                      </span>
                    </div>
                  </div>
                  
                  {!isCompleted && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        {section.maxScore - section.score} points remaining
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {score < 100 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Complete your profile</h4>
                  <p className="text-sm text-blue-800 mt-1">
                    A complete profile increases your chances of being hired by 3x. 
                    Focus on the sections marked as "In Progress" or "Not Started" above.
                  </p>
                  <div className="mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-blue-600 border-blue-300 hover:bg-blue-100"
                    >
                      Complete Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {score === 100 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Profile Complete!</h4>
                  <p className="text-sm text-green-800 mt-1">
                    Congratulations! Your profile is 100% complete and ready to be discovered by employers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
