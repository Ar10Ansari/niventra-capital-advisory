# Niventra Capital Advisory — Database Schema Data Dictionary

**Document Type:** Database Architecture & Entity-Relationship Data Dictionary  
**Classification:** Confidential — Engineering Internal  
**Repository Path:** `docs/database/SCHEMA_DICTIONARY.md`  

---

## 1. Relational Entity Overview

The PostgreSQL target schema (`backend/prisma/schema.prisma`) comprises 15 normalized tables: all 14 relational tables migrated from SQLite (`data/niventra.db`) plus `password_reset_tokens` for single-use account recovery. Primary and foreign keys use `VARCHAR(128)` with UUIDv4 defaults for newly created records while preserving existing SQLite string identifiers (`usr_*`, `ENQ-*`, `GRV-*`, `INV-*`) verbatim during migration.

```
       +--------------------+
       |       users        |<------------------+
       +--------------------+                   |
         |        |        |                    |
         | 1:N    | 1:1    | 1:N                |
         v        v        v                    |
    +----------+ +-----------+ +-------------+  |
    | sessions | |kyc_records| | investments |  |
    +----------+ +-----------+ +-------------+  |
                                 |        |     |
                                 | 1:N    | N:1 |
                                 v        v     |
                 +-----------------------+ +----------+
                 |investment_transactions| | products |
                 +-----------------------+ +----------+

       +----------------------+         +------------------------+
       | project_applications |<---1:N--| project_status_history |
       +----------------------+         +------------------------+
         |
         | (Assigned to)
         v
       +--------------------+
       |       users        |
       +--------------------+

       +-----------+   +------------+   +---------------+   +------------+
       | enquiries |   | grievances |   | deletion_reqs |   | audit_logs |
       +-----------+   +------------+   +---------------+   +------------+
```

---

## 2. Table-by-Table Data Dictionary

### 2.1 Table: `users`
Represents registered users across all roles.
* `id` (`TEXT` / `UUID`): Primary key. e.g. `usr_example_investor_001`.
* `name` (`TEXT` / `VARCHAR(255)`): Full legal name.
* `email` (`TEXT` / `VARCHAR(255)`): Unique email address (lowercased). Indexed.
* `password_hash` (`TEXT` / `VARCHAR(255)`): Cryptographic scrypt or argon2 hash.
* `salt` (`TEXT` / `VARCHAR(64)`): Unique per-user random salt.
* `role` (`TEXT` / `ENUM`): `PUBLIC`, `INVESTOR`, `STAFF`, `ADMIN`.
* `phone` (`TEXT` / `VARCHAR(50)`): Mobile contact number.
* `investor_category` (`TEXT` / `VARCHAR(50)`): Optional classification (`HNI`, `FAMILY_OFFICE`, `CORPORATE`, `INSTITUTIONAL`).
* `notify_consultations`, `notify_disclosures`, `notify_grievances` (`INTEGER` / `BOOLEAN`): Persisted notification preferences (default `TRUE`).
* `status` (`TEXT` / `ENUM`): `ACTIVE`, `SUSPENDED`, `PENDING_DELETION`.
* `created_at` (`DATETIME` / `TIMESTAMPTZ`): Record creation timestamp.
* `updated_at` (`DATETIME` / `TIMESTAMPTZ`): Record update timestamp.

### 2.2 Table: `sessions`
Tracks active authenticated sessions.
* `id` (`TEXT` / `UUID`): Primary key.
* `user_id` (`TEXT` / `UUID`): Foreign key referencing `users.id` with `ON DELETE CASCADE`.
* `token` (`TEXT` / `VARCHAR(255)`): 32-byte cryptographic random hex token. Unique, indexed.
* `expires_at` (`DATETIME` / `TIMESTAMPTZ`): Expiration timestamp (default 7 days).
* `created_at` (`DATETIME` / `TIMESTAMPTZ`): Session initiation timestamp.

### 2.3 Table: `project_applications`
Captures real estate developer capital funding requests.
* `id` (`TEXT` / `UUID`): Primary key. e.g. `prj_a1b2c3d4e5f67890`.
* `reference_number` (`TEXT` / `VARCHAR(50)`): Unique human-readable code. e.g. `PRJ-202611-4821`.
* `applicant_name` (`TEXT` / `VARCHAR(255)`): Full name of developer/promoter.
* `organization_name` (`TEXT` / `VARCHAR(255)`): Entity legal name.
* `email` (`TEXT` / `VARCHAR(255)`): Developer email.
* `phone` (`TEXT` / `VARCHAR(50)`): Developer phone.
* `role` (`TEXT` / `VARCHAR(100)`): Designation (Director, Partner, Promoter).
* `website` (`TEXT` / `VARCHAR(255)`): Developer official website.
* `project_name` (`TEXT` / `VARCHAR(255)`): Name of real estate development.
* `category` (`TEXT` / `ENUM`): `RESIDENTIAL`, `COMMERCIAL`, `MIXED_USE`, `PLOTTED_DEVELOPMENT`, `REDEVELOPMENT`, `INDUSTRIAL`, `OTHER`.
* `address`, `city`, `state`, `pin_code` (`TEXT`): Project site location.
* `landStatus` (`TEXT`): Land ownership / joint-development rights status.
* `stage` (`TEXT` / `ENUM`): `LAND_ACQUISITION`, `PLANNING_APPROVALS`, `UNDER_CONSTRUCTION`, `COMPLETED`, `OTHER`.
* `description` (`TEXT`): Detailed project description and absorption dynamics.
* `total_cost` (`REAL` / `DECIMAL(18,2)`): Total project budget in INR.
* `funding_requested` (`REAL` / `DECIMAL(18,2)`): Financing tranche requested.
* `promoter_contribution` (`REAL` / `DECIMAL(18,2)`): Equity/promoter funds invested.
* `use_of_funds` (`TEXT`): Proposed deployment of proceeds.
* `expected_timeline` (`TEXT`): Anticipated construction and completion milestones.
* `existing_loans` (`TEXT`): Prior encumbrances or bank debt.
* `documents` (`TEXT` / `JSON`): Sanitized metadata array of attached files.
* `consent_given` (`INTEGER` / `BOOLEAN`): Mandatory applicant data processing consent.
* `status` (`TEXT` / `ENUM`): `RECEIVED`, `UNDER_REVIEW`, `MORE_INFORMATION_REQUIRED`, `SHORTLISTED`, `DECLINED`, `CLOSED`.
* `assigned_to` (`TEXT` / `UUID`): Foreign key referencing `users.id` (reviewing staff).
* `internal_notes` (`TEXT`): Confidential deal desk comments.
* `decline_reason` (`TEXT`): Factual reasoning if rejected.
* `info_requested` (`TEXT`): Additional diligence items requested.
* `is_demo` (`INTEGER` / `BOOLEAN`): Flag separating mock fixtures from real submissions.
* `created_at`, `updated_at` (`DATETIME` / `TIMESTAMPTZ`).

### 2.4 Table: `project_status_history`
Maintains an immutable audit trail of project status transitions.
* `id` (`TEXT` / `UUID`): Primary key.
* `project_id` (`TEXT` / `UUID`): Foreign key referencing `project_applications.id` with `ON DELETE CASCADE`.
* `previous_status` (`TEXT` / `VARCHAR(50)`): Pre-transition state.
* `new_status` (`TEXT` / `VARCHAR(50)`): Post-transition state.
* `changed_by` (`TEXT` / `VARCHAR(255)`): Staff user who authorized the transition.
* `change_note` (`TEXT`): Justification or committee minute extract.
* `created_at` (`DATETIME` / `TIMESTAMPTZ`): Timestamp of transition.

### 2.5 Table: `investments`
Tracks investor debenture allocations.
* `id` (`TEXT` / `UUID`): Primary key. e.g. `INV-DEMO-001`.
* `user_id` (`TEXT` / `UUID`): Foreign key referencing `users.id` with `ON DELETE CASCADE`.
* `product_id` (`TEXT` / `UUID`): Foreign key referencing `products.id`.
* `product_title` (`TEXT` / `VARCHAR(255)`): Cached product title for immutability.
* `principal_amount` (`REAL` / `DECIMAL(18,2)`): Capital allocated in INR.
* `interest_rate_pa` (`REAL` / `DECIMAL(5,2)`): Annual simple interest coupon rate.
* `tenor_months` (`INTEGER`): Duration in months.
* `payout_frequency` (`TEXT` / `ENUM`): `MONTHLY`, `QUARTERLY`, `SEMI_ANNUAL`, `ANNUAL`, `CUMULATIVE`.
* `start_date`, `maturity_date` (`DATE`): Term schedule boundaries.
* `accrued_interest` (`REAL` / `DECIMAL(18,2)`): Interest earned to date.
* `interest_paid` (`REAL` / `DECIMAL(18,2)`): Distributions disbursed to date.
* `pending_interest` (`REAL` / `DECIMAL(18,2)`): Balance accrued awaiting scheduled payment.
* `next_payout_date` (`DATE`): Next upcoming coupon disbursement date.
* `status` (`TEXT` / `ENUM`): `PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `ACTIVE`, `MATURED`, `CANCELLED`.
* `is_demo` (`INTEGER` / `BOOLEAN`): Flag separating demonstration allocations from real funds.
* `created_at`, `updated_at` (`DATETIME` / `TIMESTAMPTZ`).

### 2.6 Table: `investment_transactions`
Individual financial disbursements, allocations, and tax deductions.
* `id` (`TEXT` / `UUID`): Primary key.
* `investment_id` (`TEXT` / `UUID`): Foreign key referencing `investments.id` with `ON DELETE CASCADE`.
* `user_id` (`TEXT` / `UUID`): Foreign key referencing `users.id`.
* `transaction_type` (`TEXT` / `ENUM`): `PRINCIPAL_ALLOCATION`, `INTEREST_PAYOUT`, `TDS_DEDUCTION`, `REDEMPTION`.
* `amount` (`REAL` / `DECIMAL(18,2)`): Transaction value in INR.
* `status` (`TEXT` / `ENUM`): `SCHEDULED`, `PROCESSED`, `FAILED`.
* `payment_reference` (`TEXT` / `VARCHAR(100)`): NEFT/RTGS UTR or bank reference number.
* `effective_date` (`DATE`): Value date of transaction.
* `is_demo` (`INTEGER` / `BOOLEAN`): Demo isolation flag.
* `created_at` (`DATETIME` / `TIMESTAMPTZ`).

### 2.7 Table: `enquiries`
Advisory leads and client consultation pipeline.
* `id` (`TEXT` / `VARCHAR(50)`): Serialized reference. e.g. `ENQ-2026-0001`.
* `user_id` (`TEXT` / `UUID`): Optional foreign key to `users.id` if prospect is logged in.
* `full_name` (`TEXT` / `VARCHAR(255)`): Contact name.
* `email` (`TEXT` / `VARCHAR(255)`): Contact email.
* `phone_number` (`TEXT` / `VARCHAR(50)`): Contact phone.
* `category` (`TEXT` / `VARCHAR(100)`): Prospect classification.
* `capital_range` (`TEXT` / `VARCHAR(100)`): Intended ticket size.
* `message` (`TEXT`): Consultation inquiry details.
* `consent` (`INTEGER` / `BOOLEAN`): DPDP Act 2023 processing consent.
* `status` (`TEXT` / `ENUM`): `NEW`, `IN_REVIEW`, `CONTACTED`, `QUALIFIED`, `FOLLOW_UP`, `CONVERTED`, `CLOSED`.
* `assigned_to` (`TEXT` / `UUID`): Staff member assigned to lead.
* `internal_notes` (`TEXT`): Private CRM interaction notes.
* `created_at`, `updated_at` (`DATETIME` / `TIMESTAMPTZ`).

### 2.8 Table: `kyc_records`
Statutory investor identification records.
* `id` (`TEXT` / `UUID`): Primary key.
* `user_id` (`TEXT` / `UUID`): Unique foreign key to `users.id` (`ON DELETE CASCADE`).
* `pan_number_masked` (`TEXT` / `VARCHAR(20)`): Masked PAN (`AAAPN*****1F`).
* `id_type` (`TEXT` / `VARCHAR(50)`): `PAN`, `AADHAAR`, `PASSPORT`, `VOTER_ID`.
* `id_number_masked` (`TEXT` / `VARCHAR(50)`): Masked identification number (`********4829`).
* `status` (`TEXT` / `ENUM`): `NOT_SUBMITTED`, `PENDING_VERIFICATION`, `VERIFIED`, `REJECTED`.
* `verified_at` (`DATETIME` / `TIMESTAMPTZ`): Verification timestamp.
* `rejection_reason` (`TEXT`): Compliance rationale if unapproved.
* `dpdp_consent` (`INTEGER` / `BOOLEAN`): Explicit statutory verification consent.
* `created_at`, `updated_at` (`DATETIME` / `TIMESTAMPTZ`).

### 2.9 Table: `grievances`
Regulatory dispute resolution tracking.
* `id` (`TEXT` / `VARCHAR(50)`): Ticket identifier (`GRV-2026-0001`).
* `user_id` (`TEXT` / `UUID`): Optional link to registered user.
* `complainant_name`, `email`, `phone` (`TEXT`): Complainant particulars.
* `transaction_ref` (`TEXT`): Optional disputed transaction code.
* `subject` (`TEXT`): Nature of grievance.
* `description` (`TEXT`): Full factual summary.
* `status` (`TEXT` / `ENUM`): `SUBMITTED`, `ACKNOWLEDGED`, `UNDER_INVESTIGATION`, `RESOLVED`, `ESCALATED`.
* `assigned_to` (`TEXT` / `UUID`): Grievance Redressal Officer.
* `resolution_notes` (`TEXT`): Formal outcome and actions taken.
* `sla_deadline` (`DATETIME` / `TIMESTAMPTZ`): Mandatory 30-day statutory resolution deadline.
* `created_at`, `updated_at` (`DATETIME` / `TIMESTAMPTZ`).

### 2.10 Table: `audit_logs`
Immutable regulatory and security event trail.
* `id` (`TEXT` / `UUID`): Primary key.
* `actor_id` (`TEXT` / `VARCHAR(255)`): User ID or system service identifier.
* `actor_email` (`TEXT` / `VARCHAR(255)`): Email of actor.
* `actor_role` (`TEXT` / `VARCHAR(50)`): Role at time of action.
* `action` (`TEXT` / `VARCHAR(100)`): Action code (e.g. `AUTH_LOGIN_SUCCESS`, `PROJECT_FUNDING_STATUS_UPDATED`).
* `resource_type` (`TEXT` / `VARCHAR(100)`): Target entity type (`SESSION`, `PROJECT_APPLICATION`, etc.).
* `resource_id` (`TEXT` / `VARCHAR(255)`): Target entity ID.
* `details` (`TEXT` / `JSON`): Structured JSON payload of change context.
* `ip_address` (`TEXT` / `VARCHAR(45)`): Request IP address.
* `status` (`TEXT` / `VARCHAR(20)`): `SUCCESS`, `FAILED`, `BLOCKED`.
* `created_at` (`DATETIME` / `TIMESTAMPTZ`): Immutable log timestamp.

### 2.11 Table: `deletion_requests`
DPDP Act 2023 personal data erasure queue.
* `id` (`TEXT` / `VARCHAR(50)`): Serialized request reference (`DEL-2026-0001`).
* `user_id` (`TEXT` / `UUID`): User account identifier.
* `full_name`, `email`, `phone` (`TEXT`): Data subject details.
* `reason` (`TEXT`): Rationale submitted by data subject.
* `status` (`TEXT` / `ENUM`): `PENDING`, `VERIFIED`, `COMPLETED`, `REJECTED`.
* `statutory_retention_notes` (`TEXT`): Legal basis for exempt financial record retention under Companies Act 2013 and PMLA 2002.
* `created_at`, `updated_at` (`DATETIME` / `TIMESTAMPTZ`).

### 2.12 Table: `notifications`
User notifications and alerts.
* `id` (`TEXT` / `UUID`): Primary key.
* `user_id` (`TEXT` / `UUID`): Target user (`ON DELETE CASCADE`).
* `title` (`TEXT` / `VARCHAR(255)`): Notification headline.
* `message` (`TEXT`): Notification content.
* `type` (`TEXT` / `ENUM`): `ENQUIRY`, `GRIEVANCE`, `SECURITY`, `SYSTEM`, `DOCUMENT`.
* `link` (`TEXT` / `VARCHAR(255)`): Destination URL.
* `is_read` (`INTEGER` / `BOOLEAN`): Read status flag.
* `created_at` (`DATETIME` / `TIMESTAMPTZ`).

### 2.13 Table: `products`
Debenture and structured private-debt product catalog definitions.
* `id` (`VARCHAR(128)`): Primary key (e.g. `prod_ncd_tranche_a`).
* `slug` (`VARCHAR(100)`): Unique URL identifier.
* `title`, `category`, `indicative_yield`, `tenor`, `min_investment`, `security_type`: Structured offering attributes.
* `status` (`VARCHAR(50)`): `PUBLISHED` or draft state (`PUBLISHED` visible publicly).
* `summary`, `description`, `risks_summary` (`TEXT`): Compliance and risk disclosures.
* `created_at`, `updated_at` (`TIMESTAMPTZ`).

### 2.14 Table: `documents`
Corporate policies and Form PAS-4 / term sheet disclosure metadata (`StorageAdapter` backed).
* `id` (`VARCHAR(128)`): Primary key (e.g. `doc_corporate_profile`, `doc_pas4_sample`).
* `title`, `doc_type`, `file_path`, `mime_type`, `version`: Document classification and safe storage key.
* `file_size` (`INTEGER`): Size in bytes.
* `is_public` (`BOOLEAN`): Controls unauthenticated visibility vs authenticated accreditation gating.
* `status` (`VARCHAR(50)`): Publication state (`APPROVED`).
* `created_at`, `updated_at` (`TIMESTAMPTZ`).

### 2.15 Table: `password_reset_tokens`
PostgreSQL-only table governing single-use account password recovery (30-minute TTL).
* `id` (`VARCHAR(128)`): UUIDv4 primary key.
* `user_id` (`VARCHAR(128)`): Foreign key referencing `users.id` (`ON DELETE CASCADE`).
* `token_hash` (`VARCHAR(128)`): Unique SHA-256 hex digest of raw single-use reset token (plaintext tokens are never persisted or logged).
* `expires_at` (`TIMESTAMPTZ`): Recovery token expiration timestamp.
* `used_at` (`TIMESTAMPTZ` nullable): Consumption / invalidation timestamp.
* `created_at` (`TIMESTAMPTZ`).
