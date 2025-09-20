import { z } from 'zod';

// Base validation schemas
export const phoneSchema = z
  .string()
  .regex(/^(\+63|0)[0-9]{10}$/, 'Invalid Philippine phone number format');

export const emailSchema = z
  .string()
  .email('Invalid email address format');

export const budgetSchema = z
  .number()
  .int('Budget must be a whole number')
  .min(3000, 'Minimum budget must be at least ₱3,000')
  .max(50000, 'Maximum budget must be under ₱50,000');

// Enum schemas
export const subscriptionStatusSchema = z.enum(['ACTIVE', 'EXPIRED', 'CANCELED', 'PAST_DUE', 'TRIAL']);
export const paymentStatusSchema = z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELED']);
export const paymentProviderSchema = z.enum(['STRIPE', 'PAYPAL', 'GCASH', 'BANK_TRANSFER']);
export const householdSizeSchema = z.enum(['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE']);
export const preferredArrangementSchema = z.enum(['LIVE_IN', 'LIVE_OUT', 'BOTH']);
export const primaryLanguageSchema = z.enum(['TAGALOG', 'ENGLISH', 'BOTH']);
export const contributionPolicySchema = z.enum(['YES', 'NO', 'OPTIONAL']);
export const roomTypeSchema = z.enum(['PRIVATE_ROOM', 'SHARED_ROOM', 'STUDIO']);
export const mealsProvidedSchema = z.enum(['ALL_MEALS', 'BREAKFAST_ONLY', 'LUNCH_DINNER', 'NONE']);

// Requirements validation
export const requirementsSchema = z.object({
  cooking: z.boolean().default(false),
  childcare: z.boolean().default(false),
  elderlyCare: z.boolean().default(false),
  driving: z.boolean().default(false),
  petCare: z.boolean().default(false),
  housekeeping: z.boolean().default(false),
  laundry: z.boolean().default(false),
  gardening: z.boolean().default(false),
});

// Language requirements validation
export const languageRequirementsSchema = z.object({
  primary: primaryLanguageSchema,
  additional: z.array(z.string()).default([]),
});

// Work schedule validation
export const workScheduleSchema = z.object({
  daysOff: z.array(z.string()).min(1, 'Select at least one day off'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  flexibleHours: z.boolean().default(false),
});

// Benefits and policies validation
export const benefitsPoliciesSchema = z.object({
  sssContribution: contributionPolicySchema.default('NO'),
  philhealthContribution: contributionPolicySchema.default('NO'),
  pagibigContribution: contributionPolicySchema.default('NO'),
  thirteenthMonthPay: z.boolean().default(false),
  overtimePay: z.boolean().default(false),
  holidayPay: z.boolean().default(false),
});

// Accommodation details validation
export const accommodationDetailsSchema = z.object({
  roomType: roomTypeSchema.optional(),
  roomAmenities: z.array(z.string()).default([]),
  mealsProvided: mealsProvidedSchema.optional(),
});

// Complete Employer Profile Schema
export const employerProfileSchema = z.object({
  // Required fields (Public)
  companyName: z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name too long'),
  contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters').max(100, 'Contact person name too long'),
  city: z.string().min(2, 'City is required').max(100, 'City name too long'),
  province: z.string().min(2, 'Province is required').max(100, 'Province name too long'),
  
  // Private fields (Chat/Interview only)
  contactEmail: emailSchema.optional(),
  contactPhone: phoneSchema.optional(),
  
  // Optional fields (Public)
  aboutText: z.string().max(500, 'About text must be less than 500 characters').optional(),
  householdSize: householdSizeSchema.optional(),
  preferredArrangement: preferredArrangementSchema.optional(),
  budgetMin: budgetSchema.optional(),
  budgetMax: budgetSchema.optional(),
  
  // Complex fields
  requirements: requirementsSchema.default({}),
  languageRequirements: languageRequirementsSchema.default({ primary: 'TAGALOG', additional: [] }),
  workSchedule: workScheduleSchema.default({ daysOff: ['Sunday'], flexibleHours: false }),
  benefitsPolicies: benefitsPoliciesSchema.default({}),
  accommodationDetails: accommodationDetailsSchema.default({}),
})
.refine((data) => {
  if (data.budgetMin && data.budgetMax) {
    return data.budgetMin <= data.budgetMax;
  }
  return true;
}, {
  message: 'Minimum budget must be less than or equal to maximum budget',
  path: ['budgetMax'],
});

// Subscription schema
export const subscriptionSchema = z.object({
  id: z.string(),
  employerId: z.string(),
  status: subscriptionStatusSchema,
  expiresAt: z.date(),
  trialEndsAt: z.date().optional(),
  provider: paymentProviderSchema,
  providerSubscriptionId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Billing history schema
export const billingHistorySchema = z.object({
  id: z.string(),
  employerId: z.string(),
  subscriptionId: z.string(),
  amount: z.number().positive('Amount must be positive'),
  provider: paymentProviderSchema,
  providerPaymentId: z.string().optional(),
  invoiceUrl: z.string().url().optional(),
  status: paymentStatusSchema,
  paidAt: z.date().optional(),
  createdAt: z.date(),
});

// Payment method schema
export const paymentMethodSchema = z.object({
  id: z.string(),
  employerId: z.string(),
  provider: paymentProviderSchema,
  providerPaymentMethodId: z.string(),
  lastFourDigits: z.string().optional(),
  expiryMonth: z.number().int().min(1).max(12).optional(),
  expiryYear: z.number().int().min(new Date().getFullYear()).optional(),
  isDefault: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Partial schemas for different form steps
export const basicInfoSchema = employerProfileSchema.pick({
  companyName: true,
  contactPerson: true,
  city: true,
  province: true,
  aboutText: true,
  householdSize: true,
});

export const jobPreferencesSchema = employerProfileSchema.pick({
  preferredArrangement: true,
  budgetMin: true,
  budgetMax: true,
  requirements: true,
  languageRequirements: true,
  workSchedule: true,
});

export const benefitsSchema = employerProfileSchema.pick({
  benefitsPolicies: true,
  accommodationDetails: true,
});

export const contactInfoSchema = employerProfileSchema.pick({
  contactEmail: true,
  contactPhone: true,
});

// Profile update schema (allows partial updates)
export const employerProfileUpdateSchema = employerProfileSchema.partial();

// Public profile schema (for employee viewing)
export const publicEmployerProfileSchema = employerProfileSchema.pick({
  companyName: true,
  contactPerson: true,
  city: true,
  province: true,
  aboutText: true,
  householdSize: true,
  preferredArrangement: true,
  budgetMin: true,
  budgetMax: true,
  requirements: true,
  languageRequirements: true,
  workSchedule: true,
  benefitsPolicies: true,
  accommodationDetails: true,
});

// Extended profile schema (for subscribed employees)
export const extendedEmployerProfileSchema = employerProfileSchema.pick({
  companyName: true,
  contactPerson: true,
  city: true,
  province: true,
  contactEmail: true,
  contactPhone: true,
  aboutText: true,
  householdSize: true,
  preferredArrangement: true,
  budgetMin: true,
  budgetMax: true,
  requirements: true,
  languageRequirements: true,
  workSchedule: true,
  benefitsPolicies: true,
  accommodationDetails: true,
});

// Search filter schema
export const employerSearchFilterSchema = z.object({
  location: z.string().optional(),
  preferredArrangement: z.array(preferredArrangementSchema).optional(),
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
  householdSize: z.array(householdSizeSchema).optional(),
  requirements: z.array(z.string()).optional(),
  languageRequirements: z.array(z.string()).optional(),
});

// Type exports
export type EmployerProfile = z.infer<typeof employerProfileSchema>;
export type BasicInfo = z.infer<typeof basicInfoSchema>;
export type JobPreferences = z.infer<typeof jobPreferencesSchema>;
export type Benefits = z.infer<typeof benefitsSchema>;
export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type EmployerProfileUpdate = z.infer<typeof employerProfileUpdateSchema>;
export type PublicEmployerProfile = z.infer<typeof publicEmployerProfileSchema>;
export type ExtendedEmployerProfile = z.infer<typeof extendedEmployerProfileSchema>;
export type EmployerSearchFilter = z.infer<typeof employerSearchFilterSchema>;
export type Subscription = z.infer<typeof subscriptionSchema>;
export type BillingHistory = z.infer<typeof billingHistorySchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

// Form options
export const HOUSEHOLD_SIZE_OPTIONS = [
  { value: 'SMALL', label: 'Small (1-3 people)' },
  { value: 'MEDIUM', label: 'Medium (4-6 people)' },
  { value: 'LARGE', label: 'Large (7-10 people)' },
  { value: 'EXTRA_LARGE', label: 'Extra Large (10+ people)' },
] as const;

export const PREFERRED_ARRANGEMENT_OPTIONS = [
  { value: 'LIVE_IN', label: 'Live-in' },
  { value: 'LIVE_OUT', label: 'Live-out' },
  { value: 'BOTH', label: 'Both Live-in & Live-out' },
] as const;

export const PRIMARY_LANGUAGE_OPTIONS = [
  { value: 'TAGALOG', label: 'Tagalog/Filipino' },
  { value: 'ENGLISH', label: 'English' },
  { value: 'BOTH', label: 'Both Tagalog & English' },
] as const;

export const ADDITIONAL_LANGUAGE_OPTIONS = [
  'Bisaya/Cebuano',
  'Ilocano',
  'Kapampangan',
  'Bicolano',
  'Hiligaynon',
  'Waray',
  'Other',
] as const;

export const REQUIREMENTS_OPTIONS = [
  { key: 'cooking', label: 'Cooking' },
  { key: 'childcare', label: 'Childcare' },
  { key: 'elderlyCare', label: 'Elderly Care' },
  { key: 'driving', label: 'Driving' },
  { key: 'petCare', label: 'Pet Care' },
  { key: 'housekeeping', label: 'Housekeeping' },
  { key: 'laundry', label: 'Laundry' },
  { key: 'gardening', label: 'Gardening' },
] as const;

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

export const CONTRIBUTION_POLICY_OPTIONS = [
  { value: 'YES', label: 'Yes, we contribute' },
  { value: 'NO', label: 'No, we don\'t contribute' },
  { value: 'OPTIONAL', label: 'Optional for employee' },
] as const;

export const ROOM_TYPE_OPTIONS = [
  { value: 'PRIVATE_ROOM', label: 'Private Room' },
  { value: 'SHARED_ROOM', label: 'Shared Room' },
  { value: 'STUDIO', label: 'Studio-type' },
] as const;

export const MEALS_PROVIDED_OPTIONS = [
  { value: 'ALL_MEALS', label: 'All meals provided' },
  { value: 'BREAKFAST_ONLY', label: 'Breakfast only' },
  { value: 'LUNCH_DINNER', label: 'Lunch and dinner' },
  { value: 'NONE', label: 'No meals provided' },
] as const;

export const ROOM_AMENITIES_OPTIONS = [
  'Air Conditioning',
  'Electric Fan',
  'WiFi Internet',
  'Cable TV',
  'Private Bathroom',
  'Shared Bathroom',
  'Kitchen Access',
  'Laundry Access',
] as const;
