import { z } from 'zod';

// Base validation schemas
export const phoneSchema = z
  .string()
  .regex(/^(\+63|0)[0-9]{10}$/, 'Invalid Philippine phone number format');

export const emailSchema = z
  .string()
  .email('Invalid email address format');

export const ageSchema = z
  .number()
  .int('Age must be a whole number')
  .min(18, 'Must be at least 18 years old')
  .max(65, 'Must be under 65 years old');

export const salarySchema = z
  .number()
  .int('Salary must be a whole number')
  .min(3000, 'Minimum salary must be at least ₱3,000')
  .max(50000, 'Maximum salary must be under ₱50,000');

// Enum schemas
export const civilStatusSchema = z.enum(['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED', 'SEPARATED']);
export const employmentTypeSchema = z.enum(['LIVE_IN', 'LIVE_OUT', 'BOTH']);
export const kycStatusSchema = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'VERIFIED', 'REJECTED']);
export const documentTypeSchema = z.enum([
  'PHILSYS_ID',
  'PHILHEALTH_ID', 
  'PAGIBIG_ID',
  'PASSPORT',
  'NBI_CLEARANCE',
  'POLICE_CLEARANCE',
  'BIRTH_CERTIFICATE',
  'MARRIAGE_CERTIFICATE',
  'OTHER'
]);
export const documentStatusSchema = z.enum(['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED']);

// Skills validation
export const skillsSchema = z
  .array(z.string().min(2, 'Skill must be at least 2 characters'))
  .min(3, 'At least 3 skills required')
  .max(10, 'Maximum 10 skills allowed');

// Days off validation
export const daysOffSchema = z
  .array(z.string())
  .min(1, 'Select at least one day off')
  .max(7, 'Cannot select all days');

// Reference validation
export const referenceSchema = z.object({
  name: z.string().min(2, 'Reference name must be at least 2 characters'),
  relationship: z.string().min(2, 'Relationship must be specified'),
  company: z.string().optional(),
  phone: phoneSchema,
  email: emailSchema.optional(),
  duration: z.string().optional(),
  notes: z.string().optional(),
});

// Document validation
export const documentSchema = z.object({
  type: documentTypeSchema,
  fileName: z.string().min(1, 'File name is required'),
  fileUrl: z.string().url('Invalid file URL'),
  fileSize: z.number().int().min(1, 'File size must be greater than 0'),
  mimeType: z.string().min(1, 'MIME type is required'),
  status: documentStatusSchema.default('PENDING'),
  verifiedAt: z.date().optional(),
  verifiedBy: z.string().optional(),
  rejectionReason: z.string().optional(),
  expiresAt: z.date().optional(),
});

// Complete Employee Profile Schema
export const employeeProfileSchema = z.object({
  // Basic Information (Public)
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name too long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name too long'),
  age: ageSchema,
  birthDate: z.date().optional(),
  civilStatus: civilStatusSchema,
  city: z.string().min(2, 'City is required').max(100, 'City name too long'),
  province: z.string().min(2, 'Province is required').max(100, 'Province name too long'),
  
  // Private Information (Subscribed Employers Only)
  exactAddress: z.string().min(10, 'Exact address must be at least 10 characters').max(500, 'Address too long'),
  phone: phoneSchema,
  email: emailSchema,
  
  // Professional Information (Public)
  skills: skillsSchema,
  experience: z.number().int().min(0, 'Experience cannot be negative').max(50, 'Maximum 50 years experience'),
  headline: z.string().min(10, 'Headline must be at least 10 characters').max(200, 'Headline too long'),
  
  // Salary & Preferences (Public)
  salaryMin: salarySchema,
  salaryMax: salarySchema,
  employmentType: employmentTypeSchema,
  availabilityDate: z.date().optional(),
  daysOff: daysOffSchema,
  overtime: z.boolean().default(false),
  holidayWork: z.boolean().default(false),
  
  // Visibility & Status
  visibility: z.boolean().default(false),
  profileScore: z.number().int().min(0).max(100).default(0),
  kycStatus: kycStatusSchema.default('NOT_STARTED'),
  
  // Relations
  documents: z.array(documentSchema).optional(),
  references: z.array(referenceSchema).min(1, 'At least one reference required').max(3, 'Maximum 3 references'),
})
.refine((data) => data.salaryMin <= data.salaryMax, {
  message: 'Minimum salary must be less than or equal to maximum salary',
  path: ['salaryMax'],
});

// Partial schemas for different form steps
export const basicInfoSchema = employeeProfileSchema.pick({
  firstName: true,
  lastName: true,
  age: true,
  birthDate: true,
  civilStatus: true,
  city: true,
  province: true,
  exactAddress: true,
  phone: true,
  email: true,
});

export const professionalInfoSchema = employeeProfileSchema.pick({
  skills: true,
  experience: true,
  headline: true,
});

export const preferencesSchema = employeeProfileSchema.pick({
  salaryMin: true,
  salaryMax: true,
  employmentType: true,
  availabilityDate: true,
  daysOff: true,
  overtime: true,
  holidayWork: true,
  visibility: true,
});

export const referencesSchema = z.object({
  references: z.array(referenceSchema).min(1, 'At least one reference required').max(3, 'Maximum 3 references'),
});

// Document upload schema
export const documentUploadSchema = z.object({
  type: documentTypeSchema,
  file: z.instanceof(File, 'File is required'),
});

// Profile update schema (allows partial updates)
export const employeeProfileUpdateSchema = employeeProfileSchema.partial();

// Public profile schema (for employer viewing)
export const publicEmployeeProfileSchema = employeeProfileSchema.pick({
  firstName: true,
  age: true,
  civilStatus: true,
  city: true,
  province: true,
  skills: true,
  experience: true,
  headline: true,
  salaryMin: true,
  salaryMax: true,
  employmentType: true,
  availabilityDate: true,
  daysOff: true,
  overtime: true,
  holidayWork: true,
  visibility: true,
  profileScore: true,
  kycStatus: true,
});

// Extended profile schema (for subscribed employers)
export const extendedEmployeeProfileSchema = employeeProfileSchema.pick({
  firstName: true,
  lastName: true,
  age: true,
  civilStatus: true,
  city: true,
  province: true,
  exactAddress: true,
  phone: true,
  email: true,
  skills: true,
  experience: true,
  headline: true,
  salaryMin: true,
  salaryMax: true,
  employmentType: true,
  availabilityDate: true,
  daysOff: true,
  overtime: true,
  holidayWork: true,
  visibility: true,
  profileScore: true,
  kycStatus: true,
  documents: true,
  references: true,
});

// Search filter schema
export const employeeSearchFilterSchema = z.object({
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
  employmentType: z.array(employmentTypeSchema).optional(),
  salaryMin: z.number().int().min(0).optional(),
  salaryMax: z.number().int().min(0).optional(),
  experienceMin: z.number().int().min(0).optional(),
  experienceMax: z.number().int().min(0).optional(),
  availabilityDate: z.date().optional(),
  kycStatus: z.array(kycStatusSchema).optional(),
  visibility: z.boolean().optional(),
});

// Type exports
export type EmployeeProfile = z.infer<typeof employeeProfileSchema>;
export type BasicInfo = z.infer<typeof basicInfoSchema>;
export type ProfessionalInfo = z.infer<typeof professionalInfoSchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
export type References = z.infer<typeof referencesSchema>;
export type DocumentUpload = z.infer<typeof documentUploadSchema>;
export type EmployeeProfileUpdate = z.infer<typeof employeeProfileUpdateSchema>;
export type PublicEmployeeProfile = z.infer<typeof publicEmployeeProfileSchema>;
export type ExtendedEmployeeProfile = z.infer<typeof extendedEmployeeProfileSchema>;
export type EmployeeSearchFilter = z.infer<typeof employeeSearchFilterSchema>;
export type Reference = z.infer<typeof referenceSchema>;
export type Document = z.infer<typeof documentSchema>;

// Civil status options for forms
export const CIVIL_STATUS_OPTIONS = [
  { value: 'SINGLE', label: 'Single' },
  { value: 'MARRIED', label: 'Married' },
  { value: 'WIDOWED', label: 'Widowed' },
  { value: 'DIVORCED', label: 'Divorced' },
  { value: 'SEPARATED', label: 'Separated' },
] as const;

// Employment type options for forms
export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'LIVE_IN', label: 'Live-in' },
  { value: 'LIVE_OUT', label: 'Live-out' },
  { value: 'BOTH', label: 'Both Live-in & Live-out' },
] as const;

// Skills options for forms
export const SKILLS_OPTIONS = [
  'General Housekeeping',
  'Cooking',
  'Laundry',
  'Ironing',
  'Childcare',
  'Elderly Care',
  'Pet Care',
  'Gardening',
  'Driving',
  'Shopping',
  'Meal Planning',
  'Deep Cleaning',
  'Organization',
  'Time Management',
  'Communication',
  'First Aid',
  'CPR',
  'Basic Nursing',
  'Massage Therapy',
  'Hair Styling',
  'Nail Care',
  'Sewing',
  'Embroidery',
  'Craft Making',
] as const;

// Days of week options
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

// Document type options
export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'PHILSYS_ID', label: 'PhilSys ID (National ID)', required: true },
  { value: 'PHILHEALTH_ID', label: 'PhilHealth ID', required: true },
  { value: 'PAGIBIG_ID', label: 'Pag-IBIG ID', required: true },
  { value: 'NBI_CLEARANCE', label: 'NBI Clearance', required: true },
  { value: 'POLICE_CLEARANCE', label: 'Police Clearance', required: true },
  { value: 'PASSPORT', label: 'Passport (if available)', required: false },
] as const;
