// Adry-specific types for housekeeper hiring platform

export interface AdryUser {
  id: string;
  email: string;
  role: 'EMPLOYEE' | 'EMPLOYER' | 'ADMIN';
  isVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeProfile {
  id: string;
  userId: string;
  
  // Basic Information
  firstName: string;
  lastName: string;
  middleName?: string;
  profilePhotoUrl?: string;
  age: number;
  civilStatus: 'SINGLE' | 'MARRIED' | 'WIDOWED' | 'DIVORCED' | 'SEPARATED';
  gender: string;
  birthDate?: string;
  
  // Contact Information
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  province: string;
  barangay?: string;
  postalCode?: string;
  
  // Professional Information
  bio?: string;
  skills: string[];
  languages: string[];
  experience: number; // Years of experience
  workHistory?: WorkHistory[];
  references?: Reference[];
  
  // Preferences
  employmentType: 'LIVE_IN' | 'LIVE_OUT' | 'BOTH';
  salaryMin?: number;
  salaryMax?: number;
  availabilityDate?: string;
  daysOff: string[];
  overtimeWork: boolean;
  holidayWork: boolean;
  
  // Status
  isPublic: boolean;
  isVerified: boolean;
  profileScore: number;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  user?: AdryUser;
  documents?: Document[];
}

export interface EmployerProfile {
  id: string;
  userId: string;
  
  // Basic Information
  firstName: string;
  lastName: string;
  companyName?: string;
  phoneNumber: string;
  email: string;
  
  // Address
  address: string;
  city: string;
  province: string;
  barangay?: string;
  postalCode?: string;
  
  // Preferences
  preferredLocation: string[];
  householdSize?: number;
  hasChildren: boolean;
  hasPets: boolean;
  specialRequirements?: string;
  
  createdAt: string;
  updatedAt: string;
  
  // Relations
  user?: AdryUser;
  subscription?: Subscription;
}

export interface WorkHistory {
  id: string;
  employerName: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  reference?: string;
}

export interface Reference {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  company?: string;
}

export interface Document {
  id: string;
  employeeId: string;
  type: 'PHILID' | 'PHILHEALTH' | 'PAGIBIG' | 'PASSPORT' | 'NBI_CLEARANCE' | 'POLICE_CLEARANCE' | 'BIRTH_CERTIFICATE' | 'MARRIAGE_CERTIFICATE' | 'OTHER';
  documentUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  employerId: string;
  stripeSubscriptionId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PAST_DUE';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amount: number;
  currency: string;
  autoRenew: boolean;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'ARCHIVED';
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  sender?: AdryUser;
  receiver?: AdryUser;
}

export interface Interview {
  id: string;
  employerId: string;
  employeeId: string;
  scheduledAt: string;
  duration: number; // minutes
  location: string;
  notes?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'RESCHEDULED';
  createdAt: string;
  updatedAt: string;
  
  // Relations
  employer?: EmployerProfile;
  employee?: AdryUser;
}

export interface Shortlist {
  id: string;
  employerId: string;
  employeeId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  employer?: EmployerProfile;
  employee?: EmployeeProfile;
}

export interface SearchFilters {
  location?: string[];
  employmentType?: string[];
  skills?: string[];
  experience?: {
    min: number;
    max: number;
  };
  salaryRange?: {
    min: number;
    max: number;
  };
  availability?: string;
  languages?: string[];
  hasDocuments?: boolean;
  isVerified?: boolean;
}

export interface SavedSearchFilter {
  id: string;
  employerId: string;
  name: string;
  filters: SearchFilters;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  description?: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  reporter?: AdryUser;
  reported?: AdryUser;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Dashboard-specific types
export interface EmployeeDashboard {
  profile: EmployeeProfile;
  documents: Document[];
  messages: Message[];
  interviews: Interview[];
  profileCompleteness: number;
  verificationStatus: {
    email: boolean;
    phone: boolean;
    documents: number; // Number of verified documents
    totalDocuments: number;
  };
}

export interface EmployerDashboard {
  profile: EmployerProfile;
  subscription?: Subscription;
  shortlists: Shortlist[];
  messages: Message[];
  interviews: Interview[];
  savedFilters: SavedSearchFilter[];
  billingHistory: any[];
}

export interface AdminDashboard {
  stats: {
    totalUsers: number;
    totalEmployees: number;
    totalEmployers: number;
    activeSubscriptions: number;
    pendingVerifications: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
  recentActivity: AuditLog[];
  pendingReports: Report[];
  pendingVerifications: Document[];
}

// API Response types
export interface AdryApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface EmployeeProfileForm {
  // Basic Information
  firstName: string;
  lastName: string;
  middleName?: string;
  age: number;
  civilStatus: string;
  gender: string;
  birthDate?: string;
  
  // Contact Information
  phoneNumber: string;
  address: string;
  city: string;
  province: string;
  barangay?: string;
  postalCode?: string;
  
  // Professional Information
  bio?: string;
  skills: string[];
  languages: string[];
  experience: number;
  
  // Preferences
  employmentType: string;
  salaryMin?: number;
  salaryMax?: number;
  availabilityDate?: string;
  daysOff: string[];
  overtimeWork: boolean;
  holidayWork: boolean;
}

export interface EmployerProfileForm {
  // Basic Information
  firstName: string;
  lastName: string;
  companyName?: string;
  phoneNumber: string;
  
  // Address
  address: string;
  city: string;
  province: string;
  barangay?: string;
  postalCode?: string;
  
  // Preferences
  preferredLocation: string[];
  householdSize?: number;
  hasChildren: boolean;
  hasPets: boolean;
  specialRequirements?: string;
}

// Philippines-specific constants
export const PHILIPPINES_PROVINCES = [
  'Metro Manila', 'Cavite', 'Laguna', 'Rizal', 'Bulacan', 'Pampanga',
  'Bataan', 'Zambales', 'Tarlac', 'Nueva Ecija', 'Aurora', 'Batangas',
  'Quezon', 'Camarines Norte', 'Camarines Sur', 'Catanduanes',
  'Masbate', 'Sorsogon', 'Albay', 'Camarines Sur', 'Iloilo', 'Negros Occidental',
  'Cebu', 'Bohol', 'Siquijor', 'Negros Oriental', 'Leyte', 'Southern Leyte',
  'Biliran', 'Samar', 'Northern Samar', 'Eastern Samar', 'Palawan',
  'Marinduque', 'Occidental Mindoro', 'Oriental Mindoro', 'Romblon',
  'Abra', 'Benguet', 'Ifugao', 'Kalinga', 'Mountain Province', 'Apayao',
  'Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan', 'Batanes',
  'Cagayan', 'Isabela', 'Nueva Vizcaya', 'Quirino', 'Agusan del Norte',
  'Agusan del Sur', 'Surigao del Norte', 'Surigao del Sur', 'Dinagat Islands',
  'Basilan', 'Lanao del Norte', 'Lanao del Sur', 'Maguindanao', 'Sulu',
  'Tawi-Tawi', 'Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay',
  'Davao del Norte', 'Davao del Sur', 'Davao Occidental', 'Davao Oriental',
  'Compostela Valley', 'North Cotabato', 'South Cotabato', 'Sultan Kudarat',
  'Sarangani', 'Cotabato City'
];

export const HOUSEKEEPING_SKILLS = [
  'General Housekeeping', 'Cooking', 'Laundry', 'Ironing', 'Childcare',
  'Elderly Care', 'Pet Care', 'Gardening', 'Driving', 'Shopping',
  'Meal Planning', 'Deep Cleaning', 'Organization', 'Time Management',
  'Communication', 'First Aid', 'CPR', 'Basic Nursing', 'Massage Therapy',
  'Hair Styling', 'Nail Care', 'Sewing', 'Embroidery', 'Craft Making'
];

export const LANGUAGES = [
  'Tagalog', 'English', 'Cebuano', 'Ilocano', 'Hiligaynon', 'Bicolano',
  'Waray', 'Kapampangan', 'Pangasinan', 'Tausug', 'Maguindanao',
  'Maranao', 'Chavacano', 'Spanish', 'Chinese', 'Japanese', 'Korean'
];

export const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];
