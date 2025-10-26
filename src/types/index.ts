export interface User {
  id: string;
  email: string;
  role: 'EMPLOYEE' | 'EMPLOYER' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl?: string;
  civilStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  phoneNumber?: string;
  location?: string;
  bio?: string;
  skills: string[];
  workExperience?: WorkExperience[];
  education?: Education[];
  preferences?: Preferences;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface EmployerProfile {
  id: string;
  userId: string;
  companyName: string;
  companyLogoUrl?: string;
  industry?: string;
  companySize: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  website?: string;
  description?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: number;
}

export interface Preferences {
  jobTypes: string[];
  locations: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  workArrangement: 'REMOTE' | 'HYBRID' | 'ONSITE' | 'ANY';
  availability: 'IMMEDIATE' | '2_WEEKS' | '1_MONTH' | 'FLEXIBLE';
}

export interface Subscription {
  id: string;
  employerId: string;
  stripeSubscriptionId: string;
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'INCOMPLETE';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
  receiver?: User;
}

export interface JobPosting {
  id: string;
  employerId: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  salaryRange?: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  employer?: EmployerProfile;
  applications?: JobApplication[];
}

export interface JobApplication {
  id: string;
  jobPostingId: string;
  employeeId: string;
  coverLetter?: string;
  status: 'PENDING' | 'REVIEWED' | 'INTERVIEWED' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
  updatedAt: string;
  jobPosting?: JobPosting;
  employee?: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchFilters {
  query?: string;
  location?: string;
  skills?: string[];
  experience?: string;
  salaryRange?: {
    min: number;
    max: number;
  };
  employmentType?: string[];
  companySize?: string[];
}

export interface DashboardStats {
  totalUsers: number;
  totalEmployers: number;
  totalEmployees: number;
  activeSubscriptions: number;
  totalMessages: number;
  totalJobPostings: number;
  totalApplications: number;
  monthlyRevenue: number;
}
