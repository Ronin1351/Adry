-- CreateEnum
CREATE TYPE "CivilStatus" AS ENUM ('SINGLE', 'MARRIED', 'WIDOWED', 'DIVORCED', 'SEPARATED');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('LIVE_IN', 'LIVE_OUT', 'BOTH');

-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PHILSYS_ID', 'PHILHEALTH_ID', 'PAGIBIG_ID', 'PASSPORT', 'NBI_CLEARANCE', 'POLICE_CLEARANCE', 'BIRTH_CERTIFICATE', 'MARRIAGE_CERTIFICATE', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "employee_profiles" (
    "userId" TEXT NOT NULL,
    "photoUrl" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "age" INTEGER NOT NULL,
    "birthDate" TIMESTAMP(3),
    "civilStatus" "CivilStatus" NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "exactAddress" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "experience" INTEGER NOT NULL,
    "headline" TEXT,
    "salaryMin" INTEGER NOT NULL,
    "salaryMax" INTEGER NOT NULL,
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'LIVE_OUT',
    "availabilityDate" TIMESTAMP(3),
    "daysOff" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "overtime" BOOLEAN NOT NULL DEFAULT false,
    "holidayWork" BOOLEAN NOT NULL DEFAULT false,
    "visibility" BOOLEAN NOT NULL DEFAULT false,
    "profileScore" INTEGER NOT NULL DEFAULT 0,
    "kycStatus" "KYCStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_profiles_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "rejectionReason" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "references" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "duration" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "references_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_employee_profiles_visibility" ON "employee_profiles"("visibility");

-- CreateIndex
CREATE INDEX "idx_employee_profiles_city" ON "employee_profiles"("city");

-- CreateIndex
CREATE INDEX "idx_employee_profiles_province" ON "employee_profiles"("province");

-- CreateIndex
CREATE INDEX "idx_employee_profiles_skills" ON "employee_profiles" USING GIN ("skills");

-- CreateIndex
CREATE INDEX "idx_employee_profiles_employment_type" ON "employee_profiles"("employmentType");

-- CreateIndex
CREATE INDEX "idx_employee_profiles_salary_range" ON "employee_profiles"("salaryMin", "salaryMax");

-- CreateIndex
CREATE INDEX "idx_documents_employee_id" ON "documents"("employeeId");

-- CreateIndex
CREATE INDEX "idx_documents_type" ON "documents"("type");

-- CreateIndex
CREATE INDEX "idx_documents_status" ON "documents"("status");

-- CreateIndex
CREATE INDEX "idx_references_employee_id" ON "references"("employeeId");

-- AddForeignKey
ALTER TABLE "employee_profiles" ADD CONSTRAINT "employee_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "references" ADD CONSTRAINT "references_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
