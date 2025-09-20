'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Save,
  Send,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Building,
  Users,
  Settings,
  CreditCard,
  Phone
} from 'lucide-react';
import { 
  employerProfileSchema,
  type EmployerProfile,
  HOUSEHOLD_SIZE_OPTIONS,
  PREFERRED_ARRANGEMENT_OPTIONS,
  PRIMARY_LANGUAGE_OPTIONS,
  ADDITIONAL_LANGUAGE_OPTIONS,
  REQUIREMENTS_OPTIONS,
  DAYS_OF_WEEK,
  CONTRIBUTION_POLICY_OPTIONS,
  ROOM_TYPE_OPTIONS,
  MEALS_PROVIDED_OPTIONS,
  ROOM_AMENITIES_OPTIONS
} from '@/lib/validations/employer-profile-m3';
import { SalarySlider } from '@/components/ui/salary-slider-m2';

interface EmployerProfileFormM3Props {
  initialData?: Partial<EmployerProfile>;
  onSubmit: (data: EmployerProfile) => Promise<void>;
  onSaveDraft: (data: Partial<EmployerProfile>) => Promise<void>;
  isLoading?: boolean;
}

export function EmployerProfileFormM3({ 
  initialData, 
  onSubmit, 
  onSaveDraft, 
  isLoading = false 
}: EmployerProfileFormM3Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileScore, setProfileScore] = useState(0);

  const form = useForm<EmployerProfile>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: {
      companyName: '',
      contactPerson: '',
      city: '',
      province: '',
      contactEmail: '',
      contactPhone: '',
      aboutText: '',
      householdSize: 'MEDIUM',
      preferredArrangement: 'LIVE_OUT',
      budgetMin: 8000,
      budgetMax: 15000,
      requirements: {
        cooking: false,
        childcare: false,
        elderlyCare: false,
        driving: false,
        petCare: false,
        housekeeping: false,
        laundry: false,
        gardening: false,
      },
      languageRequirements: {
        primary: 'TAGALOG',
        additional: [],
      },
      workSchedule: {
        daysOff: ['Sunday'],
        flexibleHours: false,
      },
      benefitsPolicies: {
        sssContribution: 'NO',
        philhealthContribution: 'NO',
        pagibigContribution: 'NO',
        thirteenthMonthPay: false,
        overtimePay: false,
        holidayPay: false,
      },
      accommodationDetails: {
        roomType: 'PRIVATE_ROOM',
        roomAmenities: [],
        mealsProvided: 'ALL_MEALS',
      },
      ...initialData,
    },
  });

  const watchedValues = form.watch();

  // Calculate profile completeness score
  useEffect(() => {
    let score = 0;
    const maxScore = 100;

    // Basic info (25%)
    if (watchedValues.companyName && watchedValues.contactPerson) score += 15;
    if (watchedValues.city && watchedValues.province) score += 10;

    // Job preferences (25%)
    if (watchedValues.preferredArrangement) score += 10;
    if (watchedValues.budgetMin && watchedValues.budgetMax) score += 15;

    // Requirements (20%)
    const requirements = watchedValues.requirements || {};
    const requirementCount = Object.values(requirements).filter(Boolean).length;
    score += Math.min(requirementCount * 2.5, 20);

    // Work schedule (15%)
    if (watchedValues.workSchedule?.daysOff?.length) score += 15;

    // Benefits (10%)
    const benefits = watchedValues.benefitsPolicies || {};
    const benefitCount = Object.values(benefits).filter(Boolean).length;
    score += Math.min(benefitCount * 2, 10);

    // Contact info (5%)
    if (watchedValues.contactEmail && watchedValues.contactPhone) score += 5;

    setProfileScore(Math.min(score, maxScore));
  }, [watchedValues]);

  const handleBudgetChange = (value: number[], field: 'budgetMin' | 'budgetMax') => {
    form.setValue(field, value[0]);
  };

  const handleRequirementToggle = (requirement: string) => {
    const currentRequirements = form.getValues('requirements') || {};
    const newRequirements = {
      ...currentRequirements,
      [requirement]: !currentRequirements[requirement as keyof typeof currentRequirements],
    };
    form.setValue('requirements', newRequirements);
  };

  const handleDayOffToggle = (day: string) => {
    const currentDays = form.getValues('workSchedule.daysOff') || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    form.setValue('workSchedule.daysOff', newDays);
  };

  const handleLanguageToggle = (language: string) => {
    const currentLanguages = form.getValues('languageRequirements.additional') || [];
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language];
    form.setValue('languageRequirements.additional', newLanguages);
  };

  const handleAmenityToggle = (amenity: string) => {
    const currentAmenities = form.getValues('accommodationDetails.roomAmenities') || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    form.setValue('accommodationDetails.roomAmenities', newAmenities);
  };

  const handleSubmit = async (data: EmployerProfile) => {
    await onSubmit(data);
  };

  const handleSaveDraft = async () => {
    const data = form.getValues();
    await onSaveDraft(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Completeness */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Profile Completeness</h3>
            <Badge variant={profileScore >= 80 ? 'default' : 'secondary'}>
              {profileScore}%
            </Badge>
          </div>
          <Progress value={profileScore} className="mt-2" />
          <p className="text-sm text-gray-600 mt-2">
            Complete your profile to attract the best candidates
          </p>
        </CardContent>
      </Card>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={`step-${currentStep}`} onValueChange={(value) => setCurrentStep(parseInt(value.split('-')[1]))}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="step-1">Basic Info</TabsTrigger>
            <TabsTrigger value="step-2">Job Details</TabsTrigger>
            <TabsTrigger value="step-3">Work Schedule</TabsTrigger>
            <TabsTrigger value="step-4">Benefits</TabsTrigger>
            <TabsTrigger value="step-5">Contact</TabsTrigger>
          </TabsList>

          {/* Step 1: Basic Information */}
          <TabsContent value="step-1" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company/Household Name *</Label>
                    <Input
                      id="companyName"
                      {...form.register('companyName')}
                      placeholder="Enter company or household name"
                    />
                    {form.formState.errors.companyName && (
                      <p className="text-sm text-red-600">{form.formState.errors.companyName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      {...form.register('contactPerson')}
                      placeholder="Full name of contact person"
                    />
                    {form.formState.errors.contactPerson && (
                      <p className="text-sm text-red-600">{form.formState.errors.contactPerson.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...form.register('city')}
                      placeholder="Enter your city"
                    />
                    {form.formState.errors.city && (
                      <p className="text-sm text-red-600">{form.formState.errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="province">Province *</Label>
                    <Input
                      id="province"
                      {...form.register('province')}
                      placeholder="Enter your province"
                    />
                    {form.formState.errors.province && (
                      <p className="text-sm text-red-600">{form.formState.errors.province.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="aboutText">About Your Household/Workplace</Label>
                  <Textarea
                    id="aboutText"
                    {...form.register('aboutText')}
                    placeholder="Describe your household or workplace, what makes it a great place to work..."
                    rows={4}
                  />
                  <p className="text-sm text-gray-500">
                    {watchedValues.aboutText?.length || 0}/500 characters
                  </p>
                  {form.formState.errors.aboutText && (
                    <p className="text-sm text-red-600">{form.formState.errors.aboutText.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="householdSize">Household/Workplace Size</Label>
                  <Select onValueChange={(value) => form.setValue('householdSize', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select household size" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOUSEHOLD_SIZE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.householdSize && (
                    <p className="text-sm text-red-600">{form.formState.errors.householdSize.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Job Details */}
          <TabsContent value="step-2" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Job Details & Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Preferred Arrangement</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {PREFERRED_ARRANGEMENT_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={watchedValues.preferredArrangement === option.value}
                          onCheckedChange={(checked) => 
                            checked && form.setValue('preferredArrangement', option.value as any)
                          }
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Budget Range (Monthly)</Label>
                  <SalarySlider
                    minValue={watchedValues.budgetMin || 0}
                    maxValue={watchedValues.budgetMax || 0}
                    onMinChange={(value) => handleBudgetChange([value], 'budgetMin')}
                    onMaxChange={(value) => handleBudgetChange([value], 'budgetMax')}
                    min={3000}
                    max={50000}
                    step={500}
                  />
                </div>

                <div>
                  <Label>Requirements (Select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {REQUIREMENTS_OPTIONS.map((option) => (
                      <div key={option.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.key}
                          checked={watchedValues.requirements?.[option.key as keyof typeof watchedValues.requirements] || false}
                          onCheckedChange={() => handleRequirementToggle(option.key)}
                        />
                        <Label htmlFor={option.key} className="text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Language Requirements</Label>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">Primary Language</Label>
                      <Select onValueChange={(value) => form.setValue('languageRequirements.primary', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary language" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIMARY_LANGUAGE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Additional Languages (Optional)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {ADDITIONAL_LANGUAGE_OPTIONS.map((language) => (
                          <div key={language} className="flex items-center space-x-2">
                            <Checkbox
                              id={language}
                              checked={watchedValues.languageRequirements?.additional?.includes(language) || false}
                              onCheckedChange={() => handleLanguageToggle(language)}
                            />
                            <Label htmlFor={language} className="text-sm">
                              {language}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Work Schedule */}
          <TabsContent value="step-3" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Work Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Days Off Offered</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={watchedValues.workSchedule?.daysOff?.includes(day) || false}
                          onCheckedChange={() => handleDayOffToggle(day)}
                        />
                        <Label htmlFor={day} className="text-sm">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      {...form.register('workSchedule.startTime')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      {...form.register('workSchedule.endTime')}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="flexibleHours"
                    checked={watchedValues.workSchedule?.flexibleHours || false}
                    onCheckedChange={(checked) => form.setValue('workSchedule.flexibleHours', checked as boolean)}
                  />
                  <Label htmlFor="flexibleHours">Flexible working hours</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 4: Benefits & Policies */}
          <TabsContent value="step-4" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Benefits & Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Government Contributions</Label>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">SSS Contribution</Label>
                      <Select onValueChange={(value) => form.setValue('benefitsPolicies.sssContribution', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select SSS contribution policy" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTRIBUTION_POLICY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">PhilHealth Contribution</Label>
                      <Select onValueChange={(value) => form.setValue('benefitsPolicies.philhealthContribution', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select PhilHealth contribution policy" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTRIBUTION_POLICY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Pag-IBIG Contribution</Label>
                      <Select onValueChange={(value) => form.setValue('benefitsPolicies.pagibigContribution', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Pag-IBIG contribution policy" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTRIBUTION_POLICY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Additional Benefits</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="thirteenthMonthPay"
                        checked={watchedValues.benefitsPolicies?.thirteenthMonthPay || false}
                        onCheckedChange={(checked) => form.setValue('benefitsPolicies.thirteenthMonthPay', checked as boolean)}
                      />
                      <Label htmlFor="thirteenthMonthPay">13th Month Pay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="overtimePay"
                        checked={watchedValues.benefitsPolicies?.overtimePay || false}
                        onCheckedChange={(checked) => form.setValue('benefitsPolicies.overtimePay', checked as boolean)}
                      />
                      <Label htmlFor="overtimePay">Overtime Pay</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="holidayPay"
                        checked={watchedValues.benefitsPolicies?.holidayPay || false}
                        onCheckedChange={(checked) => form.setValue('benefitsPolicies.holidayPay', checked as boolean)}
                      />
                      <Label htmlFor="holidayPay">Holiday Pay</Label>
                    </div>
                  </div>
                </div>

                {watchedValues.preferredArrangement === 'LIVE_IN' && (
                  <div>
                    <Label>Accommodation Details (Live-in only)</Label>
                    <div className="space-y-4 mt-2">
                      <div>
                        <Label className="text-sm">Room Type</Label>
                        <Select onValueChange={(value) => form.setValue('accommodationDetails.roomType', value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROOM_TYPE_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Room Amenities</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {ROOM_AMENITIES_OPTIONS.map((amenity) => (
                            <div key={amenity} className="flex items-center space-x-2">
                              <Checkbox
                                id={amenity}
                                checked={watchedValues.accommodationDetails?.roomAmenities?.includes(amenity) || false}
                                onCheckedChange={() => handleAmenityToggle(amenity)}
                              />
                              <Label htmlFor={amenity} className="text-sm">
                                {amenity}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Meals Provided</Label>
                        <Select onValueChange={(value) => form.setValue('accommodationDetails.mealsProvided', value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select meals provided" />
                          </SelectTrigger>
                          <SelectContent>
                            {MEALS_PROVIDED_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 5: Contact Information */}
          <TabsContent value="step-5" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information (Private)
                </CardTitle>
                <p className="text-sm text-gray-600">
                  This information will only be visible to employees once you start a chat or schedule an interview.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    {...form.register('contactEmail')}
                    placeholder="your@email.com"
                  />
                  {form.formState.errors.contactEmail && (
                    <p className="text-sm text-red-600">{form.formState.errors.contactEmail.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactPhone">Contact Phone *</Label>
                  <Input
                    id="contactPhone"
                    {...form.register('contactPhone')}
                    placeholder="+63XXXXXXXXXX"
                  />
                  {form.formState.errors.contactPhone && (
                    <p className="text-sm text-red-600">{form.formState.errors.contactPhone.message}</p>
                  )}
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your contact information is private and will only be shared with employees you choose to contact.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            {currentStep < 5 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Complete Profile
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
