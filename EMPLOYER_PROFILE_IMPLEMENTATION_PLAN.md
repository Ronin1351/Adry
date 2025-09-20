# Employer Profile Implementation Plan - Milestone M3

## 🎯 **Objective**
Implement a comprehensive Employer Profile system with subscription management, payment integration, and paywall enforcement for chat and interview features.

---

## 📋 **Implementation Tasks**

### **1. Database Schema & Validation (M3-1)**
**Priority: High | Estimated: 6 hours**

#### **1.1 Prisma Models**
- [ ] Create `EmployerProfile` model with all required fields
- [ ] Create `Subscription` model for billing management
- [ ] Create `BillingHistory` model for payment records
- [ ] Create `PaymentMethod` model for stored payment methods
- [ ] Add enums for all status types and categories

#### **1.2 Zod Schemas**
- [ ] Create comprehensive validation schemas for employer profiles
- [ ] Create subscription validation schemas
- [ ] Create billing history validation schemas
- [ ] Add Philippine-specific validation rules

#### **1.3 Database Migration**
- [ ] Create migration script for all tables
- [ ] Add proper indexes for performance
- [ ] Set up foreign key relationships
- [ ] Test migration on development database

**Deliverables:**
- Complete Prisma schema
- Comprehensive Zod validation schemas
- Database migration script
- Validation test suite

---

### **2. RLS Policies & Security (M3-2)**
**Priority: High | Estimated: 4 hours**

#### **2.1 Row Level Security Policies**
- [ ] Create RLS policies for `employer_profiles` table
- [ ] Create RLS policies for `subscriptions` table
- [ ] Create RLS policies for `billing_history` table
- [ ] Implement field-level access control

#### **2.2 Access Control Matrix**
- [ ] Public fields (visible to all employees)
- [ ] Private fields (visible only in chat/interview)
- [ ] Admin fields (visible only to administrators)
- [ ] Owner fields (visible only to profile owner)

#### **2.3 Security Functions**
- [ ] Create helper functions for access control
- [ ] Implement subscription status checking
- [ ] Add role-based permission functions
- [ ] Test all security policies

**Deliverables:**
- Complete RLS policies
- Access control functions
- Security test suite
- Policy documentation

---

### **3. API Endpoints (M3-3)**
**Priority: High | Estimated: 5 hours**

#### **3.1 Profile CRUD Endpoints**
- [ ] `GET /api/employer-profile` - Get current employer's profile
- [ ] `POST /api/employer-profile` - Create new profile
- [ ] `PUT /api/employer-profile` - Update existing profile
- [ ] `DELETE /api/employer-profile` - Delete profile

#### **3.2 Public Profile Endpoints**
- [ ] `GET /api/employer-profile/[id]` - Get public profile by ID
- [ ] `GET /api/employer-profile/search` - Search employer profiles
- [ ] `GET /api/employer-profile/featured` - Get featured profiles

#### **3.3 Billing & Subscription Endpoints**
- [ ] `GET /api/employer-profile/billing` - Get billing information
- [ ] `POST /api/employer-profile/subscribe` - Create subscription
- [ ] `PUT /api/employer-profile/subscribe` - Update subscription
- [ ] `DELETE /api/employer-profile/subscribe` - Cancel subscription

#### **3.4 Payment Endpoints**
- [ ] `POST /api/employer-profile/payment-method` - Add payment method
- [ ] `GET /api/employer-profile/payment-methods` - List payment methods
- [ ] `DELETE /api/employer-profile/payment-method/[id]` - Remove payment method

**Deliverables:**
- Complete API endpoint implementation
- Request/response validation
- Error handling and status codes
- API documentation

---

### **4. Payment Integration (M3-4)**
**Priority: High | Estimated: 8 hours**

#### **4.1 Stripe Integration**
- [ ] Set up Stripe configuration
- [ ] Create Stripe customer management
- [ ] Implement subscription creation
- [ ] Handle Stripe webhooks
- [ ] Create invoice generation

#### **4.2 PayPal Integration**
- [ ] Set up PayPal SDK
- [ ] Create PayPal subscription management
- [ ] Handle PayPal webhooks
- [ ] Implement PayPal billing

#### **4.3 GCash Integration**
- [ ] Set up GCash gateway (via Xendit/PayMongo)
- [ ] Create GCash payment processing
- [ ] Handle GCash webhooks
- [ ] Implement GCash billing

#### **4.4 Webhook Handling**
- [ ] Create webhook endpoint for all providers
- [ ] Implement webhook verification
- [ ] Handle subscription activation/deactivation
- [ ] Update billing status in database

**Deliverables:**
- Complete payment integration
- Webhook handling system
- Payment provider configuration
- Billing automation

---

### **5. Employer Dashboard (M3-5)**
**Priority: High | Estimated: 10 hours**

#### **5.1 Dashboard Layout**
- [ ] Create main dashboard layout
- [ ] Add navigation sidebar
- [ ] Implement responsive design
- [ ] Add user profile section

#### **5.2 Profile Management**
- [ ] Create profile setup form
- [ ] Add profile editing interface
- [ ] Implement image upload for company logo
- [ ] Add profile preview functionality

#### **5.3 Subscription Management**
- [ ] Create subscription status display
- [ ] Add subscription renewal interface
- [ ] Implement subscription cancellation
- [ ] Add trial period management

#### **5.4 Billing Dashboard**
- [ ] Create billing history table
- [ ] Add invoice download functionality
- [ ] Implement payment method management
- [ ] Add billing analytics

#### **5.5 Dashboard Components**
- [ ] Create `EmployerDashboard` main component
- [ ] Create `ProfileSetup` component
- [ ] Create `SubscriptionStatus` component
- [ ] Create `BillingHistory` component
- [ ] Create `PaymentMethods` component

**Deliverables:**
- Complete employer dashboard
- Profile management interface
- Subscription management system
- Billing dashboard

---

### **6. Paywall Enforcement (M3-6)**
**Priority: High | Estimated: 6 hours**

#### **6.1 Chat Paywall**
- [ ] Create chat access control middleware
- [ ] Implement subscription status checking
- [ ] Add paywall UI for non-subscribers
- [ ] Create subscription prompt component

#### **6.2 Interview Scheduling Paywall**
- [ ] Create interview access control
- [ ] Implement scheduling restrictions
- [ ] Add paywall UI for interview scheduling
- [ ] Create subscription prompt for interviews

#### **6.3 Read-Only Mode**
- [ ] Implement read-only chat for expired subscriptions
- [ ] Add expired subscription UI
- [ ] Create renewal prompt
- [ ] Handle subscription reactivation

#### **6.4 Paywall Components**
- [ ] Create `PaywallGate` component
- [ ] Create `SubscriptionPrompt` component
- [ ] Create `ExpiredSubscription` component
- [ ] Create `RenewalPrompt` component

**Deliverables:**
- Complete paywall system
- Chat access control
- Interview scheduling restrictions
- Read-only mode implementation

---

### **7. Chat System Integration (M3-7)**
**Priority: Medium | Estimated: 4 hours**

#### **7.1 Chat Access Control**
- [ ] Integrate paywall with chat system
- [ ] Add subscription validation to chat routes
- [ ] Implement chat creation restrictions
- [ ] Add subscription status to chat context

#### **7.2 Read-Only Chat Mode**
- [ ] Implement read-only mode for expired subscriptions
- [ ] Add visual indicators for read-only status
- [ ] Disable message sending in read-only mode
- [ ] Add renewal prompts in chat

#### **7.3 Chat UI Updates**
- [ ] Add subscription status to chat header
- [ ] Create paywall overlay for non-subscribers
- [ ] Add renewal prompts in chat interface
- [ ] Implement chat access validation

**Deliverables:**
- Chat paywall integration
- Read-only chat mode
- Chat UI updates
- Access control validation

---

### **8. Interview Scheduling Integration (M3-8)**
**Priority: Medium | Estimated: 4 hours**

#### **8.1 Interview Access Control**
- [ ] Integrate paywall with interview system
- [ ] Add subscription validation to interview routes
- [ ] Implement interview creation restrictions
- [ ] Add subscription status to interview context

#### **8.2 Interview Scheduling UI**
- [ ] Add paywall overlay for non-subscribers
- [ ] Create subscription prompt for interviews
- [ ] Add renewal prompts in interview interface
- [ ] Implement interview access validation

#### **8.3 Interview Management**
- [ ] Add subscription status to interview management
- [ ] Create interview restrictions for expired subscriptions
- [ ] Add renewal prompts for interview features
- [ ] Implement interview access control

**Deliverables:**
- Interview paywall integration
- Interview scheduling restrictions
- Interview UI updates
- Access control validation

---

### **9. Subscription Management System (M3-9)**
**Priority: High | Estimated: 6 hours**

#### **9.1 Subscription Lifecycle**
- [ ] Create subscription creation flow
- [ ] Implement subscription activation
- [ ] Add subscription renewal process
- [ ] Create subscription cancellation flow

#### **9.2 Subscription Status Management**
- [ ] Implement status tracking
- [ ] Add expiration handling
- [ ] Create trial period management
- [ ] Add subscription reactivation

#### **9.3 Billing Automation**
- [ ] Create automatic billing
- [ ] Implement payment retry logic
- [ ] Add dunning management
- [ ] Create subscription notifications

#### **9.4 Subscription Components**
- [ ] Create `SubscriptionManager` component
- [ ] Create `SubscriptionStatus` component
- [ ] Create `RenewalInterface` component
- [ ] Create `CancellationFlow` component

**Deliverables:**
- Complete subscription management
- Billing automation
- Status tracking system
- Subscription components

---

### **10. Testing & Quality Assurance (M3-10)**
**Priority: High | Estimated: 8 hours**

#### **10.1 Unit Tests**
- [ ] Test Prisma models and relationships
- [ ] Test Zod validation schemas
- [ ] Test RLS policies
- [ ] Test API endpoints

#### **10.2 Integration Tests**
- [ ] Test payment integration
- [ ] Test webhook handling
- [ ] Test subscription management
- [ ] Test paywall enforcement

#### **10.3 E2E Tests**
- [ ] Test complete employer profile creation
- [ ] Test subscription signup flow
- [ ] Test paywall enforcement
- [ ] Test billing management

#### **10.4 Security Tests**
- [ ] Test RLS policy enforcement
- [ ] Test access control validation
- [ ] Test payment security
- [ ] Test webhook security

**Deliverables:**
- Comprehensive test suite
- Security test coverage
- E2E test scenarios
- Quality assurance report

---

## 🔧 **Technical Architecture**

### **Database Schema**
```sql
-- Employer profiles
CREATE TABLE employer_profiles (
  user_id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  about_text TEXT,
  household_size household_size,
  preferred_arrangement preferred_arrangement,
  budget_min INTEGER,
  budget_max INTEGER,
  requirements JSONB DEFAULT '{}',
  language_requirements JSONB DEFAULT '{}',
  work_schedule JSONB DEFAULT '{}',
  benefits_policies JSONB DEFAULT '{}',
  accommodation_details JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  employer_id TEXT NOT NULL,
  status subscription_status NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Billing history
CREATE TABLE billing_history (
  id TEXT PRIMARY KEY,
  employer_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  provider TEXT NOT NULL,
  invoice_url TEXT,
  status payment_status NOT NULL,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **API Architecture**
```
/api/employer-profile/
├── GET /                    # Get current profile
├── POST /                   # Create profile
├── PUT /                    # Update profile
├── DELETE /                 # Delete profile
├── GET /[id]                # Get public profile
├── GET /search              # Search profiles
├── GET /billing             # Get billing info
├── POST /subscribe          # Create subscription
├── PUT /subscribe           # Update subscription
├── DELETE /subscribe        # Cancel subscription
├── POST /payment-method     # Add payment method
├── GET /payment-methods     # List payment methods
└── DELETE /payment-method/[id] # Remove payment method
```

### **Paywall Architecture**
```
Paywall System
├── Chat Access Control
│   ├── Subscription validation
│   ├── Paywall UI
│   └── Read-only mode
├── Interview Access Control
│   ├── Scheduling restrictions
│   ├── Paywall UI
│   └── Access validation
└── Subscription Management
    ├── Status tracking
    ├── Renewal process
    └── Cancellation flow
```

---

## 🎯 **Success Criteria**

### **Functional Requirements**
- [ ] Complete employer profile creation and management
- [ ] Subscription signup and management
- [ ] Payment integration with all providers
- [ ] Paywall enforcement for chat and interviews
- [ ] Read-only mode for expired subscriptions
- [ ] Billing history and invoice management

### **Technical Requirements**
- [ ] RLS policies properly enforced
- [ ] API endpoints functional and secure
- [ ] Payment webhooks working correctly
- [ ] Database schema optimized
- [ ] All tests passing

### **User Experience Requirements**
- [ ] Intuitive dashboard interface
- [ ] Clear subscription status display
- [ ] Easy payment method management
- [ ] Smooth paywall experience
- [ ] Mobile-responsive design

---

## 📅 **Timeline**

| Task | Duration | Dependencies |
|------|----------|--------------|
| Database Schema & Validation | 6 hours | - |
| RLS Policies & Security | 4 hours | Database Schema |
| API Endpoints | 5 hours | RLS Policies |
| Payment Integration | 8 hours | API Endpoints |
| Employer Dashboard | 10 hours | API Endpoints |
| Paywall Enforcement | 6 hours | Payment Integration |
| Chat System Integration | 4 hours | Paywall Enforcement |
| Interview Scheduling Integration | 4 hours | Paywall Enforcement |
| Subscription Management | 6 hours | Payment Integration |
| Testing & QA | 8 hours | All previous tasks |

**Total Estimated Time: 61 hours**

---

## 🚀 **Next Steps**

1. **Start with Database Schema** - Foundation for all other features
2. **Implement RLS Policies** - Security foundation
3. **Create API Endpoints** - Backend functionality
4. **Integrate Payment Systems** - Revenue generation
5. **Build Employer Dashboard** - User interface
6. **Implement Paywall System** - Access control
7. **Integrate with Chat/Interview** - Feature restrictions
8. **Add Subscription Management** - Business logic
9. **Comprehensive Testing** - Quality assurance
10. **Deploy and Monitor** - Production readiness

This plan provides a complete roadmap for implementing the Employer Profile system with subscription management, payment integration, and paywall enforcement! 🎉
