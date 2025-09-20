# Adry - Housekeeper Hiring Platform

## Project Overview
Adry is a specialized hiring platform focused on connecting housekeepers with employers in the Philippines. The platform features a paywall system where employers must subscribe to contact candidates, while employees can create profiles for free.

## Target Audience & Roles

### 1. Guests (Public Users)
- **Access**: Browse public profiles with limited details
- **Features**: Search, filter, view basic profile information
- **Restrictions**: Cannot contact candidates or view full details

### 2. Employees (Housekeepers)
- **Access**: Free profile creation and management
- **Features**: Complete profile setup, document upload, preference settings
- **Requirements**: Must verify email and complete profile to be discoverable

### 3. Employers (Household Employers)
- **Access**: Search and shortlist candidates for free
- **Subscription**: ₱600 every 3 months to message and schedule interviews
- **Features**: Advanced search, shortlist management, chat, interview scheduling

### 4. Admin
- **Access**: Full platform oversight
- **Features**: Content moderation, payment management, dispute resolution, analytics

## Core User Journeys

### Employee Journey
1. **Sign Up** → Email verification required
2. **Profile Creation**:
   - Basic Info: Photo, name, age, civil status, location
   - Contact: Phone number, email
   - Skills: Housekeeping specialties, languages, certifications
   - Experience: Work history, references
   - Documents: PhilID, PhilHealth, Pag-IBIG, passport (if available)
3. **Preferences Setup**:
   - Live-in/out preference
   - Salary range slider (₱ value display)
   - Availability date
   - Days off preferences
   - Overtime/holiday work toggles
4. **Publish Profile** → Become discoverable to employers

### Employer Journey
1. **Sign Up** → Email verification
2. **Search & Filter**:
   - Location-based search
   - Live-in/out preference
   - Skills and experience level
   - Salary range
   - Availability date
3. **Profile Viewing** → See detailed candidate information
4. **Paywall Gate** → Must subscribe to:
   - Send messages
   - Schedule interviews
   - View full contact details
5. **Subscription** → ₱600/3 months payment
6. **Unlock Features** → Full access to communication and scheduling

### Admin Journey
1. **Dashboard Access** → Overview of platform metrics
2. **Content Moderation** → Review and approve profiles
3. **Document Verification** → KYC and document review process
4. **Payment Management** → Handle subscriptions, refunds, disputes
5. **User Management** → Monitor user activity and resolve issues

## Paywall System

### Free Features (All Users)
- Browse public profiles
- Search and filter candidates
- View basic profile information
- Create and manage own profile (employees)

### Paid Features (Employer Subscription Required)
- Send messages to candidates
- Schedule interviews
- View full contact information
- Access to candidate documents
- Advanced search filters
- Shortlist management

### Subscription Rules
- **Active Subscription**: Full access to all paid features
- **Expired Subscription**: New messages blocked, existing threads read-only
- **Renewal**: Automatic renewal with payment method on file
- **Refunds**: Handled case-by-case through admin panel

## Database Schema

### Core Tables
- `users` - User accounts and authentication
- `employee_profiles` - Housekeeper profiles
- `employer_profiles` - Employer profiles
- `documents` - Uploaded documents (PhilID, PhilHealth, etc.)
- `subscriptions` - Employer subscription management
- `messages` - Chat system
- `interviews` - Interview scheduling
- `shortlists` - Employer candidate shortlists
- `verifications` - Document verification status

### Philippines-Specific Fields
- PhilID number and verification
- PhilHealth number and status
- Pag-IBIG number and contributions
- Passport information (if available)
- Location (province, city, barangay)
- Language proficiency (Tagalog, English, regional languages)

## Technical Requirements

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **UI Library**: Material-UI with custom Philippines theme
- **State Management**: Redux Toolkit
- **Forms**: React Hook Form with validation
- **SEO**: Server-side rendering for public profiles

### Backend
- **API**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with refresh tokens
- **File Storage**: AWS S3 for documents and photos
- **Payments**: Stripe integration
- **Email**: SendGrid for notifications

### Mobile & Performance
- **Mobile-First**: Responsive design optimized for mobile
- **Performance**: <2s load time on 4G
- **Accessibility**: WCAG 2.2 AA compliance
- **SEO**: Optimized for search engines

## Key Features

### Employee Dashboard
- Profile completeness indicator
- Document status with verification badges
- Chat inbox
- Interview schedule
- Visibility toggle
- Earnings tracking (if applicable)

### Employer Dashboard
- Advanced search with saved filters
- Shortlist management
- Subscription status and billing
- Chat interface
- Interview scheduler
- Payment history

### Admin Dashboard
- User management and moderation
- Content review and approval
- Document verification queue
- Payment and refund management
- Analytics and reporting
- Audit logs

### Public Features
- SEO-optimized profile listings
- Search and filter functionality
- Basic profile viewing
- Contact form (leads to subscription)

## Security & Compliance

### Data Protection
- PII minimization
- Secure document storage
- GDPR compliance for international users
- Local data protection laws compliance

### Payment Security
- PCI DSS compliance
- Secure payment processing
- Fraud detection
- Refund management

### Content Moderation
- Profile verification process
- Document authenticity checks
- User reporting system
- Admin review workflow

## Success Metrics

### User Engagement
- Profile completion rate
- Search-to-contact conversion
- Subscription renewal rate
- User retention metrics

### Business Metrics
- Monthly recurring revenue (MRR)
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- Churn rate

### Platform Health
- Profile verification rate
- Document approval time
- User satisfaction scores
- Support ticket resolution time

This specification provides a comprehensive foundation for building Adry as a specialized, Philippines-focused housekeeper hiring platform.
