# Employee Profile Specification

## Profile Structure

### Public Fields (Visible to All)
- **Photo**: Profile picture with image optimization
- **First Name**: Display name (last name hidden for privacy)
- **Location**: City/Province only
- **Age**: Calculated from birth date
- **Civil Status**: Single, Married, Widowed, Divorced, Separated
- **Skills**: Array of housekeeping skills with tags
- **Employment Type**: Live-in, Live-out, or Both
- **Experience**: Years of experience in housekeeping
- **Headline**: Professional summary (max 200 characters)
- **Availability**: Available start date
- **Salary Range**: Min/Max salary with ₱ formatting

### Private Fields (Subscribed Employers Only)
- **Phone**: Contact number with formatting
- **Email**: Contact email address
- **Documents**: Uploaded documents with verification status
  - PhilSys ID (National ID)
  - PhilHealth ID
  - Pag-IBIG ID
  - Passport (if available)
  - NBI Clearance
  - Police Clearance
- **References**: Previous employer references
- **Exact Address**: Full address for verification

### Admin-Only Fields
- **Full ID Numbers**: Complete identification numbers
- **Verification Logs**: Document verification history
- **KYC Status**: Know Your Customer verification status
- **Profile Quality Score**: Automated scoring system

## Interactive Features

### Salary Slider
- **Live ₱ Value Display**: Shows current salary range as user drags
- **Range**: ₱3,000 - ₱30,000
- **Step**: ₱500 increments
- **Validation**: Max must be ≥ Min

### Toggle Controls
- **Overtime Work**: Yes/No toggle
- **Holiday Work**: Yes/No toggle
- **Visibility**: Public/Private profile toggle
- **Live-in Preference**: Live-in, Live-out, or Both

### Days Off Preference
- **Multi-select**: Monday through Sunday
- **Default**: Sunday (most common)
- **Visual**: Checkbox grid layout

### Document Upload System
- **File Types**: JPEG, PNG, PDF
- **Max Size**: 5MB per file
- **Status Indicators**: 
  - 🟡 Pending (yellow)
  - ✅ Verified (green)
  - ❌ Rejected (red)
- **Upload Progress**: Real-time upload status
- **Preview**: Document preview before upload

### KYC Status Display
- **Status Levels**:
  - 🔴 Not Started
  - 🟡 In Progress
  - 🟢 Verified
  - ⚫ Rejected
- **Progress Bar**: Shows completion percentage
- **Required Documents**: List of required docs
- **Next Steps**: What user needs to do next

## Profile Completeness Scoring

### Scoring System (0-100%)
- **Basic Info** (20%): Name, age, location, civil status
- **Professional** (25%): Skills, experience, headline
- **Preferences** (15%): Salary range, employment type, availability
- **Documents** (25%): Required documents uploaded
- **References** (10%): At least one reference provided
- **Contact** (5%): Phone and email verified

### Visual Indicators
- **Progress Bar**: Shows overall completeness
- **Section Scores**: Individual section completion
- **Missing Items**: List of what's needed to complete
- **Quality Badge**: "Complete Profile" when 100%

## Form Validation

### Required Fields
- First Name
- Age
- Civil Status
- Location (City/Province)
- Skills (at least 3)
- Experience (years)
- Salary Range
- Employment Type
- Phone Number
- Email Address

### Validation Rules
- **Name**: 2-50 characters, letters only
- **Age**: 18-65 years old
- **Phone**: Valid Philippine format (+63XXXXXXXXXX)
- **Email**: Valid email format
- **Skills**: Minimum 3, maximum 10
- **Experience**: 0-50 years
- **Salary**: Min ≤ Max, within reasonable range
- **Headline**: 10-200 characters

### Real-time Validation
- **Live Validation**: Validate as user types
- **Error Messages**: Clear, helpful error text
- **Success Indicators**: Green checkmarks for valid fields
- **Form State**: Track dirty/clean state

## Document Verification System

### Document Types & Requirements
1. **PhilSys ID (National ID)**
   - Required: Yes
   - Format: 13-digit number
   - Verification: Government database check

2. **PhilHealth ID**
   - Required: Yes
   - Format: XX-XXXXXXXXX-X
   - Verification: PhilHealth database check

3. **Pag-IBIG ID**
   - Required: Yes
   - Format: XXXX-XXXX-XXXX
   - Verification: Pag-IBIG database check

4. **Passport**
   - Required: No (if available)
   - Format: Standard passport number
   - Verification: DFA database check

5. **NBI Clearance**
   - Required: Yes
   - Format: NBI clearance certificate
   - Verification: NBI database check

6. **Police Clearance**
   - Required: Yes
   - Format: Police clearance certificate
   - Verification: PNP database check

### Verification Process
1. **Upload**: User uploads document
2. **Processing**: System processes and stores
3. **Review**: Admin reviews document
4. **Verification**: Admin verifies against databases
5. **Status Update**: User notified of result
6. **Re-upload**: If rejected, user can re-upload

### Status Indicators
- **Pending**: Document uploaded, awaiting review
- **Under Review**: Admin is reviewing document
- **Verified**: Document verified and approved
- **Rejected**: Document rejected with reason
- **Expired**: Document has expired (if applicable)

## Reference System

### Reference Fields
- **Name**: Full name of reference
- **Relationship**: Previous employer, colleague, etc.
- **Company**: Company name (if applicable)
- **Phone**: Contact number
- **Email**: Contact email
- **Duration**: How long they worked together
- **Notes**: Additional comments

### Reference Validation
- **Contact Info**: Verify phone/email format
- **Relationship**: Must be professional
- **Minimum**: At least one reference required
- **Maximum**: Up to 3 references allowed

## Profile Visibility Controls

### Visibility Levels
1. **Public**: Visible to all users (guests and employers)
2. **Private**: Visible only to subscribed employers
3. **Hidden**: Not visible to anyone (draft mode)

### Visibility Rules
- **Public Fields**: Always visible when profile is public
- **Private Fields**: Only visible to subscribed employers
- **Admin Fields**: Only visible to administrators
- **Draft Mode**: Profile not visible until published

## Mobile Optimization

### Responsive Design
- **Mobile-First**: Designed for mobile devices
- **Touch-Friendly**: Large touch targets
- **Swipe Gestures**: For image carousel
- **Collapsible Sections**: Save screen space
- **Fast Loading**: Optimized images and code

### Mobile-Specific Features
- **Camera Integration**: Take photos directly
- **File Picker**: Easy document upload
- **Location Services**: GPS for address
- **Offline Support**: Save drafts offline

## Accessibility Features

### WCAG 2.2 AA Compliance
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels
- **Color Contrast**: High contrast ratios
- **Focus Indicators**: Clear focus states
- **Alt Text**: Descriptive image alt text

### User Experience
- **Clear Labels**: Descriptive field labels
- **Help Text**: Contextual help information
- **Error Prevention**: Validate before submission
- **Success Feedback**: Clear success messages
- **Loading States**: Show progress indicators

## Data Privacy & Security

### Personal Data Protection
- **Minimal Collection**: Only necessary data
- **Consent**: Clear consent for data use
- **Retention**: Data retention policies
- **Deletion**: Right to data deletion
- **Encryption**: Data encrypted at rest and in transit

### Access Controls
- **Role-Based**: Different access levels
- **Audit Logs**: Track all access
- **Data Masking**: Hide sensitive data
- **Secure Storage**: Encrypted document storage
- **Regular Backups**: Automated backups

## Performance Requirements

### Loading Times
- **Initial Load**: <2 seconds
- **Image Upload**: <5 seconds
- **Form Submission**: <3 seconds
- **Document Processing**: <10 seconds

### Optimization
- **Image Compression**: Optimize uploaded images
- **Lazy Loading**: Load content as needed
- **Caching**: Cache frequently accessed data
- **CDN**: Use CDN for static assets
- **Database Indexing**: Optimize database queries

## Testing Requirements

### Unit Tests
- **Form Validation**: Test all validation rules
- **Component Logic**: Test component behavior
- **Utility Functions**: Test helper functions
- **API Endpoints**: Test profile API

### Integration Tests
- **User Flows**: Test complete user journeys
- **Document Upload**: Test file upload process
- **Profile Creation**: Test profile creation flow
- **Verification**: Test document verification

### E2E Tests
- **Profile Creation**: Complete profile creation
- **Document Upload**: Upload and verify documents
- **Profile Editing**: Edit existing profile
- **Visibility Toggle**: Test visibility controls

## Success Metrics

### User Engagement
- **Profile Completion Rate**: % of users who complete profile
- **Document Upload Rate**: % of users who upload documents
- **Verification Rate**: % of documents verified
- **Profile Views**: Number of profile views

### Quality Metrics
- **Profile Quality Score**: Average profile completeness
- **Verification Success Rate**: % of successful verifications
- **User Satisfaction**: User feedback scores
- **Error Rate**: Form submission errors

### Performance Metrics
- **Page Load Time**: Average page load time
- **Upload Success Rate**: % of successful uploads
- **Form Completion Time**: Time to complete profile
- **Mobile Performance**: Mobile-specific metrics
