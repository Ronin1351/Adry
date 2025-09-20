'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Calendar, 
  Eye, 
  EyeOff, 
  Home, 
  Building,
  Info
} from 'lucide-react';

interface ToggleControlsProps {
  overtime: boolean;
  holidayWork: boolean;
  visibility: boolean;
  employmentType: 'LIVE_IN' | 'LIVE_OUT' | 'BOTH';
  onOvertimeChange: (checked: boolean) => void;
  onHolidayWorkChange: (checked: boolean) => void;
  onVisibilityChange: (checked: boolean) => void;
  onEmploymentTypeChange: (type: 'LIVE_IN' | 'LIVE_OUT' | 'BOTH') => void;
  disabled?: boolean;
  className?: string;
}

export function ToggleControls({
  overtime,
  holidayWork,
  visibility,
  employmentType,
  onOvertimeChange,
  onHolidayWorkChange,
  onVisibilityChange,
  onEmploymentTypeChange,
  disabled = false,
  className = '',
}: ToggleControlsProps) {
  const employmentTypeOptions = [
    {
      value: 'LIVE_IN' as const,
      label: 'Live-in',
      description: 'Live with the employer',
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      value: 'LIVE_OUT' as const,
      label: 'Live-out',
      description: 'Work during the day only',
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      value: 'BOTH' as const,
      label: 'Both',
      description: 'Open to either arrangement',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Employment Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Employment Type
          </CardTitle>
          <p className="text-sm text-gray-600">
            Choose your preferred work arrangement
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {employmentTypeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = employmentType === option.value;
              
              return (
                <div
                  key={option.value}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? `${option.bgColor} ${option.borderColor} border-2` 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => !disabled && onEmploymentTypeChange(option.value)}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? option.color : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <h3 className={`font-medium ${isSelected ? option.color : 'text-gray-900'}`}>
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Badge variant="default" className="text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Work Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Work Preferences
          </CardTitle>
          <p className="text-sm text-gray-600">
            Let employers know your availability preferences
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overtime Work Toggle */}
          <div className="flex items-start space-x-3 p-4 rounded-lg border bg-gray-50">
            <Checkbox
              id="overtime"
              checked={overtime}
              onCheckedChange={(checked) => onOvertimeChange(checked as boolean)}
              disabled={disabled}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="overtime" className="text-base font-medium cursor-pointer">
                Available for Overtime Work
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Work beyond regular hours when needed (additional compensation applies)
              </p>
              {overtime && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Overtime Available
                </Badge>
              )}
            </div>
          </div>

          {/* Holiday Work Toggle */}
          <div className="flex items-start space-x-3 p-4 rounded-lg border bg-gray-50">
            <Checkbox
              id="holidayWork"
              checked={holidayWork}
              onCheckedChange={(checked) => onHolidayWorkChange(checked as boolean)}
              disabled={disabled}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="holidayWork" className="text-base font-medium cursor-pointer">
                Available for Holiday Work
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Work on holidays and special occasions (holiday rates apply)
              </p>
              {holidayWork && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Holiday Work Available
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {visibility ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            Profile Visibility
          </CardTitle>
          <p className="text-sm text-gray-600">
            Control who can see your profile
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-3 p-4 rounded-lg border bg-gray-50">
            <Checkbox
              id="visibility"
              checked={visibility}
              onCheckedChange={(checked) => onVisibilityChange(checked as boolean)}
              disabled={disabled}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="visibility" className="text-base font-medium cursor-pointer">
                Make Profile Visible to Employers
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                When enabled, employers can find and view your profile in search results
              </p>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Visibility Status:</p>
                    <p>
                      {visibility 
                        ? 'Your profile is visible to employers and will appear in search results.'
                        : 'Your profile is hidden from employers and will not appear in search results.'
                      }
                    </p>
                  </div>
                </div>
              </div>
              {visibility && (
                <Badge variant="default" className="mt-2 text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  Profile Visible
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-900 mb-2">Your Preferences Summary</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>Employment Type:</strong> {employmentTypeOptions.find(opt => opt.value === employmentType)?.label}</p>
            <p>• <strong>Overtime Work:</strong> {overtime ? 'Available' : 'Not available'}</p>
            <p>• <strong>Holiday Work:</strong> {holidayWork ? 'Available' : 'Not available'}</p>
            <p>• <strong>Profile Visibility:</strong> {visibility ? 'Visible to employers' : 'Hidden from employers'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
