-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELED', 'PAST_DUE', 'TRIAL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYPAL', 'GCASH', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "HouseholdSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE');

-- CreateEnum
CREATE TYPE "PreferredArrangement" AS ENUM ('LIVE_IN', 'LIVE_OUT', 'BOTH');

-- CreateEnum
CREATE TYPE "PrimaryLanguage" AS ENUM ('TAGALOG', 'ENGLISH', 'BOTH');

-- CreateEnum
CREATE TYPE "ContributionPolicy" AS ENUM ('YES', 'NO', 'OPTIONAL');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('PRIVATE_ROOM', 'SHARED_ROOM', 'STUDIO');

-- CreateEnum
CREATE TYPE "MealsProvided" AS ENUM ('ALL_MEALS', 'BREAKFAST_ONLY', 'LUNCH_DINNER', 'NONE');

-- CreateTable
CREATE TABLE "employer_profiles" (
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "aboutText" TEXT,
    "householdSize" "HouseholdSize",
    "preferredArrangement" "PreferredArrangement",
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "requirements" JSONB DEFAULT '{}',
    "languageRequirements" JSONB DEFAULT '{}',
    "workSchedule" JSONB DEFAULT '{}',
    "benefitsPolicies" JSONB DEFAULT '{}',
    "accommodationDetails" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employer_profiles_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "trialEndsAt" TIMESTAMP(3),
    "provider" "PaymentProvider" NOT NULL,
    "providerSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_history" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerPaymentId" TEXT,
    "invoiceUrl" TEXT,
    "status" "PaymentStatus" NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "providerPaymentMethodId" TEXT NOT NULL,
    "lastFourDigits" TEXT,
    "expiryMonth" INTEGER,
    "expiryYear" INTEGER,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_employer_profiles_city" ON "employer_profiles"("city");

-- CreateIndex
CREATE INDEX "idx_employer_profiles_province" ON "employer_profiles"("province");

-- CreateIndex
CREATE INDEX "idx_employer_profiles_budget_range" ON "employer_profiles"("budgetMin", "budgetMax");

-- CreateIndex
CREATE INDEX "idx_employer_profiles_preferred_arrangement" ON "employer_profiles"("preferredArrangement");

-- CreateIndex
CREATE INDEX "idx_subscriptions_employer_id" ON "subscriptions"("employerId");

-- CreateIndex
CREATE INDEX "idx_subscriptions_status" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "idx_subscriptions_expires_at" ON "subscriptions"("expiresAt");

-- CreateIndex
CREATE INDEX "idx_billing_history_employer_id" ON "billing_history"("employerId");

-- CreateIndex
CREATE INDEX "idx_billing_history_subscription_id" ON "billing_history"("subscriptionId");

-- CreateIndex
CREATE INDEX "idx_payment_methods_employer_id" ON "payment_methods"("employerId");

-- AddForeignKey
ALTER TABLE "employer_profiles" ADD CONSTRAINT "employer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "employer_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_history" ADD CONSTRAINT "billing_history_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "employer_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_history" ADD CONSTRAINT "billing_history_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "employer_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
