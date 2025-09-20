# Adry - Technical Architecture Plan

## 🏗️ Project Structure

```
adry/
├── apps/
│   └── web/                    # Next.js 14 App Router application
│       ├── src/
│       │   ├── app/
│       │   │   ├── (public)/   # Public pages (SSR/ISR)
│       │   │   │   ├── page.tsx
│       │   │   │   ├── search/
│       │   │   │   ├── profile/[id]/
│       │   │   │   └── about/
│       │   │   ├── (dashboard)/ # Protected dashboard pages
│       │   │   │   ├── employee/
│       │   │   │   ├── employer/
│       │   │   │   └── admin/
│       │   │   ├── api/         # API routes
│       │   │   │   ├── auth/
│       │   │   │   ├── profiles/
│       │   │   │   ├── search/
│       │   │   │   ├── payments/
│       │   │   │   └── webhooks/
│       │   │   └── globals.css
│       │   ├── components/
│       │   │   ├── ui/          # shadcn/ui components
│       │   │   ├── forms/       # Form components
│       │   │   ├── layout/      # Layout components
│       │   │   └── features/    # Feature-specific components
│       │   ├── lib/
│       │   │   ├── auth.ts      # NextAuth configuration
│       │   │   ├── db.ts        # Prisma client
│       │   │   ├── search.ts    # Meilisearch client
│       │   │   ├── payments.ts  # Payment providers
│       │   │   ├── storage.ts   # Cloudflare R2 client
│       │   │   ├── validations.ts # Zod schemas
│       │   │   └── utils.ts
│       │   ├── hooks/           # Custom React hooks
│       │   ├── types/           # TypeScript types
│       │   └── locales/         # i18n translations
│       ├── public/
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── components.json      # shadcn/ui config
│       └── package.json
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── utils/                  # Shared utilities
│   └── types/                  # Shared TypeScript types
├── tests/
│   ├── unit/                   # Vitest unit tests
│   ├── e2e/                    # Playwright E2E tests
│   └── fixtures/               # Test data
├── docs/                       # Documentation
├── .github/
│   └── workflows/              # CI/CD workflows
├── package.json                # Root package.json
├── turbo.json                  # Turborepo config
└── README.md
```

## 🎨 Frontend Stack

### Core Technologies
- **Next.js 14** with App Router
- **TypeScript** with strict mode
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **Lucide React** for icons
- **Framer Motion** for animations

### Form Management
- **React Hook Form** for form handling
- **Zod** for validation schemas
- **@hookform/resolvers** for integration

### Internationalization
- **next-intl** for i18n support
- **Languages**: English (en), Filipino (fil)
- **Locale routing**: `/en/`, `/fil/`

### State Management
- **Zustand** for client state
- **TanStack Query** for server state
- **tRPC** for type-safe API calls

## 🔧 Backend Architecture

### API Layer
- **Next.js API Routes** for HTTP endpoints
- **tRPC** for type-safe RPC calls
- **NextAuth.js** for authentication
- **Rate limiting** with `@upstash/ratelimit`

### Database
- **PostgreSQL** (Neon or Supabase)
- **Prisma ORM** with migrations
- **Row Level Security (RLS)** policies
- **Connection pooling** with PgBouncer

### Search Engine
- **Meilisearch** for fast profile search
- **Indexed fields**: name, skills, location, experience
- **Faceted search** for filters
- **Typo tolerance** and synonyms

### File Storage
- **Cloudflare R2** for images and documents
- **Signed URLs** for secure access
- **Image optimization** with Next.js Image
- **File type validation** and virus scanning

### Authentication
- **NextAuth.js** with multiple providers
- **Email/Password** authentication
- **Google OAuth** integration
- **JWT tokens** with role claims
- **Session management** with secure cookies

## 💳 Payment Integration

### Primary Payment Methods
- **Stripe** for credit/debit cards
- **PayPal** for international payments
- **GCash** via Xendit/PayMongo gateway

### Subscription Management
- **Stripe Subscriptions** for recurring billing
- **Webhook handling** for payment events
- **Grace period** for failed payments
- **Proration** for plan changes

### Payment Flow
1. User selects subscription plan
2. Payment method selection
3. Secure payment processing
4. Webhook confirmation
5. Subscription activation
6. Access granted to premium features

## 🔒 Security Implementation

### Row Level Security Policies

#### Employee Profiles
```sql
-- Owner can update their own profile
CREATE POLICY "owner_can_write" ON employee_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Public can read minimal fields
CREATE POLICY "public_read_minimal" ON employee_profiles
  FOR SELECT USING (visibility = true);

-- Subscribers can read extended fields
CREATE POLICY "subscriber_read_extended" ON employee_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM subscriptions s
      WHERE s.employer_id = auth.uid()
      AND s.status = 'active'
      AND s.expires_at > NOW()
    )
  );
```

#### Chat Messages
```sql
-- Only participants can read messages
CREATE POLICY "participants_only" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats c
      WHERE c.id = chat_id
      AND (c.employer_id = auth.uid() OR c.employee_id = auth.uid())
    )
  );
```

### Rate Limiting
- **Authentication**: 5 attempts per minute
- **Search**: 100 requests per minute
- **Chat**: 50 messages per minute
- **File upload**: 10 uploads per minute

## 📊 Database Schema

### Core Tables
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(EMPLOYEE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  employeeProfile EmployeeProfile?
  employer        Employer?
  subscriptions   Subscription[]
  chatsAsEmployer Chat[]         @relation("EmployerChats")
  chatsAsEmployee Chat[]         @relation("EmployeeChats")
  sentMessages    ChatMessage[]
  interviews      Interview[]
  auditLogs       AuditLog[]
}

model EmployeeProfile {
  userId          String   @id
  photoUrl        String?
  civilStatus     CivilStatus
  location        String
  phone           String
  skills          String[]
  experienceText  String
  salaryMin       Int
  salaryMax       Int
  liveIn          Boolean  @default(false)
  availabilityDate DateTime?
  daysOff         String[]
  overtime        Boolean  @default(false)
  holidayWork     Boolean  @default(false)
  documents       Json?
  visibility      Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Employer {
  userId       String @id
  companyName  String?
  contactPhone String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  subscriptions Subscription[]
  chats        Chat[]        @relation("EmployerChats")
  interviews   Interview[]
}

model Subscription {
  id          String             @id @default(cuid())
  employerId  String
  status      SubscriptionStatus
  startedAt   DateTime           @default(now())
  expiresAt   DateTime
  provider    String
  providerRef String
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt

  employer Employer @relation(fields: [employerId], references: [id], onDelete: Cascade)
}

model Chat {
  id         String   @id @default(cuid())
  employerId String
  employeeId String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  employer  User         @relation("EmployerChats", fields: [employerId], references: [id], onDelete: Cascade)
  employee  User         @relation("EmployeeChats", fields: [employeeId], references: [id], onDelete: Cascade)
  messages  ChatMessage[]
}

model ChatMessage {
  id        String   @id @default(cuid())
  chatId    String
  senderId  String
  body      String
  createdAt DateTime @default(now())

  chat   Chat @relation(fields: [chatId], references: [id], onDelete: Cascade)
  sender User @relation(fields: [senderId], references: [id], onDelete: Cascade)
}

model Interview {
  id         String          @id @default(cuid())
  employerId String
  employeeId String
  startsAt   DateTime
  status     InterviewStatus @default(SCHEDULED)
  notes      String?
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt

  employer Employer @relation(fields: [employerId], references: [id], onDelete: Cascade)
  employee User     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
}

model AuditLog {
  id        String   @id @default(cuid())
  actorId   String
  action    String
  entity    String
  entityId  String
  meta      Json?
  createdAt DateTime @default(now())

  actor User @relation(fields: [actorId], references: [id], onDelete: Cascade)
}
```

## 🚀 Deployment Strategy

### Infrastructure
- **Frontend**: Vercel (automatic deployments)
- **Database**: Neon or Supabase (managed PostgreSQL)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Search**: Meilisearch Cloud
- **Monitoring**: Sentry + Vercel Analytics

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..." # For migrations

# Authentication
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://adry.com"

# Payments
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PAYPAL_CLIENT_ID="..."
PAYPAL_CLIENT_SECRET="..."
GCASH_GATEWAY_API_KEY="..."
GCASH_GATEWAY_SECRET="..."

# Storage
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="adry-files"
R2_PUBLIC_URL="https://files.adry.com"

# Search
MEILISEARCH_HOST="https://..."
MEILISEARCH_API_KEY="..."

# Notifications
RESEND_API_KEY="..."
SENTRY_DSN="..."
```

### CI/CD Pipeline
1. **Code Push** → GitHub
2. **Tests** → Vitest + Playwright
3. **Build** → Next.js production build
4. **Deploy** → Vercel (automatic)
5. **Database** → Prisma migrations
6. **Search** → Meilisearch index update

## 🧪 Testing Strategy

### Unit Tests (Vitest)
- **Components**: React component testing
- **Utils**: Utility function testing
- **API Routes**: Server function testing
- **Database**: Prisma model testing

### E2E Tests (Playwright)
- **User Journeys**: Complete user flows
- **Authentication**: Login/logout flows
- **Payments**: Subscription flows
- **Search**: Profile search and filtering

### Test Coverage
- **Target**: 80% code coverage
- **Critical Paths**: 100% coverage
- **API Endpoints**: 100% coverage
- **Authentication**: 100% coverage

## 📈 Performance Optimization

### Frontend
- **SSR/ISR** for public pages
- **Client-side** for dashboards
- **Image optimization** with Next.js Image
- **Code splitting** with dynamic imports
- **CDN** for static assets

### Backend
- **Database indexing** on search fields
- **Connection pooling** for database
- **Caching** with Redis (optional)
- **Rate limiting** to prevent abuse

### Search
- **Meilisearch** for sub-second search
- **Faceted search** for filters
- **Typo tolerance** for better UX
- **Synonyms** for skill matching

## 🔍 SEO Strategy

### Public Pages (SSR)
- **Profile pages**: Dynamic meta tags
- **Search pages**: Server-side rendering
- **Landing pages**: Static generation

### Meta Tags
- **Title**: "Name - Housekeeper in Location | Adry"
- **Description**: Skills, experience, availability
- **Open Graph**: Profile photos, location
- **Structured Data**: Person schema

### Sitemap
- **Dynamic sitemap** for profiles
- **Static pages** for content
- **Search filters** for discoverability

## 📱 Mobile Optimization

### Responsive Design
- **Mobile-first** approach
- **Touch-friendly** interactions
- **Fast loading** on 4G
- **Offline support** with service workers

### Performance
- **Core Web Vitals** optimization
- **Lighthouse score** > 90
- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s

## 🌍 Internationalization

### Language Support
- **English (en)**: Primary language
- **Filipino (fil)**: Local language
- **Locale routing**: `/en/`, `/fil/`

### Translation Strategy
- **next-intl** for i18n
- **Namespace organization** by feature
- **Fallback** to English
- **RTL support** (future)

## 📊 Monitoring & Analytics

### Error Tracking
- **Sentry** for error monitoring
- **Performance monitoring** with Sentry
- **User feedback** collection

### Analytics
- **Vercel Analytics** for web vitals
- **Custom events** for business metrics
- **User journey** tracking

### Audit Logging
- **Database audit_log** table
- **User actions** tracking
- **Security events** logging
- **Compliance** reporting

This technical plan provides a comprehensive foundation for building Adry as a scalable, secure, and performant housekeeper hiring platform.
