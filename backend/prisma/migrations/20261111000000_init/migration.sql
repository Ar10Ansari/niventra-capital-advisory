-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PUBLIC', 'INVESTOR', 'STAFF', 'ADMIN');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING_DELETION');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('NOT_SUBMITTED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'MIXED_USE', 'PLOTTED_DEVELOPMENT', 'REDEVELOPMENT', 'INDUSTRIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "ProjectStage" AS ENUM ('LAND_ACQUISITION', 'PLANNING_APPROVALS', 'UNDER_CONSTRUCTION', 'COMPLETED', 'OTHER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('RECEIVED', 'UNDER_REVIEW', 'MORE_INFORMATION_REQUIRED', 'SHORTLISTED', 'DECLINED', 'CLOSED');

-- CreateEnum
CREATE TYPE "PayoutFrequency" AS ENUM ('MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL', 'CUMULATIVE');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ACTIVE', 'MATURED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PRINCIPAL_ALLOCATION', 'INTEREST_PAYOUT', 'TDS_DEDUCTION', 'REDEMPTION');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('SCHEDULED', 'PROCESSED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(128) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "salt" VARCHAR(64) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'INVESTOR',
    "phone" VARCHAR(50),
    "investor_category" VARCHAR(50),
    "notify_consultations" BOOLEAN NOT NULL DEFAULT true,
    "notify_disclosures" BOOLEAN NOT NULL DEFAULT true,
    "notify_grievances" BOOLEAN NOT NULL DEFAULT true,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" VARCHAR(128) NOT NULL,
    "user_id" VARCHAR(128) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "user_agent" VARCHAR(500),
    "ip_address" VARCHAR(45),
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" VARCHAR(128) NOT NULL,
    "user_id" VARCHAR(128) NOT NULL,
    "token_hash" VARCHAR(128) NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kyc_records" (
    "id" VARCHAR(128) NOT NULL,
    "user_id" VARCHAR(128) NOT NULL,
    "pan_number_masked" VARCHAR(20),
    "id_type" VARCHAR(50),
    "id_number_masked" VARCHAR(50),
    "status" "KycStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "verified_at" TIMESTAMPTZ,
    "rejection_reason" TEXT,
    "dpdp_consent" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "kyc_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" VARCHAR(128) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "indicative_yield" VARCHAR(50) NOT NULL,
    "tenor" VARCHAR(50) NOT NULL,
    "min_investment" VARCHAR(50) NOT NULL,
    "security_type" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED',
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "risks_summary" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" VARCHAR(128) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "doc_type" VARCHAR(50) NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "version" VARCHAR(32) NOT NULL DEFAULT '1.0',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investments" (
    "id" VARCHAR(128) NOT NULL,
    "user_id" VARCHAR(128) NOT NULL,
    "product_id" VARCHAR(128),
    "product_title" VARCHAR(255) NOT NULL,
    "principal_amount" DECIMAL(18,2) NOT NULL,
    "interest_rate_pa" DECIMAL(5,2) NOT NULL,
    "tenor_months" INTEGER NOT NULL,
    "payout_frequency" "PayoutFrequency" NOT NULL,
    "start_date" DATE NOT NULL,
    "maturity_date" DATE NOT NULL,
    "accrued_interest" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "interest_paid" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "pending_interest" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "next_payout_date" DATE,
    "status" "InvestmentStatus" NOT NULL DEFAULT 'PENDING',
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_transactions" (
    "id" VARCHAR(128) NOT NULL,
    "investment_id" VARCHAR(128) NOT NULL,
    "user_id" VARCHAR(128) NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "payment_reference" VARCHAR(100),
    "effective_date" DATE NOT NULL,
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_applications" (
    "id" VARCHAR(128) NOT NULL,
    "reference_number" VARCHAR(50) NOT NULL,
    "applicant_name" VARCHAR(255) NOT NULL,
    "organization_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "website" VARCHAR(255),
    "project_name" VARCHAR(255) NOT NULL,
    "category" "ProjectCategory" NOT NULL,
    "address" TEXT NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "pin_code" VARCHAR(10) NOT NULL,
    "land_status" VARCHAR(255) NOT NULL,
    "stage" "ProjectStage" NOT NULL,
    "description" TEXT NOT NULL,
    "total_cost" DECIMAL(18,2) NOT NULL,
    "funding_requested" DECIMAL(18,2) NOT NULL,
    "promoter_contribution" DECIMAL(18,2),
    "use_of_funds" TEXT NOT NULL,
    "expected_timeline" VARCHAR(255) NOT NULL,
    "existing_loans" TEXT,
    "documents" JSONB NOT NULL DEFAULT '[]',
    "consent_given" BOOLEAN NOT NULL DEFAULT true,
    "status" "ProjectStatus" NOT NULL DEFAULT 'RECEIVED',
    "assigned_to" VARCHAR(128),
    "internal_notes" TEXT,
    "decline_reason" TEXT,
    "info_requested" TEXT,
    "is_demo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "project_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_status_history" (
    "id" VARCHAR(128) NOT NULL,
    "project_id" VARCHAR(128) NOT NULL,
    "previous_status" "ProjectStatus",
    "new_status" "ProjectStatus" NOT NULL,
    "changed_by" VARCHAR(255) NOT NULL,
    "change_note" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enquiries" (
    "id" VARCHAR(128) NOT NULL,
    "reference_id" VARCHAR(50) NOT NULL,
    "user_id" VARCHAR(128),
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(50) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "capital_range" VARCHAR(100) NOT NULL,
    "message" TEXT,
    "consent" BOOLEAN NOT NULL DEFAULT true,
    "status" VARCHAR(50) NOT NULL DEFAULT 'NEW',
    "assigned_to" VARCHAR(128),
    "internal_notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grievances" (
    "id" VARCHAR(128) NOT NULL,
    "ticket_id" VARCHAR(50) NOT NULL,
    "user_id" VARCHAR(128),
    "complainant_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "transaction_ref" VARCHAR(100),
    "subject" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    "assigned_to" VARCHAR(128),
    "resolution_notes" TEXT,
    "sla_deadline" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "grievances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" VARCHAR(128) NOT NULL,
    "actor_id" VARCHAR(255),
    "actor_email" VARCHAR(255),
    "actor_role" VARCHAR(50),
    "action" VARCHAR(100) NOT NULL,
    "resource_type" VARCHAR(100) NOT NULL,
    "resource_id" VARCHAR(255),
    "details" JSONB,
    "ip_address" VARCHAR(45),
    "status" VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" VARCHAR(128) NOT NULL,
    "user_id" VARCHAR(128) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "link" VARCHAR(255),
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deletion_requests" (
    "id" VARCHAR(128) NOT NULL,
    "request_id" VARCHAR(50) NOT NULL,
    "user_id" VARCHAR(128),
    "full_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "reason" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    "statutory_retention_notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "deletion_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_token_idx" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_hash_key" ON "password_reset_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expires_at_idx" ON "password_reset_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "kyc_records_user_id_key" ON "kyc_records"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "documents_is_public_status_idx" ON "documents"("is_public", "status");

-- CreateIndex
CREATE INDEX "documents_status_idx" ON "documents"("status");

-- CreateIndex
CREATE INDEX "investments_user_id_idx" ON "investments"("user_id");

-- CreateIndex
CREATE INDEX "investments_status_idx" ON "investments"("status");

-- CreateIndex
CREATE INDEX "investment_transactions_investment_id_idx" ON "investment_transactions"("investment_id");

-- CreateIndex
CREATE INDEX "investment_transactions_user_id_idx" ON "investment_transactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_applications_reference_number_key" ON "project_applications"("reference_number");

-- CreateIndex
CREATE INDEX "project_applications_reference_number_idx" ON "project_applications"("reference_number");

-- CreateIndex
CREATE INDEX "project_applications_status_idx" ON "project_applications"("status");

-- CreateIndex
CREATE INDEX "project_applications_category_idx" ON "project_applications"("category");

-- CreateIndex
CREATE INDEX "project_status_history_project_id_idx" ON "project_status_history"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "enquiries_reference_id_key" ON "enquiries"("reference_id");

-- CreateIndex
CREATE INDEX "enquiries_reference_id_idx" ON "enquiries"("reference_id");

-- CreateIndex
CREATE INDEX "enquiries_email_idx" ON "enquiries"("email");

-- CreateIndex
CREATE INDEX "enquiries_user_id_idx" ON "enquiries"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "grievances_ticket_id_key" ON "grievances"("ticket_id");

-- CreateIndex
CREATE INDEX "grievances_ticket_id_idx" ON "grievances"("ticket_id");

-- CreateIndex
CREATE INDEX "grievances_status_idx" ON "grievances"("status");

-- CreateIndex
CREATE INDEX "grievances_user_id_idx" ON "grievances"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_actor_email_idx" ON "audit_logs"("actor_email");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_resource_type_idx" ON "audit_logs"("resource_type");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "deletion_requests_request_id_key" ON "deletion_requests"("request_id");

-- CreateIndex
CREATE INDEX "deletion_requests_request_id_idx" ON "deletion_requests"("request_id");

-- CreateIndex
CREATE INDEX "deletion_requests_status_idx" ON "deletion_requests"("status");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kyc_records" ADD CONSTRAINT "kyc_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_investment_id_fkey" FOREIGN KEY ("investment_id") REFERENCES "investments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_transactions" ADD CONSTRAINT "investment_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_applications" ADD CONSTRAINT "project_applications_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_status_history" ADD CONSTRAINT "project_status_history_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grievances" ADD CONSTRAINT "grievances_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deletion_requests" ADD CONSTRAINT "deletion_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
