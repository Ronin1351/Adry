# Adry - Housekeeper Hiring Platform

A specialized hiring platform focused on connecting housekeepers with employers in the Philippines. Built with Next.js, TypeScript, and Material-UI, featuring a paywall system where employers must subscribe to contact candidates.

## 🌟 Key Features

### For Housekeepers (Free)
- **Profile Creation**: Complete profile with skills, experience, and preferences
- **Document Verification**: Upload and verify PhilID, PhilHealth, Pag-IBIG, and other documents
- **Job Search**: Browse and apply to job opportunities
- **Messaging**: Receive messages from interested employers
- **Interview Scheduling**: Manage interview appointments

### For Employers (Subscription Required)
- **Free Browsing**: Search and view housekeeper profiles
- **Advanced Search**: Filter by location, skills, experience, salary range
- **Shortlist Management**: Save favorite candidates
- **Messaging**: Contact candidates (requires ₱600/3 months subscription)
- **Interview Scheduling**: Schedule and manage interviews
- **Document Access**: View verified documents

### For Administrators
- **User Management**: Approve and manage user accounts
- **Document Verification**: Review and verify uploaded documents
- **Payment Management**: Handle subscriptions and refunds
- **Content Moderation**: Review reported content
- **Analytics Dashboard**: Platform metrics and insights

## 🏗️ Technical Architecture

### Frontend
- **Next.js 14** with App Router and TypeScript
- **Material-UI (MUI)** for consistent, accessible design
- **Redux Toolkit** for state management
- **React Hook Form** with Yup validation
- **Server-Side Rendering** for SEO optimization

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Prisma ORM
- **JWT Authentication** with refresh tokens
- **Stripe Integration** for subscription payments
- **AWS S3** for file storage

### Database Schema
- **Users**: Authentication and role management
- **Employee Profiles**: Housekeeper profiles with Philippines-specific fields
- **Employer Profiles**: Employer information and preferences
- **Documents**: Document upload and verification system
- **Subscriptions**: Payment and subscription management
- **Messages**: Real-time messaging system
- **Interviews**: Interview scheduling and management
- **Shortlists**: Employer candidate management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd adry
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update the `.env.local` file with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/adry"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
   
   # Stripe
   STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
   
   # AWS S3
   AWS_ACCESS_KEY_ID="your_aws_access_key"
   AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
   AWS_REGION="us-east-1"
   AWS_S3_BUCKET="your-s3-bucket-name"
   
   # Email
   SENDGRID_API_KEY="your_sendgrid_api_key"
   FROM_EMAIL="noreply@adry.com"
   
   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXT_PUBLIC_API_URL="http://localhost:3001/api"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 User Journeys

### Housekeeper Journey
1. **Sign Up** → Email verification
2. **Create Profile** → Basic info, skills, experience, preferences
3. **Upload Documents** → PhilID, PhilHealth, Pag-IBIG verification
4. **Set Preferences** → Live-in/out, salary range, availability
5. **Publish Profile** → Become discoverable to employers

### Employer Journey
1. **Sign Up** → Email verification
2. **Browse Profiles** → Search and filter housekeepers
3. **View Details** → See full profile information
4. **Subscribe** → Pay ₱600/3 months to unlock messaging
5. **Contact & Hire** → Message candidates and schedule interviews

## 💰 Pricing Model

- **Housekeepers**: Free to create profiles and browse jobs
- **Employers**: ₱600 every 3 months to message and schedule interviews
- **Public**: Free to browse profiles with limited details

## 🔒 Security Features

- **Role-Based Access Control**: Admin, Employer, Employee roles
- **PostgreSQL RLS**: Row Level Security for sensitive data
- **Document Verification**: Secure document upload and verification
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API rate limiting to prevent abuse

## 📊 Key Metrics

### User Engagement
- Profile completion rate
- Document verification rate
- Search-to-contact conversion
- Subscription renewal rate

### Business Metrics
- Monthly recurring revenue (MRR)
- Customer acquisition cost (CAC)
- Lifetime value (LTV)
- Churn rate

## 🎨 Design System

### Color Palette
- **Primary**: Forest Green (#2E7D32) - Trust and reliability
- **Secondary**: Orange (#FF6F00) - Warmth and friendliness
- **Success**: Green (#4CAF50) - Verification and success
- **Warning**: Orange (#FF9800) - Alerts and notifications
- **Error**: Red (#F44336) - Errors and warnings

### Typography
- **Font Family**: Inter (primary), Roboto (fallback)
- **Headings**: Bold, hierarchical sizing
- **Body Text**: Readable, accessible contrast

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Business logic and utility functions
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Critical user flows
- **Accessibility Tests**: WCAG 2.2 AA compliance

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push to main

### Backend (Railway/Heroku)
1. Connect GitHub repository
2. Set environment variables
3. Configure database connection
4. Deploy

### Database
1. Set up PostgreSQL instance
2. Run migrations: `npx prisma db push`
3. Seed initial data if needed

## 📈 Performance

### Frontend Optimization
- Server-side rendering for SEO
- Image optimization with Next.js
- Code splitting and lazy loading
- CDN for static assets

### Backend Optimization
- Database indexing
- Redis caching
- API response compression
- Connection pooling

## 🔍 SEO Features

- **Server-Side Rendering**: All public pages are SSR
- **Meta Tags**: Dynamic meta tags for each profile
- **Structured Data**: JSON-LD for rich snippets
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Search engine directives

## 📱 Mobile Optimization

- **Mobile-First Design**: Responsive across all devices
- **Touch-Friendly**: Optimized for touch interactions
- **Fast Loading**: <2s load time on 4G
- **Offline Support**: Service worker for offline functionality

## 🌍 Philippines-Specific Features

### Document Types
- PhilID (Philippine ID)
- PhilHealth
- Pag-IBIG
- NBI Clearance
- Police Clearance
- Birth Certificate
- Marriage Certificate

### Location Support
- All 81 provinces
- Cities and municipalities
- Barangay-level addressing

### Language Support
- Tagalog
- English
- Regional languages (Cebuano, Ilocano, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@adry.com or create an issue in the GitHub repository.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Video interview integration
- [ ] Advanced analytics dashboard
- [ ] AI-powered candidate matching
- [ ] Multi-language support
- [ ] Background check integration
- [ ] Insurance and benefits management
- [ ] Payment processing for housekeepers

---

**Adry** - Connecting trusted housekeepers with families across the Philippines. 🇵🇭
