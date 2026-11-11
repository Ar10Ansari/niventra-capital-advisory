# Niventra Capital Advisory — Target Engineering Architecture
> **Implementation Alignment Note (November 2026):** This blueprint outlines the long-term target architecture. In the current implemented `backend/` code, please note verified deltas captured in [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) and [`docs/PROJECT_STATUS.md`](../PROJECT_STATUS.md):
> - Primary keys use `@db.VarChar(128)` rather than `@db.Uuid` to preserve seamless SQLite data migration parity.
> - Auth issues session-bound cookies (`SameSite=None; Secure` in staging/prod) paired with HMAC-SHA256 `X-CSRF-Token` + `sid`-pinned HS256 JWTs (`passport` removed; no rotating refresh tokens yet).
> - Document storage uses `LOCAL_FS` pending `@aws-sdk/client-s3` implementation; chatbot uses deterministic rule-based policy matching (no LLM/pgvector).

**Document Type:** Target Architecture Blueprint & Enterprise System Specification  
**Classification:** Confidential — Engineering Internal  
**Repository Path:** `docs/architecture/TARGET_ARCHITECTURE.md`  
**Author:** CTO & Principal Software Architect  
**Date:** October / November 2026  

---

## 1. System Topology & Architecture Vision

The target architecture establishes a clean, decoupled, enterprise-grade financial technology platform. The system separates the presentation layer (Next.js App Router deployed on Vercel) from the transactional core (independent NestJS application connected to managed PostgreSQL via Prisma ORM).

```
                                  +---------------------------------------+
                                  |            CLIENT DEVICES             |
                                  |  Desktop Browsers / Mobile Devices    |
                                  +-------------------+-------------------+
                                                      |
                                                      | HTTPS (TLS 1.3)
                                                      v
                                  +---------------------------------------+
                                  |         FRONTEND PRESENTATION         |
                                  |         Next.js 16 (Vercel)           |
                                  |  - Static & Server-Rendered Views     |
                                  |  - UI Component Hierarchy             |
                                  |  - Centralized Typed API Client       |
                                  +-------------------+-------------------+
                                                      |
                                                      | REST API (JSON / JWT)
                                                      | OpenAPI / Swagger
                                                      v
+---------------------------------------------------------------------------------------------------+
|                                 INDEPENDENT BACKEND APPLICATION                                   |
|                                       NestJS + TypeScript                                         |
|                                                                                                   |
|  +--------------------+  +--------------------+  +--------------------+  +---------------------+  |
|  |    Auth Module     |  |    Users Module    |  |  Projects Module   |  |   Documents Module  |  |
|  +--------------------+  +--------------------+  +--------------------+  +---------------------+  |
|  | Scheduling Module  |  |  Investors Module  |  | Investments Module |  | Transactions Module |  |
|  +--------------------+  +--------------------+  +--------------------+  +---------------------+  |
|  |  Portfolio Module  |  |  Branches Module   |  | Calculator Module  |  |    Chatbot Module   |  |
|  +--------------------+  +--------------------+  +--------------------+  +---------------------+  |
|  |    Notif Module    |  |    Admin Module    |  |  Audit Log Module  |  |   Health & Metrics  |  |
|  +--------------------+  +--------------------+  +--------------------+  +---------------------+  |
|                                                                                                   |
|  Cross-Cutting Infrastructure:                                                                    |
|  - Global ValidationPipe (class-validator DTOs)       - NestJS Throttler (Rate Limiting)          |
|  - JWT / Cookie Auth Guard (Passport)                 - Role-Based Access Control (RBAC Guard)    |
|  - Winston Structured Logging                         - S3 Document Storage Adapter               |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  | Prisma ORM (Connection Pool)
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                    PERSISTENT STORAGE ENGINE                                      |
|                                 Managed PostgreSQL 16 (AWS RDS / Neon)                            |
|                                                                                                   |
|  - Normalized Relational Tables                      - Exact Numeric / Decimal Financial Types    |
|  - UUID Primary Keys                                 - Immutable Append-Only Audit Logs           |
|  - Strict Foreign Key Cascades                       - Foreign Key & B-Tree Indexes               |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Monorepo vs Dual-Package Layout

To facilitate clean version control, independent testing, and segregated deployments while preserving repository cohesion, the codebase is structured as a professional monorepo or dual-package repository:

```
.
├── .github/
│   └── workflows/
│       └── ci.yml                     # Frontend + NestJS Prisma, lint, typecheck, test, E2E & build CI
├── src/                               # Next.js 16 frontend presentation & transition route handlers
│   ├── app/                           # App Router pages & legacy SQLite route handlers
│   ├── components/                    # Modular UI components (including admin/* & dashboard/*)
│   └── lib/                           # Business helpers & centralized typed API client (api/client.ts)
├── backend/                           # Independent NestJS Backend Application
│   ├── prisma/
│   │   ├── schema.prisma              # Definitive relational PostgreSQL schema
│   │   └── migrations/                # Versioned SQL migration files
│   ├── src/
│   │   ├── app.module.ts              # Root NestJS module
│   │   ├── main.ts                    # Application bootstrap, Swagger setup, CORS, Helmet
│   │   ├── common/                    # Guards, interceptors, decorators, filters
│   │   │   ├── decorators/            # @Roles(), @CurrentUser()
│   │   │   ├── filters/               # HttpExceptionFilter
│   │   │   ├── guards/                # JwtAuthGuard, RolesGuard, ThrottlerGuard
│   │   │   └── interceptors/          # LoggingInterceptor, TransformInterceptor
│   │   └── modules/                   # 15 Domain Modules
│   │       ├── auth/                  # Login, register, token refresh, password reset
│   │       ├── users/                 # Profile, credentials, DPDP preferences
│   │       ├── project-funding/       # Applications, status transitions, history
│   │       ├── documents/             # Metadata, S3 upload/download, watermarking
│   │       ├── appointments/          # Consultation booking and scheduling
│   │       ├── investor-accounts/     # Investor onboarding, profile, bank mandates
│   │       ├── investments/           # Debenture holdings, yields, tenors
│   │       ├── transactions/          # Ledger transactions, payouts, TDS tracking
│   │       ├── portfolio/             # Real-time portfolio metric aggregation
│   │       ├── branches/              # Verified directory, search, audit notes
│   │       ├── calculator/            # Simple-interest verification API
│   │       ├── chatbot/               # Guarded institutional Q&A retrieval
│   │       ├── notifications/         # Multi-channel notification engine (Email, In-App)
│   │       ├── admin/                 # Deal desk operations, user management
│   │       └── audit-logs/            # Immutable regulatory audit trails
│   ├── test/                          # Supertest e2e integration test suites
│   ├── package.json                   # NestJS dependencies & scripts
│   └── tsconfig.json                  # NestJS TypeScript configuration
└── docs/                              # Architecture, API, Security, and Database guides
```

---

## 3. The 15 Core Backend Domain Modules

Each NestJS domain module follows strict Single Responsibility and Layered Architecture principles: Controller $\rightarrow$ Service $\rightarrow$ Repository / Prisma Service.

### 3.1 Authentication Module (`auth`)
* **Responsibilities:** User registration, password hashing (Argon2id / Scrypt), login, JWT issue/refresh, session revocation, and password recovery.
* **Security:** Issue short-lived Access Tokens (15 mins) and rotating Refresh Tokens (7 days) stored in HttpOnly, SameSite=Strict cookies.

### 3.2 Users & Profiles Module (`users`)
* **Responsibilities:** Personal profile updates, phone verification, DPDP consent preferences, and account deletion workflows (`statutory_retention_notes`).

### 3.3 Project Funding Applications Module (`project-funding`)
* **Responsibilities:** Multi-stage real estate funding applications, validation of financial figures, developer KYC linking, and audit-logged status transitions (`RECEIVED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `MORE_INFO` $\rightarrow$ `SHORTLISTED` $\rightarrow$ `DECLINED` $\rightarrow$ `CLOSED`).

### 3.4 Document Management Module (`documents`)
* **Responsibilities:** S3/Cloudflare R2 presigned URL generation for secure document uploads, MIME-type and antivirus validation, and role-based document access.

### 3.5 Appointments & Scheduling Module (`appointments`)
* **Responsibilities:** Institutional consultation scheduling, duplicate throttling, prospective investor intake, and calendar synchronization.

### 3.6 Investor Accounts Module (`investor-accounts`)
* **Responsibilities:** Investor accreditation records, KYC verification (PAN, Aadhaar/Passport masking), bank account registration, and depository participant details.

### 3.7 Investments Module (`investments`)
* **Responsibilities:** Management of Non-Convertible Debenture (NCD) allocations, series tracking, coupon rates, issue dates, maturity dates, and security covenants.
* **Integrity:** Strict separation between live production debentures and illustrative demo models (`is_demo = true`).

### 3.8 Transactions Module (`transactions`)
* **Responsibilities:** Double-entry ledger records for principal allocations, interest payouts, TDS deductions (Sections 193/194A), and redemptions.

### 3.9 Investor Portfolio & Tracking Module (`portfolio`)
* **Responsibilities:** Real-time computation of portfolio metrics: total principal deployed, active investments count, accrued interest, interest disbursed, pending distributions, and next payout schedule.

### 3.10 Branch Directory Module (`branches`)
* **Responsibilities:** Querying the 25 institutional and regional locations across 6 states with full-text search, tier filtering (Head Office, Regional Desk, Partner Network), and audit verification notes.

### 3.11 Calculator Module (`calculator`)
* **Responsibilities:** Fiduciary simple-interest calculations, schedule breakdowns, boundary checks, and statutory TDS disclosure generation.

### 3.12 Chatbot Integration Module (`chatbot`)
* **Responsibilities:** Grounded advisory Q&A retrieval against institutional disclosures, prompt injection defenses, citation generation, and optional semantic vector search (`pgvector`).

### 3.13 Notifications Module (`notifications`)
* **Responsibilities:** Multi-channel notification delivery: In-app notification queue and outbound transactional email dispatch (via Resend or AWS SES) with automatic PII masking.

### 3.14 Admin Management Module (`admin`)
* **Responsibilities:** Deal desk overview, lead CRM pipeline, developer project review dashboard, grievance resolution tracking, and platform health telemetry.

### 3.15 Audit Logs Module (`audit-logs`)
* **Responsibilities:** Immutable, append-only security and operational audit trail recording actor ID, IP address, user agent, action code, resource type, and before/after JSON diffs.

---

## 4. Normalized PostgreSQL Database Schema (Prisma Specification)

The authoritative Prisma schema lives in [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma) with its initial SQL migration in [`backend/prisma/migrations/20261111000000_init/migration.sql`](../../backend/prisma/migrations/20261111000000_init/migration.sql). Primary and foreign keys use `@default(uuid()) @db.VarChar(128)` so new entities receive UUIDv4 identifiers while legacy SQLite string IDs (`usr_*`, `ENQ-2026-*`, `GRV-*`, `INV-*`) migrate verbatim. The schema covers 15 tables: 14 migrated domain tables plus `password_reset_tokens` for single-use credential recovery.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  PUBLIC
  INVESTOR
  STAFF
  ADMIN
}

enum AccountStatus {
  ACTIVE
  SUSPENDED
  PENDING_DELETION
}

enum KycStatus {
  NOT_SUBMITTED
  PENDING_VERIFICATION
  VERIFIED
  REJECTED
}

enum ProjectCategory {
  RESIDENTIAL
  COMMERCIAL
  MIXED_USE
  PLOTTED_DEVELOPMENT
  REDEVELOPMENT
  INDUSTRIAL
  OTHER
}

enum ProjectStage {
  LAND_ACQUISITION
  PLANNING_APPROVALS
  UNDER_CONSTRUCTION
  COMPLETED
  OTHER
}

enum ProjectStatus {
  RECEIVED
  UNDER_REVIEW
  MORE_INFORMATION_REQUIRED
  SHORTLISTED
  DECLINED
  CLOSED
}

enum PayoutFrequency {
  MONTHLY
  QUARTERLY
  SEMI_ANNUAL
  ANNUAL
  CUMULATIVE
}

enum InvestmentStatus {
  PENDING
  UNDER_REVIEW
  APPROVED
  REJECTED
  ACTIVE
  MATURED
  CANCELLED
}

enum TransactionType {
  PRINCIPAL_ALLOCATION
  INTEREST_PAYOUT
  TDS_DEDUCTION
  REDEMPTION
}

enum TransactionStatus {
  SCHEDULED
  PROCESSED
  FAILED
}

model User {
  id                  String         @id @default(uuid()) @db.VarChar(128)
  name                String         @db.VarChar(255)
  email               String         @unique @db.VarChar(255)
  passwordHash        String         @db.VarChar(255)
  salt                String         @db.VarChar(64)
  role                UserRole       @default(INVESTOR)
  phone               String?        @db.VarChar(50)
  investorCategory    String?        @db.VarChar(50)
  notifyConsultations Boolean        @default(true)
  notifyDisclosures   Boolean        @default(true)
  notifyGrievances    Boolean        @default(true)
  status              AccountStatus  @default(ACTIVE)
  createdAt           DateTime       @default(now()) @db.Timestamptz
  updatedAt           DateTime       @updatedAt @db.Timestamptz

  sessions            Session[]
  passwordResetTokens PasswordResetToken[]
  kycRecord           KycRecord?
  enquiries           Enquiry[]      @relation("UserEnquiries")
  assignedEnqs        Enquiry[]      @relation("AssignedStaffEnquiries")
  grievances          Grievance[]    @relation("UserGrievances")
  assignedGrievs      Grievance[]    @relation("AssignedStaffGrievances")
  investments         Investment[]
  transactions        InvestmentTransaction[]
  notifications       Notification[]
  deletionReqs        DeletionRequest[]
  assignedPrjs        ProjectApplication[] @relation("AssignedStaffProjects")

  @@index([email])
  @@index([role])
}

model PasswordResetToken {
  id        String    @id @default(uuid()) @db.VarChar(128)
  userId    String    @db.VarChar(128)
  tokenHash String    @unique @db.VarChar(128)
  expiresAt DateTime  @db.Timestamptz
  usedAt    DateTime? @db.Timestamptz
  createdAt DateTime  @default(now()) @db.Timestamptz

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}

model Session {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @db.Uuid
  token     String   @unique @db.VarChar(255)
  userAgent String?  @db.VarChar(500)
  ipAddress String?  @db.VarChar(45)
  expiresAt DateTime @db.Timestamptz
  createdAt DateTime @default(now()) @db.Timestamptz

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([token])
  @@index([userId])
}

model KycRecord {
  id              String    @id @default(uuid()) @db.Uuid
  userId          String    @unique @db.Uuid
  panMasked       String?   @db.VarChar(20)
  idType          String?   @db.VarChar(50)
  idNumberMasked  String?   @db.VarChar(50)
  status          KycStatus @default(NOT_SUBMITTED)
  verifiedAt      DateTime? @db.Timestamptz
  rejectionReason String?   @db.Text
  dpdpConsent     Boolean   @default(true)
  createdAt       DateTime  @default(now()) @db.Timestamptz
  updatedAt       DateTime  @updatedAt @db.Timestamptz

  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Product {
  id              String       @id @default(uuid()) @db.Uuid
  slug            String       @unique @db.VarChar(100)
  title           String       @db.VarChar(255)
  category        String       @db.VarChar(100)
  indicativeYield String       @db.VarChar(50)
  tenor           String       @db.VarChar(50)
  minInvestment   String       @db.VarChar(50)
  securityType    String       @db.VarChar(255)
  status          String       @default("PUBLISHED") @db.VarChar(50)
  summary         String       @db.Text
  description     String       @db.Text
  risksSummary    String       @db.Text
  createdAt       DateTime     @default(now()) @db.Timestamptz
  updatedAt       DateTime     @updatedAt @db.Timestamptz

  investments     Investment[]
}

model Investment {
  id              String           @id @default(uuid()) @db.Uuid
  userId          String           @db.Uuid
  productId       String?          @db.Uuid
  productTitle    String           @db.VarChar(255)
  principalAmount Decimal          @db.Decimal(18, 2)
  interestRatePa  Decimal          @db.Decimal(5, 2)
  tenorMonths     Int
  payoutFrequency PayoutFrequency
  startDate       DateTime         @db.Date
  maturityDate    DateTime         @db.Date
  accruedInterest Decimal          @default(0) @db.Decimal(18, 2)
  interestPaid    Decimal          @default(0) @db.Decimal(18, 2)
  pendingInterest Decimal          @default(0) @db.Decimal(18, 2)
  nextPayoutDate  DateTime?        @db.Date
  status          InvestmentStatus @default(PENDING)
  isDemo          Boolean          @default(false)
  createdAt       DateTime         @default(now()) @db.Timestamptz
  updatedAt       DateTime         @updatedAt @db.Timestamptz

  user            User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  product         Product?         @relation(fields: [productId], references: [id], onDelete: SetNull)
  transactions    InvestmentTransaction[]

  @@index([userId])
  @@index([status])
}

model InvestmentTransaction {
  id               String            @id @default(uuid()) @db.Uuid
  investmentId     String            @db.Uuid
  userId           String            @db.Uuid
  transactionType  TransactionType
  amount           Decimal           @db.Decimal(18, 2)
  status           TransactionStatus @default(SCHEDULED)
  paymentReference String?           @db.VarChar(100)
  effectiveDate    DateTime          @db.Date
  isDemo           Boolean           @default(false)
  createdAt        DateTime          @default(now()) @db.Timestamptz

  investment       Investment        @relation(fields: [investmentId], references: [id], onDelete: Cascade)
  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([investmentId])
  @@index([userId])
}

model ProjectApplication {
  id                   String           @id @default(uuid()) @db.Uuid
  referenceNumber      String           @unique @db.VarChar(50)
  applicantName        String           @db.VarChar(255)
  organizationName     String           @db.VarChar(255)
  email                String           @db.VarChar(255)
  phone                String           @db.VarChar(50)
  role                 String           @db.VarChar(100)
  website              String?          @db.VarChar(255)
  projectName          String           @db.VarChar(255)
  category             ProjectCategory
  address              String           @db.Text
  city                 String           @db.VarChar(100)
  state                String           @db.VarChar(100)
  pinCode              String           @db.VarChar(10)
  landStatus           String           @db.VarChar(255)
  stage                ProjectStage
  description          String           @db.Text
  totalCost            Decimal          @db.Decimal(18, 2)
  fundingRequested     Decimal          @db.Decimal(18, 2)
  promoterContribution Decimal?         @db.Decimal(18, 2)
  useOfFunds           String           @db.Text
  expectedTimeline     String           @db.VarChar(255)
  existingLoans        String?          @db.Text
  documents            Json             @default("[]")
  consentGiven         Boolean          @default(true)
  status               ProjectStatus    @default(RECEIVED)
  assignedTo           String?          @db.Uuid
  internalNotes        String?          @db.Text
  declineReason        String?          @db.Text
  infoRequested        String?          @db.Text
  isDemo               Boolean          @default(false)
  createdAt            DateTime         @default(now()) @db.Timestamptz
  updatedAt            DateTime         @updatedAt @db.Timestamptz

  assignedStaff        User?            @relation("AssignedStaffProjects", fields: [assignedTo], references: [id], onDelete: SetNull)
  statusHistory        ProjectStatusHistory[]

  @@index([referenceNumber])
  @@index([status])
  @@index([category])
}

model ProjectStatusHistory {
  id             String             @id @default(uuid()) @db.Uuid
  projectId      String             @db.Uuid
  previousStatus ProjectStatus?
  newStatus      ProjectStatus
  changedBy      String             @db.VarChar(255)
  changeNote     String?            @db.Text
  createdAt      DateTime           @default(now()) @db.Timestamptz

  project        ProjectApplication @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
}

model Enquiry {
  id            String    @id @default(uuid()) @db.Uuid
  referenceId   String    @unique @db.VarChar(50)
  userId        String?   @db.Uuid
  fullName      String    @db.VarChar(255)
  email         String    @db.VarChar(255)
  phoneNumber   String    @db.VarChar(50)
  category      String    @db.VarChar(100)
  capitalRange  String    @db.VarChar(100)
  message       String?   @db.Text
  consent       Boolean   @default(true)
  status        String    @default("NEW") @db.VarChar(50)
  assignedTo    String?   @db.Uuid
  internalNotes String?   @db.Text
  createdAt     DateTime  @default(now()) @db.Timestamptz
  updatedAt     DateTime  @updatedAt @db.Timestamptz

  user          User?     @relation("UserEnquiries", fields: [userId], references: [id], onDelete: SetNull)
  assignedStaff User?     @relation("AssignedStaffEnquiries", fields: [assignedTo], references: [id], onDelete: SetNull)

  @@index([referenceId])
  @@index([email])
}

model Grievance {
  id               String    @id @default(uuid()) @db.Uuid
  ticketId         String    @unique @db.VarChar(50)
  complainantName  String    @db.VarChar(255)
  email            String    @db.VarChar(255)
  phone            String    @db.VarChar(50)
  transactionRef   String?   @db.VarChar(100)
  subject          String    @db.VarChar(255)
  description      String    @db.Text
  status           String    @default("SUBMITTED") @db.VarChar(50)
  resolutionNotes  String?   @db.Text
  slaDeadline      DateTime  @db.Timestamptz
  createdAt        DateTime  @default(now()) @db.Timestamptz
  updatedAt        DateTime  @updatedAt @db.Timestamptz

  @@index([ticketId])
  @@index([status])
}

model AuditLog {
  id           String    @id @default(uuid()) @db.Uuid
  actorId      String?   @db.VarChar(255)
  actorEmail   String?   @db.VarChar(255)
  actorRole    String?   @db.VarChar(50)
  action       String    @db.VarChar(100)
  resourceType String    @db.VarChar(100)
  resourceId   String?   @db.VarChar(255)
  details      Json?
  ipAddress    String?   @db.VarChar(45)
  status       String    @default("SUCCESS") @db.VarChar(20)
  createdAt    DateTime  @default(now()) @db.Timestamptz

  @@index([actorEmail])
  @@index([action])
  @@index([resourceType])
  @@index([createdAt])
}

model Notification {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @db.Uuid
  title     String   @db.VarChar(255)
  message   String   @db.Text
  type      String   @db.VarChar(50)
  link      String?  @db.VarChar(255)
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now()) @db.Timestamptz

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model DeletionRequest {
  id                     String   @id @default(uuid()) @db.Uuid
  requestId              String   @unique @db.VarChar(50)
  userId                 String?  @db.Uuid
  fullName               String   @db.VarChar(255)
  email                  String   @db.VarChar(255)
  phone                  String   @db.VarChar(50)
  reason                 String?  @db.Text
  status                 String   @default("PENDING") @db.VarChar(50)
  statutoryRetentionNotes String? @db.Text
  createdAt              DateTime @default(now()) @db.Timestamptz
  updatedAt              DateTime @updatedAt @db.Timestamptz

  user                   User?    @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([requestId])
}
```

---

## 5. Security & Compliance Architecture

### 5.1 Credential & Session Security
* **Password Hashing:** Argon2id or Scrypt with 16-byte cryptographically random salt.
* **Tokens & Sessions:** Dual-token strategy:
  1. Access Token: Signed JWT (HS256 or RS256), 15-minute lifespan, containing `sub`, `email`, `role`.
  2. Refresh Token: Opaque 32-byte cryptographic string, stored in database with device fingerprinting and 7-day expiration.
* **Cookies:** `HttpOnly`, `Secure` (in non-local environments), `SameSite=Strict`.

### 5.2 Transport & Defense-in-Depth
* **Rate Limiting:** Enforced via `@nestjs/throttler` (default: 60 req/min general; 5 req/min on `/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`, `/api/auth/reset-password`; 5 req/5 min on `/api/enquiries` and `/api/project-funding`).
* **HTTP Security Headers:** Configured via `helmet` (HSTS, X-Content-Type-Options: nosniff, Frameguard: DENY, Referrer-Policy).
* **CORS Restrictions:** Whitelist strictly locked to `https://niventra-capital-advisory.vercel.app`, configurable via `CORS_ORIGINS`, and designated development origins.
* **Input Sanitization & DTO Validation:** Global `ValidationPipe` with `{ whitelist: true, forbidNonWhitelisted: true, transform: true }`.

### 5.3 Statutory & Regulatory Review
* **DPDP Act, 2023:** Full adherence to data minimization, statutory retention notes, right to erasure queue, and Indian PAN/Aadhaar masking.
* **Financial Disclaimers:** Rejection of guaranteed return language; strict adherence to Section 42 (Private Placement) and Section 71 (Debentures) of the Companies Act, 2013.

---

## 6. Zero-Downtime Data Migration Plan (Phase 7 Execution)

```
[Local SQLite data/niventra.db]
               |
               v
  Step 1: Verified File Backup (data/niventra.db.bak_{timestamp})
               |
               v
  Step 2: Extraction & Parity Verification Scripts (`scripts/migrate-sqlite-to-pg.mjs` & `scripts/verify-migration-parity.mjs`)
          - Extract all 14 SQLite tables and verify authentic users & ENQ-2026-0006 lead integrity
               |
               v
  Step 3: Provision PostgreSQL Instance (AWS RDS or Neon with SSL)
               |
               v
  Step 4: Execute Prisma Migrations (npx prisma migrate deploy)
               |
               v
  Step 5: Insert Verified Records with Primary Key Preservation
               |
               v
  Step 6: Automated Integrity Audit (Verify row counts, scrypt password hashes, and relations)
               |
               v
  Step 7: Switch Backend Service to PostgreSQL (Keep SQLite in read-only mode during transition)
```

---

## 7. Quality Gates & CI/CD Pipeline

The repository includes an automated GitHub Actions pipeline at `.github/workflows/ci.yml` enforcing both `frontend-verify` (lint, typecheck, `node --test`, `next build`) and `backend-verify` (`prisma validate`, `prisma generate`, lint, typecheck, `nest build`, Jest unit tests, and Supertest E2E suite).
