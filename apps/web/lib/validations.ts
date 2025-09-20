import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['ADMIN', 'EMPLOYER', 'EMPLOYEE']),
});

// Employee profile validation
export const employeeProfileSchema = z.object({
  civilStatus: z.enum(['SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED', 'SEPARATED']),
  location: z.string().min(2, 'Location is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  experienceText: z.string().min(10, 'Experience description must be at least 10 characters'),
  salaryMin: z.number().min(3000, 'Minimum salary must be at least ₱3,000'),
  salaryMax: z.number().min(3000, 'Maximum salary must be at least ₱3,000'),
  liveIn: z.boolean().default(false),
  availabilityDate: z.date().optional(),
  daysOff: z.array(z.string()).default([]),
  overtime: z.boolean().default(false),
  holidayWork: z.boolean().default(false),
  visibility: z.boolean().default(false),
}).refine((data) => data.salaryMax >= data.salaryMin, {
  message: 'Maximum salary must be greater than or equal to minimum salary',
  path: ['salaryMax'],
});

// Employer profile validation
export const employerProfileSchema = z.object({
  companyName: z.string().optional(),
  contactPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

// Search filters validation
export const searchFiltersSchema = z.object({
  location: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  civilStatus: z.array(z.string()).optional(),
  liveIn: z.boolean().optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  availabilityDate: z.date().optional(),
  experience: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
});

// Message validation
export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
  receiverId: z.string().cuid('Invalid receiver ID'),
});

// Interview validation
export const interviewSchema = z.object({
  employeeId: z.string().cuid('Invalid employee ID'),
  startsAt: z.date().min(new Date(), 'Interview must be scheduled in the future'),
  notes: z.string().max(500, 'Notes too long').optional(),
});

// Document validation
export const documentSchema = z.object({
  type: z.enum([
    'PHILID',
    'PHILHEALTH',
    'PAGIBIG',
    'PASSPORT',
    'NBI_CLEARANCE',
    'POLICE_CLEARANCE',
    'BIRTH_CERTIFICATE',
    'MARRIAGE_CERTIFICATE',
    'OTHER'
  ]),
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
  mimeType: z.string().regex(
    /^(image\/(jpeg|jpg|png|webp)|application\/pdf)$/,
    'Invalid file type. Only JPEG, PNG, WebP, and PDF files are allowed.'
  ),
});

// Report validation
export const reportSchema = z.object({
  reportedId: z.string().cuid('Invalid reported user ID'),
  reason: z.enum([
    'INAPPROPRIATE_CONTENT',
    'FAKE_PROFILE',
    'HARASSMENT',
    'SPAM',
    'OTHER'
  ]),
  description: z.string().max(500, 'Description too long').optional(),
});

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['profile', 'document']),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB
});

// Subscription validation
export const subscriptionSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  paymentMethodId: z.string().min(1, 'Payment method is required'),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Newsletter validation
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Common validation helpers
export const phoneRegex = /^(\+63|0)[0-9]{10}$/;
export const philIdRegex = /^[0-9]{13}$/;
export const philHealthRegex = /^[0-9]{2}-[0-9]{9}-[0-9]{1}$/;
export const pagIbigRegex = /^[0-9]{4}-[0-9]{4}-[0-9]{4}$/;

// Philippine phone number validation
export const philippinePhoneSchema = z.string().regex(
  phoneRegex,
  'Invalid Philippine phone number format'
);

// Philippine ID validation
export const philIdSchema = z.string().regex(
  philIdRegex,
  'Invalid PhilID format (13 digits)'
);

// PhilHealth validation
export const philHealthSchema = z.string().regex(
  philHealthRegex,
  'Invalid PhilHealth format (XX-XXXXXXXXX-X)'
);

// Pag-IBIG validation
export const pagIbigSchema = z.string().regex(
  pagIbigRegex,
  'Invalid Pag-IBIG format (XXXX-XXXX-XXXX)'
);

// Export types
export type UserInput = z.infer<typeof userSchema>;
export type EmployeeProfileInput = z.infer<typeof employeeProfileSchema>;
export type EmployerProfileInput = z.infer<typeof employerProfileSchema>;
export type SearchFiltersInput = z.infer<typeof searchFiltersSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type InterviewInput = z.infer<typeof interviewSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
