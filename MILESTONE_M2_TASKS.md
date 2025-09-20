# Milestone M2: Employee Profile - Task Breakdown

## 🎯 **Objective**
Implement a comprehensive Employee Profile system with multi-section forms, document uploads, salary sliders, and proper access control through RLS policies.

---

## 📋 **Task List**

### **1. Database Migration & Schema** 
**Priority: High | Estimated: 4 hours**

#### **1.1 Create Migration Script**
- [ ] Create `prisma/migrations/xxx_add_employee_profiles.sql`
- [ ] Include all required fields from specification
- [ ] Add proper indexes for performance
- [ ] Include foreign key constraints

#### **1.2 Update Prisma Schema**
- [ ] Verify `EmployeeProfile` model has all fields
- [ ] Add `Document` and `Reference` models
- [ ] Update enums (CivilStatus, EmploymentType, KYCStatus, etc.)
- [ ] Test schema generation

#### **1.3 Run Migration**
- [ ] Execute migration on development database
- [ ] Verify table structure and constraints
- [ ] Test data insertion and retrieval
- [ ] Create rollback script if needed

**Deliverables:**
- Migration script
- Updated Prisma schema
- Database with employee_profiles table
- Verification tests

---

### **2. RLS Policies Implementation**
**Priority: High | Estimated: 3 hours**

#### **2.1 Create RLS Policies**
- [ ] Implement field-level access control policies
- [ ] Public fields (visible to all)
- [ ] Private fields (subscribed employers only)
- [ ] Admin-only fields (administrators only)
- [ ] Owner can update own profile

#### **2.2 Test RLS Policies**
- [ ] Test public access (guests)
- [ ] Test employee access (own profile)
- [ ] Test employer access (with/without subscription)
- [ ] Test admin access (all fields)
- [ ] Verify data isolation

#### **2.3 Create Helper Functions**
- [ ] `has_active_subscription(user_id)` function
- [ ] `is_admin(user_id)` function
- [ ] `is_employer(user_id)` function
- [ ] `is_employee(user_id)` function

**Deliverables:**
- RLS policies SQL script
- Helper functions
- RLS test suite
- Access control verification

---

### **3. Multi-Section Profile Form**
**Priority: High | Estimated: 6 hours**

#### **3.1 Form Structure**
- [ ] Create `EmployeeProfileForm` component
- [ ] Implement 5-step form navigation
- [ ] Add progress indicator
- [ ] Create step validation

#### **3.2 Personal Information Section**
- [ ] Basic info form (name, age, civil status)
- [ ] Location fields (city, province, exact address)
- [ ] Contact info (phone, email)
- [ ] Form validation and error handling

#### **3.3 Work Preferences Section**
- [ ] Skills selection (multi-select with validation)
- [ ] Experience input (years)
- [ ] Professional headline (textarea)
- [ ] Employment type selection

#### **3.4 Document Upload Section**
- [ ] Document type selection
- [ ] File upload interface
- [ ] Upload progress tracking
- [ ] Status indicators (pending, verified, rejected)

#### **3.5 References Section**
- [ ] Reference form (1-3 references)
- [ ] Dynamic add/remove references
- [ ] Reference validation
- [ ] Contact information for references

**Deliverables:**
- Complete multi-section form
- Form validation
- Step navigation
- Error handling

---

### **4. Salary Slider Component**
**Priority: High | Estimated: 3 hours**

#### **4.1 Salary Slider Implementation**
- [ ] Create `SalarySlider` component
- [ ] Implement dual-range slider
- [ ] Live peso value display
- [ ] Range validation (min ≤ max)

#### **4.2 Visual Features**
- [ ] Color-coded range indicators
- [ ] Market insights display
- [ ] Step increments (₱500)
- [ ] Responsive design

#### **4.3 Integration**
- [ ] Connect to form state
- [ ] Real-time validation
- [ ] Error handling
- [ ] Mobile optimization

**Deliverables:**
- SalarySlider component
- Live peso display
- Range validation
- Mobile-responsive design

---

### **5. Toggle Controls**
**Priority: Medium | Estimated: 2 hours**

#### **5.1 Toggle Components**
- [ ] Overtime work toggle
- [ ] Holiday work toggle
- [ ] Profile visibility toggle
- [ ] Live-in preference toggle

#### **5.2 Visual Design**
- [ ] Consistent toggle styling
- [ ] Clear labels and descriptions
- [ ] Icon integration
- [ ] Accessibility support

#### **5.3 Form Integration**
- [ ] Connect to form state
- [ ] Validation handling
- [ ] Default values
- [ ] Error states

**Deliverables:**
- Toggle components
- Form integration
- Accessibility compliance
- Visual consistency

---

### **6. Document Upload System**
**Priority: High | Estimated: 5 hours**

#### **6.1 Upload Interface**
- [ ] Drag & drop file upload
- [ ] File type validation (JPEG, PNG, PDF)
- [ ] File size validation (5MB max)
- [ ] Upload progress indicators

#### **6.2 Status Tracking**
- [ ] Pending status (yellow)
- [ ] Verified status (green checkmark)
- [ ] Rejected status (red X)
- [ ] Under review status (yellow clock)

#### **6.3 File Management**
- [ ] Document preview
- [ ] Re-upload functionality
- [ ] Delete documents
- [ ] File metadata display

#### **6.4 Signed URL Integration**
- [ ] Generate signed URLs for uploads
- [ ] Handle upload completion
- [ ] Error handling and retry
- [ ] File cleanup

**Deliverables:**
- Document upload component
- Status tracking system
- File management features
- Signed URL integration

---

### **7. API Endpoints**
**Priority: High | Estimated: 4 hours**

#### **7.1 Profile CRUD Endpoints**
- [ ] `GET /api/employee-profile` - Get current user's profile
- [ ] `POST /api/employee-profile` - Create new profile
- [ ] `PUT /api/employee-profile` - Update existing profile
- [ ] `DELETE /api/employee-profile` - Delete profile

#### **7.2 Public Access Endpoints**
- [ ] `GET /api/employee-profile/[id]` - Get public/extended profile
- [ ] `GET /api/employee-profile/search` - Search profiles

#### **7.3 Upload Endpoints**
- [ ] `POST /api/upload/profile-image` - Profile image upload
- [ ] `POST /api/upload/document` - Document upload

#### **7.4 RLS Enforcement**
- [ ] Implement RLS in API routes
- [ ] Field-level access control
- [ ] Subscription validation
- [ ] Error handling

**Deliverables:**
- Complete API endpoints
- RLS enforcement
- Error handling
- API documentation

---

### **8. Form Validation**
**Priority: High | Estimated: 3 hours**

#### **8.1 Zod Schemas**
- [ ] Complete validation schemas
- [ ] Field-specific validation rules
- [ ] Cross-field validation
- [ ] Error message customization

#### **8.2 Real-time Validation**
- [ ] Live validation on input
- [ ] Error display and clearing
- [ ] Form state management
- [ ] Validation feedback

#### **8.3 Validation Rules**
- [ ] Philippine phone format validation
- [ ] Email format validation
- [ ] Age range validation (18-65)
- [ ] Salary range validation
- [ ] Skills count validation (3-10)
- [ ] References count validation (1-3)

**Deliverables:**
- Comprehensive validation schemas
- Real-time validation
- Error handling
- User-friendly messages

---

### **9. Profile Completeness System**
**Priority: Medium | Estimated: 3 hours**

#### **9.1 Scoring Algorithm**
- [ ] Calculate completeness score (0-100%)
- [ ] Section-based scoring
- [ ] Real-time score updates
- [ ] Score breakdown display

#### **9.2 Visual Indicators**
- [ ] Progress bar component
- [ ] Section completion indicators
- [ ] Missing items highlighting
- [ ] Quality badges

#### **9.3 Integration**
- [ ] Connect to form state
- [ ] Real-time updates
- [ ] Score persistence
- [ ] Completion guidance

**Deliverables:**
- Profile completeness component
- Scoring algorithm
- Visual indicators
- Real-time updates

---

### **10. Staging Deployment**
**Priority: High | Estimated: 2 hours**

#### **10.1 Environment Setup**
- [ ] Configure staging environment
- [ ] Set up database connection
- [ ] Configure R2/S3 storage
- [ ] Set environment variables

#### **10.2 Deployment Process**
- [ ] Build application
- [ ] Run database migrations
- [ ] Deploy to staging
- [ ] Verify deployment

#### **10.3 Configuration**
- [ ] Database connection
- [ ] Storage configuration
- [ ] Authentication setup
- [ ] Error monitoring

**Deliverables:**
- Staging environment
- Deployed application
- Environment configuration
- Deployment verification

---

### **11. Testing & Quality Assurance**
**Priority: High | Estimated: 4 hours**

#### **11.1 Unit Tests**
- [ ] Form validation tests
- [ ] Component logic tests
- [ ] API endpoint tests
- [ ] Utility function tests

#### **11.2 Integration Tests**
- [ ] Profile creation flow
- [ ] Document upload flow
- [ ] Form submission flow
- [ ] RLS policy tests

#### **11.3 E2E Tests**
- [ ] Complete profile creation
- [ ] Document upload and verification
- [ ] Profile editing
- [ ] Visibility toggle

#### **11.4 Manual Testing**
- [ ] Test all form sections
- [ ] Test validation messages
- [ ] Test file uploads
- [ ] Test RLS access control

**Deliverables:**
- Test suite
- Test results
- Bug reports
- Quality assurance report

---

### **12. Documentation**
**Priority: Medium | Estimated: 2 hours**

#### **12.1 API Documentation**
- [ ] Document all endpoints
- [ ] Request/response examples
- [ ] Error codes and messages
- [ ] Authentication requirements

#### **12.2 Component Documentation**
- [ ] Component props and usage
- [ ] Form validation rules
- [ ] Styling guidelines
- [ ] Accessibility notes

#### **12.3 User Guide**
- [ ] Profile creation guide
- [ ] Document upload instructions
- [ ] Troubleshooting guide
- [ ] FAQ section

**Deliverables:**
- API documentation
- Component documentation
- User guide
- Troubleshooting guide

---

## 🎯 **Success Criteria**

### **Functional Requirements**
- [ ] Complete multi-section profile form
- [ ] Salary slider with live peso display
- [ ] Toggle controls for preferences
- [ ] Document upload with status feedback
- [ ] RLS policies properly enforced
- [ ] Form validation working correctly

### **Technical Requirements**
- [ ] Database migration successful
- [ ] API endpoints functional
- [ ] File uploads working
- [ ] RLS policies tested
- [ ] Staging deployment successful
- [ ] All tests passing

### **Quality Requirements**
- [ ] Mobile-responsive design
- [ ] Accessibility compliance
- [ ] Performance optimized
- [ ] Error handling complete
- [ ] User experience smooth
- [ ] Code quality high

---

## 📅 **Timeline**

| Task | Duration | Dependencies |
|------|----------|--------------|
| Database Migration | 4 hours | - |
| RLS Policies | 3 hours | Database Migration |
| Profile Form | 6 hours | Database Migration |
| Salary Slider | 3 hours | Profile Form |
| Toggle Controls | 2 hours | Profile Form |
| Document Upload | 5 hours | Database Migration |
| API Endpoints | 4 hours | RLS Policies |
| Form Validation | 3 hours | Profile Form |
| Profile Completeness | 3 hours | Profile Form |
| Staging Deployment | 2 hours | All previous tasks |
| Testing | 4 hours | Staging Deployment |
| Documentation | 2 hours | Testing |

**Total Estimated Time: 41 hours**

---

## 🚀 **Next Steps**

1. **Start with Database Migration** - Foundation for all other tasks
2. **Implement RLS Policies** - Security foundation
3. **Build Profile Form** - Core functionality
4. **Add Interactive Components** - Salary slider, toggles
5. **Implement Document Upload** - File handling
6. **Create API Endpoints** - Backend integration
7. **Add Validation** - Data integrity
8. **Deploy to Staging** - Testing environment
9. **Comprehensive Testing** - Quality assurance
10. **Documentation** - Knowledge transfer

This milestone will deliver a complete, functional Employee Profile system with all requested features and proper security controls! 🎉
