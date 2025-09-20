# Employer Profile Specification

## 🎯 **Overview**

The Employer Profile system allows employers to create detailed profiles for hiring housekeepers, with different visibility levels for public and private information, plus comprehensive billing and subscription management.

---

## 📊 **Field Categories**

### **🔍 Required Fields (Public)**
These fields are visible to all employees and are required for profile creation:

- **Company/Household Name** (String, 2-100 chars)
  - Display name for the employer
  - Can be company name or household name
  - Required for all profiles

- **Contact Person Full Name** (String, 2-100 chars)
  - Full name of the primary contact person
  - Required for all profiles

- **Location** (Object)
  - **City** (String, 2-100 chars)
  - **Province** (String, 2-100 chars)
  - Required for all profiles

### **🔒 Private Fields (Chat/Interview Access)**
These fields are only visible to employees once the employer opens a chat or schedules an interview:

- **Contact Email** (String, valid email format)
  - Primary contact email address
  - Used for communication and notifications

- **Contact Phone** (String, Philippine phone format)
  - Primary contact phone number
  - Format: +63XXXXXXXXXX

### **📝 Optional Fields (Public)**
These fields are visible to all employees and help attract the right candidates:

- **About Text** (String, 0-500 chars)
  - Description of the household/workplace
  - What makes this a great place to work
  - Company culture or family values

- **Household/Workplace Size** (Enum)
  - **SMALL**: 1-3 people
  - **MEDIUM**: 4-6 people
  - **LARGE**: 7-10 people
  - **EXTRA_LARGE**: 10+ people

- **Preferred Arrangement** (Enum)
  - **LIVE_IN**: Live with employer
  - **LIVE_OUT**: Work during day only
  - **BOTH**: Open to either arrangement

- **Budget Range** (Object)
  - **Min Budget** (Integer, ₱3,000 - ₱50,000)
  - **Max Budget** (Integer, ₱3,000 - ₱50,000)
  - Displayed as "₱X,000 - ₱Y,000 per month"

### **📋 Requirements Checklist (Public)**
Boolean toggles for specific requirements:

- **Cooking** (Boolean)
  - Meal preparation and cooking skills required

- **Childcare** (Boolean)
  - Taking care of children required

- **Elderly Care** (Boolean)
  - Taking care of elderly family members

- **Driving** (Boolean)
  - Driving skills and valid license required

- **Pet Care** (Boolean)
  - Taking care of pets required

- **Housekeeping** (Boolean)
  - General housekeeping and cleaning

- **Laundry** (Boolean)
  - Laundry and ironing services

- **Gardening** (Boolean)
  - Garden maintenance and plant care

### **🌐 Language Requirements (Public)**
- **Primary Language** (Enum)
  - **TAGALOG**: Filipino/Tagalog
  - **ENGLISH**: English
  - **BOTH**: Both languages required

- **Additional Languages** (Array)
  - **BISAYA**: Cebuano/Bisaya
  - **ILOCANO**: Ilocano
  - **KAPAMPANGAN**: Kapampangan
  - **OTHER**: Other regional languages

### **📅 Work Schedule (Public)**
- **Days Off Offered** (Array)
  - **MONDAY**: Monday
  - **TUESDAY**: Tuesday
  - **WEDNESDAY**: Wednesday
  - **THURSDAY**: Thursday
  - **FRIDAY**: Friday
  - **SATURDAY**: Saturday
  - **SUNDAY**: Sunday

- **Work Hours** (Object)
  - **Start Time** (Time, HH:MM format)
  - **End Time** (Time, HH:MM format)
  - **Flexible Hours** (Boolean)

### **💰 Benefits & Policies (Public)**
- **SSS Contribution** (Enum)
  - **YES**: Employer contributes to SSS
  - **NO**: No SSS contribution
  - **OPTIONAL**: Employee can choose

- **PhilHealth Contribution** (Enum)
  - **YES**: Employer contributes to PhilHealth
  - **NO**: No PhilHealth contribution
  - **OPTIONAL**: Employee can choose

- **Pag-IBIG Contribution** (Enum)
  - **YES**: Employer contributes to Pag-IBIG
  - **NO**: No Pag-IBIG contribution
  - **OPTIONAL**: Employee can choose

- **13th Month Pay** (Boolean)
  - Whether 13th month pay is provided

- **Overtime Pay** (Boolean)
  - Whether overtime work is compensated

- **Holiday Pay** (Boolean)
  - Whether holiday work is compensated

### **🏠 Accommodation Details (Public, Live-in Only)**
- **Room Type** (Enum)
  - **PRIVATE_ROOM**: Private bedroom
  - **SHARED_ROOM**: Shared bedroom
  - **STUDIO**: Studio-type accommodation

- **Room Amenities** (Array)
  - **AIR_CONDITIONING**: Air conditioning
  - **FAN**: Electric fan
  - **WIFI**: WiFi internet
  - **CABLE_TV**: Cable television
  - **PRIVATE_BATHROOM**: Private bathroom
  - **SHARED_BATHROOM**: Shared bathroom
  - **KITCHEN_ACCESS**: Kitchen access
  - **LAUNDRY_ACCESS**: Laundry access

- **Meals Provided** (Enum)
  - **ALL_MEALS**: All meals provided
  - **BREAKFAST_ONLY**: Breakfast only
  - **LUNCH_DINNER**: Lunch and dinner
  - **NONE**: No meals provided

---

## 💳 **Billing & Subscription Fields**

### **Subscription Status**
- **Status** (Enum)
  - **ACTIVE**: Currently active subscription
  - **EXPIRED**: Subscription has expired
  - **CANCELED**: Subscription was canceled
  - **PAST_DUE**: Payment is overdue
  - **TRIAL**: In trial period

- **Expiry Date** (DateTime)
  - When the current subscription expires
  - Used for access control

- **Trial End Date** (DateTime, Optional)
  - When trial period ends (if applicable)

### **Billing History**
- **Billing Records** (Array of Objects)
  - **Date** (DateTime)
  - **Amount** (Decimal, in PHP)
  - **Provider** (String)
    - **STRIPE**: Stripe payment
    - **PAYPAL**: PayPal payment
    - **GCASH**: GCash payment
    - **BANK_TRANSFER**: Bank transfer
  - **Invoice Link** (String, URL)
  - **Status** (Enum)
    - **PAID**: Payment completed
    - **PENDING**: Payment pending
    - **FAILED**: Payment failed
    - **REFUNDED**: Payment refunded

### **Payment Method**
- **Provider** (String)
  - **STRIPE**: Stripe payment method
  - **PAYPAL**: PayPal account
  - **GCASH**: GCash wallet
  - **BANK**: Bank account

- **Provider Reference** (String)
  - External payment method ID
  - Used for recurring payments

- **Last 4 Digits** (String, Optional)
  - Last 4 digits of card/account
  - For display purposes only

---

## 🔐 **Access Control Matrix**

### **Public Access (All Employees)**
- Company/Household name
- Contact person full name
- Location (city/province)
- About text
- Household/workplace size
- Preferred arrangement
- Budget range
- Requirements checklist
- Language requirements
- Work schedule
- Benefits & policies
- Accommodation details

### **Private Access (Chat/Interview Only)**
- Contact email
- Contact phone

### **Admin Access (Administrators Only)**
- All billing information
- Subscription details
- Payment history
- Provider references

### **Owner Access (Employer Only)**
- All fields can be read and updated
- Cannot access other employers' profiles

---

## 📱 **User Interface Requirements**

### **Profile Creation Form**
- **Step 1**: Basic Information (Required fields)
- **Step 2**: Job Details (Requirements, budget, schedule)
- **Step 3**: Benefits & Policies
- **Step 4**: Accommodation (if live-in)
- **Step 5**: Contact Information (Private fields)

### **Profile Display**
- **Public View**: All public fields visible
- **Private View**: Public + private fields (when chat/interview active)
- **Admin View**: All fields including billing information

### **Billing Dashboard**
- **Subscription Status**: Current status and expiry
- **Payment History**: List of all payments
- **Invoice Downloads**: Download PDF invoices
- **Payment Method**: Manage payment methods
- **Renewal**: Renew subscription

---

## 🎨 **Visual Design Elements**

### **Profile Cards**
- **Company Name**: Prominent display
- **Location**: City, Province
- **Budget Range**: "₱X,000 - ₱Y,000/month"
- **Requirements**: Badge-style tags
- **Benefits**: Icon-based display

### **Requirements Display**
- **Checklist Items**: Checkmark icons
- **Language Requirements**: Flag icons
- **Work Schedule**: Calendar-style display
- **Benefits**: Icon + text format

### **Budget Display**
- **Range Slider**: Visual budget range
- **Live Updates**: Real-time peso display
- **Market Comparison**: "Above/Below average" indicators

---

## 🔧 **Technical Implementation**

### **Database Schema**
```sql
-- Employer profiles table
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

-- Subscription table
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  employer_id TEXT NOT NULL,
  status subscription_status NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Billing history table
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

### **API Endpoints**
- `GET /api/employer-profile` - Get current employer's profile
- `POST /api/employer-profile` - Create new profile
- `PUT /api/employer-profile` - Update profile
- `GET /api/employer-profile/[id]` - Get public profile by ID
- `GET /api/employer-profile/billing` - Get billing information
- `POST /api/employer-profile/subscribe` - Subscribe to service

### **Validation Rules**
- **Company Name**: 2-100 characters, required
- **Contact Person**: 2-100 characters, required
- **Location**: City and province required
- **Email**: Valid email format (private field)
- **Phone**: Philippine format (+63XXXXXXXXXX)
- **Budget**: Min ≤ Max, both within ₱3,000-₱50,000 range
- **About Text**: Max 500 characters

---

## 🧪 **Testing Requirements**

### **Unit Tests**
- Form validation for all fields
- Budget range validation
- Requirements checklist logic
- Language requirements handling

### **Integration Tests**
- Profile creation flow
- Public/private field access
- Billing integration
- Subscription management

### **E2E Tests**
- Complete profile creation
- Public profile viewing
- Private field access (chat/interview)
- Billing dashboard functionality
- Subscription renewal flow

---

## 📊 **Success Metrics**

### **Profile Completion**
- Profile completion rate
- Time to complete profile
- Field completion by section

### **Engagement**
- Profile views by employees
- Chat initiation rate
- Interview scheduling rate

### **Billing**
- Subscription conversion rate
- Payment success rate
- Churn rate

---

This specification provides a comprehensive foundation for implementing the Employer Profile system with proper access control, billing integration, and user experience considerations! 🎉
