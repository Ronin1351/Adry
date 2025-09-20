# Adry - Housekeeper Hiring Platform

A modern, scalable platform connecting housekeepers with employers in the Philippines. Built with Next.js 14, TypeScript, and a comprehensive tech stack optimized for performance, security, and user experience.

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API routes + tRPC + NextAuth.js
- **Database**: PostgreSQL (Neon/Supabase) + Prisma ORM + Row Level Security
- **Search**: Meilisearch for fast profile search
- **Storage**: Cloudflare R2 for file storage
- **Payments**: Stripe + PayPal + GCash integration
- **Deployment**: Vercel + Neon + Cloudflare

### Project Structure
```
adry/
├── apps/
│   └── web/                    # Next.js 14 application
│       ├── src/
│       │   ├── app/            # App Router pages
│       │   │   ├── (public)/   # Public pages (SSR/ISR)
│       │   │   ├── (dashboard)/ # Protected dashboards
│       │   │   └── api/         # API routes
│       │   ├── components/     # React components
│       │   ├── lib/            # Utilities and configurations
│       │   ├── hooks/          # Custom React hooks
│       │   └── types/          # TypeScript types
│       └── tests/              # Test files
├── prisma/                     # Database schema and migrations
├── packages/                   # Shared packages
└── docs/                      # Documentation
```

## 🚀 Quick Start

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
   cp apps/web/env.example apps/web/.env.local
   ```
   
   Update the `.env.local` file with your configuration.

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with demo data

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Run tests with coverage

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
npm run format           # Format code with Prettier
```

### Database Management

The project uses Prisma for database management with Row Level Security (RLS) policies for enhanced security.

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create and apply migration
npm run db:migrate

# Reset database
npm run db:reset

# Seed with demo data
npm run db:seed
```

### Search Configuration

Meilisearch is used for fast profile search. Configure your Meilisearch instance:

```bash
# Set environment variables
MEILISEARCH_HOST="https://your-instance.com"
MEILISEARCH_API_KEY="your-api-key"

# Initialize search indexes
npm run search:init
```

## 🔒 Security Features

### Row Level Security (RLS)
- **Employee Profiles**: Owner can update, public can read minimal fields, subscribers can read extended fields
- **Chat Messages**: Only participants can read/write messages
- **Subscriptions**: Employers can only access their own subscriptions
- **Audit Logs**: Admin-only access to audit logs

### Authentication & Authorization
- **NextAuth.js** with multiple providers (Email, Google)
- **JWT tokens** with role-based claims
- **Session management** with secure cookies
- **Rate limiting** on sensitive endpoints

### Data Protection
- **Input validation** with Zod schemas
- **SQL injection prevention** with Prisma
- **XSS protection** with Content Security Policy
- **CSRF protection** with NextAuth.js

## 💳 Payment Integration

### Supported Payment Methods
- **Stripe**: Credit/debit cards (primary)
- **PayPal**: International payments
- **GCash**: Local Philippine payment gateway

### Subscription Management
- **₱600 every 3 months** for employer messaging
- **Automatic renewals** with payment method on file
- **Webhook handling** for payment events
- **Grace period** for failed payments

## 🔍 Search & Discovery

### Meilisearch Features
- **Fast search** with sub-second response times
- **Faceted search** for advanced filtering
- **Typo tolerance** for better user experience
- **Synonyms** for skill matching
- **Geographic search** for location-based results

### Search Capabilities
- **Text search** across profiles, skills, and descriptions
- **Location filtering** by province, city, barangay
- **Skill matching** with multiple criteria
- **Salary range** filtering
- **Availability** date filtering
- **Experience level** filtering

## 📱 Mobile & Performance

### Mobile Optimization
- **Mobile-first** responsive design
- **Touch-friendly** interactions
- **Fast loading** on 4G networks
- **Offline support** with service workers

### Performance Features
- **Server-side rendering** for public pages
- **Incremental static regeneration** for dynamic content
- **Image optimization** with Next.js Image
- **Code splitting** with dynamic imports
- **CDN** for static assets

## 🌍 Internationalization

### Language Support
- **English (en)**: Primary language
- **Filipino (fil)**: Local language
- **Locale routing**: `/en/`, `/fil/`

### Translation Setup
```bash
# Add new translation
npm run i18n:add-locale <locale>

# Extract translation keys
npm run i18n:extract

# Validate translations
npm run i18n:validate
```

## 🧪 Testing

### Test Coverage
- **Unit Tests**: 80%+ coverage with Vitest
- **E2E Tests**: Critical user flows with Playwright
- **Integration Tests**: API endpoints and database operations
- **Accessibility Tests**: WCAG 2.2 AA compliance

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage

# Specific test file
npm run test -- tests/unit/components/Button.test.tsx
```

## 🚀 Deployment

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
AUTH_SECRET="your-secret"
NEXTAUTH_URL="https://adry.com"

# Payments
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."

# Storage
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."

# Search
MEILISEARCH_HOST="https://..."
MEILISEARCH_API_KEY="..."
```

### Database Setup
1. Create PostgreSQL instance (Neon/Supabase)
2. Run migrations: `npm run db:migrate`
3. Seed initial data: `npm run db:seed`

### Search Setup
1. Create Meilisearch instance
2. Initialize indexes: `npm run search:init`
3. Configure environment variables

## 📊 Monitoring & Analytics

### Error Tracking
- **Sentry** for error monitoring and performance tracking
- **Custom error boundaries** for React components
- **API error logging** with structured data

### Analytics
- **Vercel Analytics** for web vitals and performance
- **Custom events** for business metrics
- **User journey** tracking and analysis

### Audit Logging
- **Database audit_log** table for all user actions
- **Security events** logging and monitoring
- **Compliance** reporting and data retention

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test && npm run test:e2e`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
- **TypeScript** with strict mode enabled
- **ESLint** and **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Test coverage** requirements (80%+)
- **Accessibility** compliance (WCAG 2.2 AA)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Technical Architecture](ADRY_TECH_PLAN.md)
- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)

### Getting Help
- **Issues**: Create an issue in the GitHub repository
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@adry.com

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Core platform functionality
- [x] User authentication and profiles
- [x] Search and discovery
- [x] Payment integration
- [x] Basic messaging system

### Phase 2 (Next)
- [ ] Mobile app (React Native)
- [ ] Video interview integration
- [ ] Advanced analytics dashboard
- [ ] AI-powered candidate matching
- [ ] Background check integration

### Phase 3 (Future)
- [ ] Multi-language support expansion
- [ ] Insurance and benefits management
- [ ] Advanced reporting and insights
- [ ] API for third-party integrations
- [ ] White-label solutions

---

**Adry** - Connecting trusted housekeepers with families across the Philippines. 🇵🇭

Built with ❤️ using modern web technologies and best practices.