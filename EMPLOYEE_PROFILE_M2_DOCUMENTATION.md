# Employee Profile M2 - Complete Implementation Documentation

## 🎯 **Overview**

This document provides comprehensive documentation for the Employee Profile M2 implementation, including database schema, API endpoints, React components, and testing procedures.

---

## 📊 **Database Schema**

### **Employee Profile Table**
```sql
CREATE TABLE employee_profiles (
  user_id TEXT PRIMARY KEY,
  photo_url TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT,
  age INTEGER NOT NULL,
  birth_date TIMESTAMP(3),
  civil_status civil_status NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  exact_address TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  experience INTEGER NOT NULL,
  headline TEXT,
  salary_min INTEGER NOT NULL,
  salary_max INTEGER NOT NULL,
  employment_type employment_type NOT NULL DEFAULT 'LIVE_OUT',
  availability_date TIMESTAMP(3),
  days_off TEXT[] DEFAULT ARRAY[]::TEXT[],
  overtime BOOLEAN NOT NULL DEFAULT false,
  holiday_work BOOLEAN NOT NULL DEFAULT false,
  visibility BOOLEAN NOT NULL DEFAULT false,
  profile_score INTEGER NOT NULL DEFAULT 0,
  kyc_status kyc_status NOT NULL DEFAULT 'NOT_STARTED',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL
);
```

### **Document Table**
```sql
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  type document_type NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  status document_status NOT NULL DEFAULT 'PENDING',
  verified_at TIMESTAMP(3),
  verified_by TEXT,
  rejection_reason TEXT,
  expires_at TIMESTAMP(3),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL
);
```

### **Reference Table**
```sql
CREATE TABLE references (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  company TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  duration TEXT,
  notes TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL
);
```

---

## 🔐 **Row Level Security (RLS) Policies**

### **Employee Profile Access Control**
- **Owner Access**: Employees can read, update, and delete their own profiles
- **Public Access**: Guests can view minimal public fields when profile is visible
- **Employer Access**: Subscribed employers can view extended fields including private information
- **Admin Access**: Administrators have full access to all profiles

### **Document Access Control**
- **Employee Access**: Can manage their own documents
- **Employer Access**: Can view documents if they have an active subscription
- **Admin Access**: Can manage all documents

### **Reference Access Control**
- **Employee Access**: Can manage their own references
- **Employer Access**: Can view references if they have an active subscription
- **Admin Access**: Can manage all references

---

## 🚀 **API Endpoints**

### **GET /api/employee-profile-m2**
Get current user's employee profile.

**Authentication**: Required (Employee role)

**Response**:
```json
{
  "userId": "user_123",
  "firstName": "Maria",
  "lastName": "Dela Cruz",
  "age": 28,
  "civilStatus": "SINGLE",
  "city": "Quezon City",
  "province": "Metro Manila",
  "exactAddress": "123 Main Street, Barangay 1",
  "phone": "+639171234567",
  "email": "maria@example.com",
  "skills": ["Cooking", "Cleaning", "Childcare"],
  "experience": 5,
  "headline": "Experienced housekeeper with 5 years of experience",
  "salaryMin": 8000,
  "salaryMax": 15000,
  "employmentType": "LIVE_OUT",
  "daysOff": ["Sunday", "Wednesday"],
  "overtime": true,
  "holidayWork": true,
  "visibility": true,
  "profileScore": 85,
  "kycStatus": "VERIFIED",
  "documents": [...],
  "references": [...]
}
```

### **POST /api/employee-profile-m2**
Create new employee profile.

**Authentication**: Required (Employee role)

**Request Body**:
```json
{
  "firstName": "Maria",
  "lastName": "Dela Cruz",
  "age": 28,
  "civilStatus": "SINGLE",
  "city": "Quezon City",
  "province": "Metro Manila",
  "exactAddress": "123 Main Street, Barangay 1",
  "phone": "+639171234567",
  "email": "maria@example.com",
  "skills": ["Cooking", "Cleaning", "Childcare"],
  "experience": 5,
  "headline": "Experienced housekeeper with 5 years of experience",
  "salaryMin": 8000,
  "salaryMax": 15000,
  "employmentType": "LIVE_OUT",
  "daysOff": ["Sunday", "Wednesday"],
  "overtime": true,
  "holidayWork": true,
  "visibility": true,
  "references": [...]
}
```

### **PUT /api/employee-profile-m2**
Update existing employee profile.

**Authentication**: Required (Employee role)

**Request Body**: Partial profile data (same structure as POST)

### **DELETE /api/employee-profile-m2**
Delete employee profile.

**Authentication**: Required (Employee role)

### **GET /api/employee-profile-m2/[id]**
Get public or extended profile by ID.

**Authentication**: Optional

**Access Control**:
- **Public**: Returns minimal fields if profile is visible
- **Subscribed Employer**: Returns extended fields including private information
- **Admin**: Returns all fields

---

## 🎨 **React Components**

### **EmployeeProfileFormM2**
Main multi-section form component for creating and editing employee profiles.

**Props**:
```typescript
interface EmployeeProfileFormM2Props {
  initialData?: Partial<EmployeeProfile>;
  onSubmit: (data: EmployeeProfile) => Promise<void>;
  onSaveDraft: (data: Partial<EmployeeProfile>) => Promise<void>;
  isLoading?: boolean;
}
```

**Features**:
- 5-step form navigation
- Real-time validation
- Profile completeness scoring
- Draft saving functionality
- Mobile-responsive design

### **SalarySlider**
Interactive salary range slider with live peso display.

**Props**:
```typescript
interface SalarySliderProps {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}
```

**Features**:
- Live peso value display
- Range validation
- Market insights
- Visual range indicators
- Mobile optimization

### **ToggleControls**
Toggle controls for work preferences and visibility.

**Props**:
```typescript
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
```

**Features**:
- Employment type selection
- Work preference toggles
- Profile visibility control
- Visual feedback
- Accessibility support

### **DocumentUpload**
Document upload component with status tracking.

**Props**:
```typescript
interface DocumentUploadProps {
  documentType: string;
  required: boolean;
  onUpload: (file: File) => Promise<void>;
  onDelete: (documentId: string) => void;
  onReupload: (documentId: string) => void;
  document?: Document;
  isUploading?: boolean;
  uploadProgress?: number;
  disabled?: boolean;
}
```

**Features**:
- Drag & drop upload
- File type validation
- Status tracking (pending, verified, rejected)
- Progress indicators
- Error handling

### **ProfileCompleteness**
Profile completeness scoring and progress tracking.

**Props**:
```typescript
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
```

**Features**:
- Real-time score calculation
- Section breakdown
- Progress visualization
- Completion guidance
- Interactive navigation

---

## 📝 **Form Validation**

### **Zod Schemas**
Comprehensive validation schemas for all form fields:

- **Basic Information**: Name, age, location, civil status
- **Professional Details**: Skills, experience, headline
- **Work Preferences**: Salary range, employment type, availability
- **Documents**: File uploads with type validation
- **References**: Professional references with contact validation

### **Validation Rules**
- **Phone Numbers**: Philippine format validation (+63XXXXXXXXXX)
- **Email**: Standard email format validation
- **Age**: 18-65 years range
- **Salary**: ₱3,000 - ₱50,000 range
- **Skills**: 3-10 skills required
- **References**: 1-3 references required

---

## 🧪 **Testing**

### **E2E Tests**
Comprehensive Playwright tests covering:

1. **Profile Creation Flow**
   - Complete form filling
   - Validation testing
   - Success confirmation

2. **Profile Update Flow**
   - Field updates
   - Real-time validation
   - Save confirmation

3. **Access Control Testing**
   - Employee can only access own profile
   - Proper error handling for unauthorized access

4. **Feature Testing**
   - Salary slider functionality
   - Toggle controls
   - Document upload
   - Profile completeness scoring

### **Test Coverage**
- ✅ Form validation
- ✅ API endpoints
- ✅ RLS policies
- ✅ Component interactions
- ✅ Error handling
- ✅ Mobile responsiveness

---

## 🔧 **Configuration**

### **Environment Variables**
```env
# Database
DATABASE_URL=postgresql://...

# Authentication
AUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# File Storage
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_ENDPOINT=your-r2-endpoint

# Payment Processing
STRIPE_SECRET_KEY=your-stripe-secret
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
```

### **Database Migration**
```bash
# Run migration
npx prisma migrate deploy

# Apply RLS policies
psql -d your_database -f prisma/rls-policies-m2.sql
```

---

## 🚀 **Deployment**

### **Prerequisites**
- Node.js 18+
- PostgreSQL 14+
- Cloudflare R2 or AWS S3
- Vercel account

### **Deployment Steps**
1. **Database Setup**
   ```bash
   npx prisma migrate deploy
   psql -d your_database -f prisma/rls-policies-m2.sql
   ```

2. **Environment Configuration**
   - Set all required environment variables
   - Configure R2/S3 storage
   - Set up authentication

3. **Deploy to Vercel**
   ```bash
   vercel deploy
   ```

4. **Verify Deployment**
   - Test API endpoints
   - Verify RLS policies
   - Run E2E tests

---

## 📊 **Performance Considerations**

### **Database Optimization**
- Proper indexing on frequently queried fields
- RLS policies optimized for performance
- Connection pooling

### **Frontend Optimization**
- Lazy loading of form sections
- Debounced validation
- Optimized re-renders
- Mobile-first responsive design

### **File Upload Optimization**
- Signed URLs for secure uploads
- File type and size validation
- Progress tracking
- Error handling and retry logic

---

## 🔒 **Security Features**

### **Data Protection**
- Row Level Security (RLS) policies
- Field-level access control
- Encrypted file storage
- Secure file uploads

### **Input Validation**
- Comprehensive Zod schemas
- Real-time validation
- SQL injection prevention
- XSS protection

### **Access Control**
- Role-based permissions
- Subscription-based access
- Owner-only modifications
- Admin oversight

---

## 📈 **Monitoring & Analytics**

### **Key Metrics**
- Profile completion rates
- Form abandonment points
- Upload success rates
- API response times

### **Error Tracking**
- Form validation errors
- API error responses
- File upload failures
- RLS policy violations

---

## 🎯 **Success Criteria**

### **Functional Requirements**
- ✅ Multi-section profile form
- ✅ Salary slider with live peso display
- ✅ Toggle controls for preferences
- ✅ Document upload with status tracking
- ✅ RLS policies properly enforced
- ✅ Form validation working correctly

### **Technical Requirements**
- ✅ Database migration successful
- ✅ API endpoints functional
- ✅ File uploads working
- ✅ RLS policies tested
- ✅ E2E tests passing
- ✅ Mobile responsive design

### **Quality Requirements**
- ✅ Accessibility compliance (WCAG 2.2 AA)
- ✅ Performance optimized
- ✅ Error handling complete
- ✅ User experience smooth
- ✅ Code quality high

---

## 🚀 **Next Steps**

1. **Deploy to Staging**
   - Set up staging environment
   - Configure all services
   - Run comprehensive tests

2. **User Acceptance Testing**
   - Test with real users
   - Gather feedback
   - Iterate on improvements

3. **Production Deployment**
   - Deploy to production
   - Monitor performance
   - Set up alerts

4. **Ongoing Maintenance**
   - Regular security updates
   - Performance monitoring
   - Feature enhancements

---

This implementation provides a complete, production-ready Employee Profile system with all requested features, proper security controls, and comprehensive testing! 🎉
