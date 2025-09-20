'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  employeeProfileSchema,
  type EmployeeProfile,
  CIVIL_STATUS_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  SKILLS_OPTIONS,
  DAYS_OF_WEEK,
  DOCUMENT_TYPE_OPTIONS
} from '@/lib/validations/employee-profile-m2';
import { SalarySlider } from '@/components/ui/salary-slider-m2';
import { ToggleControls } from '@/components/ui/toggle-controls-m2';
import { DocumentUpload } from '@/components/ui/document-upload-m2';
import { ProfileCompleteness } from '@/components/ui/profile-completeness-m2';

interface EmployeeProfileFormM2Props {
  initialData?: Partial<EmployeeProfile>;
  onSubmit: (data: EmployeeProfile) => Promise<void>;
  onSaveDraft: (data: Partial<EmployeeProfile>) => Promise<void>;
  isLoading?: boolean;
}

export function EmployeeProfileFormM2({ 
  initialData, 
  onSubmit, 
  onSaveDraft, 
  isLoading = false 
}: EmployeeProfileFormM2Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileScore, setProfileScore] = useState(0);
  const [kycStatus, setKycStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED'>('NOT_STARTED');
  const [documents, setDocuments] = useState<Array<{
    id: string;
    type: string;
    fileName: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    url: string;
  }>>([]);

  const form = useForm<EmployeeProfile>({
    resolver: zodResolver(employeeProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      age: 25,
      civilStatus: 'SINGLE',
      city: '',
      province: '',
      exactAddress: '',
      phone: '',
      email: '',
      skills: [],
      experience: 0,
      headline: '',
      salaryMin: 5000,
      salaryMax: 15000,
      employmentType: 'LIVE_OUT',
      daysOff: ['Sunday'],
      overtime: false,
      holidayWork: false,
      visibility: false,
      profileScore: 0,
      kycStatus: 'NOT_STARTED',
      references: [{
        name: '',
        relationship: '',
        company: '',
        phone: '',
        email: '',
        duration: '',
        notes: '',
      }],
      ...initialData,
    },
  });

  const { fields: referenceFields, append: appendReference, remove: removeReference } = useFieldArray({
    control: form.control,
    name: 'references',
  });

  const watchedValues = form.watch();

  // Calculate profile completeness score
  useEffect(() => {
    let score = 0;
    const maxScore = 100;

    // Basic info (20%)
    if (watchedValues.firstName && watchedValues.lastName) score += 10;
    if (watchedValues.age && watchedValues.civilStatus) score += 10;

    // Professional (25%)
    if (watchedValues.skills && watchedValues.skills.length >= 3) score += 15;
    if (watchedValues.experience !== undefined) score += 10;

    // Preferences (15%)
    if (watchedValues.salaryMin && watchedValues.salaryMax) score += 10;
    if (watchedValues.employmentType) score += 5;

    // Documents (25%)
    const verifiedDocs = documents.filter(doc => doc.status === 'VERIFIED').length;
    score += Math.min(verifiedDocs * 5, 25);

    // References (10%)
    if (watchedValues.references && watchedValues.references.length >= 1) score += 10;

    // Contact (5%)
    if (watchedValues.phone && watchedValues.email) score += 5;

    setProfileScore(Math.min(score, maxScore));
    form.setValue('profileScore', Math.min(score, maxScore));
  }, [watchedValues, documents, form]);

  const handleSalaryChange = (value: number[], field: 'salaryMin' | 'salaryMax') => {
    form.setValue(field, value[0]);
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = form.getValues('skills') || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    form.setValue('skills', newSkills);
  };

  const handleDayOffToggle = (day: string) => {
    const currentDays = form.getValues('daysOff') || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    form.setValue('daysOff', newDays);
  };

  const handleSubmit = async (data: EmployeeProfile) => {
    await onSubmit(data);
  };

  const handleSaveDraft = async () => {
    const data = form.getValues();
    await onSaveDraft(data);
  };

  const handleUploadDocument = async (type: string) => {
    // This would trigger the document upload flow
    console.log('Upload document:', type);
  };

  const handleViewDocument = (documentId: string) => {
    // This would open the document viewer
    console.log('View document:', documentId);
  };

  const handleReuploadDocument = (documentId: string) => {
    // This would trigger re-upload flow
    console.log('Re-upload document:', documentId);
  };

  const handleDeleteDocument = (documentId: string) => {
    // This would delete the document
    console.log('Delete document:', documentId);
  };

  const sections = {
    basic: {
      completed: !!(watchedValues.firstName && watchedValues.lastName && watchedValues.age && watchedValues.civilStatus),
      score: 0,
      maxScore: 20,
    },
    professional: {
      completed: !!(watchedValues.skills?.length >= 3 && watchedValues.experience !== undefined),
      score: 0,
      maxScore: 25,
    },
    preferences: {
      completed: !!(watchedValues.salaryMin && watchedValues.salaryMax && watchedValues.employmentType),
      score: 0,
      maxScore: 15,
    },
    documents: {
      completed: documents.filter(doc => doc.status === 'VERIFIED').length >= 5,
      score: 0,
      maxScore: 25,
    },
    references: {
      completed: !!(watchedValues.references && watchedValues.references.length >= 1),
      score: 0,
      maxScore: 10,
    },
    contact: {
      completed: !!(watchedValues.phone && watchedValues.email),
      score: 0,
      maxScore: 5,
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Completeness */}
      <ProfileCompleteness
        score={profileScore}
        sections={sections}
        onSectionClick={(section) => {
          const stepMap: Record<string, number> = {
            basic: 1,
            professional: 2,
            preferences: 3,
            documents: 4,
            references: 5,
            contact: 1,
          };
          setCurrentStep(stepMap[section] || 1);
        }}
      />

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={`step-${currentStep}`} onValueChange={(value) => setCurrentStep(parseInt(value.split('-')[1]))}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="step-1">Basic</TabsTrigger>
            <TabsTrigger value="step-2">Professional</TabsTrigger>
            <TabsTrigger value="step-3">Preferences</TabsTrigger>
            <TabsTrigger value="step-4">Documents</TabsTrigger>
            <TabsTrigger value="step-5">References</TabsTrigger>
          </TabsList>

          {/* Step 1: Basic Information */}
          <TabsContent value="step-1" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...form.register('firstName')}
                      placeholder="Enter your first name"
                    />
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...form.register('lastName')}
                      placeholder="Enter your last name"
                    />
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      {...form.register('age', { valueAsNumber: true })}
                      min="18"
                      max="65"
                    />
                    {form.formState.errors.age && (
                      <p className="text-sm text-red-600">{form.formState.errors.age.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="civilStatus">Civil Status *</Label>
                    <Select onValueChange={(value) => form.setValue('civilStatus', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select civil status" />
                      </SelectTrigger>
                      <SelectContent>
                        {CIVIL_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.civilStatus && (
                      <p className="text-sm text-red-600">{form.formState.errors.civilStatus.message}</p>
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
                  <Label htmlFor="exactAddress">Exact Address * (Private)</Label>
                  <Textarea
                    id="exactAddress"
                    {...form.register('exactAddress')}
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                  {form.formState.errors.exactAddress && (
                    <p className="text-sm text-red-600">{form.formState.errors.exactAddress.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number * (Private)</Label>
                    <Input
                      id="phone"
                      {...form.register('phone')}
                      placeholder="+63XXXXXXXXXX"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address * (Private)</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      placeholder="your@email.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Professional Information */}
          <TabsContent value="step-2" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="headline">Professional Headline *</Label>
                  <Textarea
                    id="headline"
                    {...form.register('headline')}
                    placeholder="Brief description of your professional background"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">
                    {watchedValues.headline?.length || 0}/200 characters
                  </p>
                  {form.formState.errors.headline && (
                    <p className="text-sm text-red-600">{form.formState.errors.headline.message}</p>
                  )}
                </div>

                <div>
                  <Label>Skills * (Select 3-10 skills)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {SKILLS_OPTIONS.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={watchedValues.skills?.includes(skill) || false}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <Label htmlFor={skill} className="text-sm">
                          {skill}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.skills && (
                    <p className="text-sm text-red-600">{form.formState.errors.skills.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    type="number"
                    {...form.register('experience', { valueAsNumber: true })}
                    min="0"
                    max="50"
                  />
                  {form.formState.errors.experience && (
                    <p className="text-sm text-red-600">{form.formState.errors.experience.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Preferences */}
          <TabsContent value="step-3" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Work Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SalarySlider
                  minValue={watchedValues.salaryMin || 0}
                  maxValue={watchedValues.salaryMax || 0}
                  onMinChange={(value) => handleSalaryChange([value], 'salaryMin')}
                  onMaxChange={(value) => handleSalaryChange([value], 'salaryMax')}
                />

                <div>
                  <Label>Days Off Preference *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={watchedValues.daysOff?.includes(day) || false}
                          onCheckedChange={() => handleDayOffToggle(day)}
                        />
                        <Label htmlFor={day} className="text-sm">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.daysOff && (
                    <p className="text-sm text-red-600">{form.formState.errors.daysOff.message}</p>
                  )}
                </div>

                <ToggleControls
                  overtime={watchedValues.overtime || false}
                  holidayWork={watchedValues.holidayWork || false}
                  visibility={watchedValues.visibility || false}
                  employmentType={watchedValues.employmentType || 'LIVE_OUT'}
                  onOvertimeChange={(checked) => form.setValue('overtime', checked)}
                  onHolidayWorkChange={(checked) => form.setValue('holidayWork', checked)}
                  onVisibilityChange={(checked) => form.setValue('visibility', checked)}
                  onEmploymentTypeChange={(type) => form.setValue('employmentType', type)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 4: Documents */}
          <TabsContent value="step-4" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
                <p className="text-sm text-gray-600">
                  Upload your identification documents for verification
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DOCUMENT_TYPE_OPTIONS.map((doc) => (
                    <DocumentUpload
                      key={doc.value}
                      documentType={doc.label}
                      required={doc.required}
                      onUpload={handleUploadDocument}
                      onDelete={handleDeleteDocument}
                      onReupload={handleReuploadDocument}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 5: References */}
          <TabsContent value="step-5" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>References</CardTitle>
                <p className="text-sm text-gray-600">
                  Add professional references (1-3 references)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {referenceFields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Reference {index + 1}</h3>
                      {referenceFields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeReference(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`references.${index}.name`}>Name *</Label>
                        <Input
                          {...form.register(`references.${index}.name`)}
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`references.${index}.relationship`}>Relationship *</Label>
                        <Input
                          {...form.register(`references.${index}.relationship`)}
                          placeholder="e.g., Previous Employer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`references.${index}.company`}>Company</Label>
                        <Input
                          {...form.register(`references.${index}.company`)}
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`references.${index}.phone`}>Phone *</Label>
                        <Input
                          {...form.register(`references.${index}.phone`)}
                          placeholder="+63XXXXXXXXXX"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`references.${index}.email`}>Email</Label>
                        <Input
                          {...form.register(`references.${index}.email`)}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`references.${index}.duration`}>Duration</Label>
                        <Input
                          {...form.register(`references.${index}.duration`)}
                          placeholder="e.g., 2 years"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`references.${index}.notes`}>Notes</Label>
                      <Textarea
                        {...form.register(`references.${index}.notes`)}
                        placeholder="Additional comments"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}

                {referenceFields.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendReference({
                      name: '',
                      relationship: '',
                      company: '',
                      phone: '',
                      email: '',
                      duration: '',
                      notes: '',
                    })}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reference
                  </Button>
                )}

                {form.formState.errors.references && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {form.formState.errors.references.message}
                    </AlertDescription>
                  </Alert>
                )}
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
