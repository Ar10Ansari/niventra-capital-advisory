# Niventra Capital Advisory — API Reference Specification

**Document Type:** REST API Specification & Endpoint Contracts  
**Classification:** Confidential — Engineering Internal  
**Repository Path:** `docs/api/API_REFERENCE.md`  
**Base URL (Frontend Production):** `https://niventra-capital-advisory.vercel.app`  
**Base URL (Local Frontend / NestJS Backend):** `http://localhost:3000` / `http://localhost:4000`  
**Interactive OpenAPI / Swagger UI (NestJS):** `GET /api/docs`  
**Authentication Methods:** Dual HttpOnly cookie (`niventra_session`) and `Authorization: Bearer <jwt>` (resolved transparently by `SessionOrJwtAuthGuard` on the standalone NestJS API).

---

## 1. Authentication & Session Primitives

### 1.1 `POST /api/auth/register`
* **Description:** Registers a new user account. Public registrations are strictly assigned the `INVESTOR` role; `ADMIN` and `STAFF` accounts cannot be registered publicly.
* **Access Control:** Public
* **Request Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "password": "SecurePassword123!",
    "phone": "+91 98765 43210"
  }
  ```
* **Validation Rules:**
  * `name`: string, required, min 1 character.
  * `email`: string, required, valid email format (converted to lowercase).
  * `password`: string, required, min 8 characters.
  * `phone`: string, optional.
* **Response (200 OK):**
  * Sets HttpOnly Cookie: `niventra_session=<token>; Path=/; SameSite=Lax; Max-Age=604800`
  ```json
  {
    "success": true,
    "user": {
      "id": "usr_example_investor_001",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "role": "INVESTOR"
    }
  }
  ```
* **Error Responses:**
  * `400 Bad Request`: `{ "error": "Password must be at least 8 characters long." }`
  * `409 Conflict`: `{ "error": "An account with this email address already exists." }`
  * `500 Internal Server Error`: `{ "error": "Internal server error." }`

---

### 1.2 `POST /api/auth/login`
* **Description:** Authenticates user credentials via scrypt verification. Returns generic error messages to prevent account enumeration.
* **Access Control:** Public
* **Request Body:**
  ```json
  {
    "email": "jane.doe@example.com",
    "password": "SecurePassword123!"
  }
  ```
* **Response (200 OK):**
  * Sets HttpOnly Cookie: `niventra_session=<token>`
  ```json
  {
    "success": true,
    "user": {
      "id": "usr_example_investor_001",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "role": "INVESTOR"
    }
  }
  ```
* **Error Responses:**
  * `400 Bad Request`: `{ "error": "Email and password are required." }`
  * `401 Unauthorized`: `{ "error": "Invalid email or password." }`
  * `403 Forbidden`: `{ "error": "Your account is not active. Please contact support." }`

---

### 1.3 `GET /api/auth/me`
* **Description:** Resolves session token from `niventra_session` cookie and returns current user profile.
* **Access Control:** Public / Session Cookie
* **Response (200 OK - Authenticated):**
  ```json
  {
    "authenticated": true,
    "user": {
      "id": "usr_example_investor_001",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "role": "INVESTOR",
      "phone": "+91 98765 43210",
      "status": "ACTIVE",
      "created_at": "2026-10-22 17:08:39"
    }
  }
  ```
* **Response (401 Unauthorized - Unauthenticated):**
  ```json
  {
    "authenticated": false,
    "user": null
  }
  ```

---

### 1.4 `POST /api/auth/logout`
* **Description:** Invalidates session token in database and deletes session cookie.
* **Access Control:** Public / Session Cookie
* **Response (200 OK):**
  * Cookie cleared: `niventra_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  ```json
  {
    "success": true,
    "message": "Logged out successfully."
  }
  ```

---

### 1.5 `POST /api/auth/forgot-password` & `POST /api/auth/reset-password` *(NestJS Backend)*
* **Description:** Single-use password recovery flow backed by SHA-256 hashed tokens (`password_reset_tokens`, 30-minute TTL). `forgot-password` always returns a uniform 200 message regardless of whether an email exists to prevent enumeration; `reset-password` updates scrypt credentials, marks the reset token used, and revokes all active user sessions in a database transaction.
* **Access Control:** Public (Rate limited: 5 req/min/IP)
* **Request Bodies:**
  * `POST /api/auth/forgot-password`: `{ "email": "jane.doe@example.com" }`
  * `POST /api/auth/reset-password`: `{ "token": "<64-hex-token>", "newPassword": "NewSecurePassword123!" }`

---

## 1B. Account Profile, Preferences & DPDP Erasure

* `PATCH /api/account/profile` (`GET /api/users/profile`, `PATCH /api/users/profile`): Updates legal name, phone, and optional `investorCategory` (`HNI`, `FAMILY_OFFICE`, `CORPORATE`, `INSTITUTIONAL`).
* `GET /api/account/preferences` & `PATCH /api/account/preferences`: Persists boolean communication toggles (`notifyConsultations`, `notifyDisclosures`, `notifyGrievances`).
* `POST /api/account/change-password`: Verifies `currentPassword` against stored scrypt hash and updates credentials (`200 OK` or `403 Forbidden`).
* `POST /api/account/delete` (legacy alias `/api/users/delete-account`): Queues a `DEL-2026-*` DPDP Act 2023 erasure request with mandatory statutory retention notes (`200 OK`), setting authenticated accounts to `PENDING_DELETION`.

---

## 2. Real Estate Project Funding

### 2.1 `POST /api/project-funding`
* **Description:** Public submission endpoint for developer capital applications. Enforces honeypot protection, field validations, and duplicate suppression.
* **Access Control:** Public
* **Request Body:**
  ```json
  {
    "applicantName": "Rajendra Singhania",
    "organizationName": "Singhania Buildcon Pvt. Ltd.",
    "email": "rajendra@singhaniabuildcon.example",
    "phone": "+91 98765 11223",
    "role": "Managing Director",
    "website": "https://singhaniabuildcon.example",
    "projectName": "Green Crest Meadows & Towers",
    "category": "RESIDENTIAL",
    "address": "Plot 45, Sector 12, Bypass Road",
    "city": "Indore",
    "state": "Madhya Pradesh",
    "pinCode": "452010",
    "landStatus": "Freehold (100% Owned)",
    "stage": "UNDER_CONSTRUCTION",
    "description": "Multi-tower residential project comprising 180 3BHK units with valid RERA registration.",
    "totalCost": 450000000,
    "fundingRequested": 120000000,
    "promoterContribution": 180000000,
    "useOfFunds": "Accelerating superstructure construction and civil contractor advances.",
    "expectedTimeline": "24 Months to Handover",
    "existingLoans": "₹8 Cr term loan with SBI (Standard asset, regular debt service).",
    "documents": [
      { "name": "rera_certificate.pdf", "category": "RERA", "size": 1048576 }
    ],
    "consentGiven": true,
    "website_hp": ""
  }
  ```
* **Response (200 OK / 201 Created on NestJS):**
  ```json
  {
    "success": true,
    "referenceNumber": "PRJ-202611-4821",
    "applicationId": "prj_a1b2c3d4e5f67890",
    "message": "Your project funding application has been successfully submitted for preliminary evaluation."
  }
  ```

---

### 2.2 `GET /api/project-funding`
* **Description:** Retrieves paginated project applications with filters.
* **Access Control:** Staff or Admin (`ADMIN`, `STAFF`)
* **Query Parameters:**
  * `status`: Filter by status (`ALL`, `RECEIVED`, `UNDER_REVIEW`, `SHORTLISTED`, `DECLINED`, etc.)
  * `category`: Filter by category (`ALL`, `RESIDENTIAL`, `COMMERCIAL`, etc.)
  * `state`: Filter by state
  * `q`: Text search across reference number, project name, developer, or city
* **Response (200 OK):**
  ```json
  {
    "applications": [ ... ],
    "totalCount": 24,
    "statusCounts": [
      { "status": "RECEIVED", "count": 10 },
      { "status": "UNDER_REVIEW", "count": 8 },
      { "status": "SHORTLISTED", "count": 6 }
    ]
  }
  ```

---

### 2.3 `PATCH /api/project-funding/[id]`
* **Description:** Updates review status, attaches internal desk notes, or logs reasons for decline.
* **Access Control:** Staff or Admin (`ADMIN`, `STAFF`)
* **Request Body:**
  ```json
  {
    "status": "SHORTLISTED",
    "internalNotes": "Independent title verification clean. Collateral coverage ratio 1.85x confirmed by technical auditor.",
    "changeNote": "Transitioned to SHORTLISTED following Investment Committee review"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Project application PRJ-202611-4821 updated successfully.",
    "status": "SHORTLISTED"
  }
  ```

---

## 3. Consultations & CRM Lead Pipeline

### 3.1 `POST /api/enquiries`
* **Description:** Records an advisory consultation request from an investor or borrower.
* **Access Control:** Public
* **Request Body:**
  ```json
  {
    "fullName": "Vikramaditya Sharma",
    "email": "investor@example.com",
    "phoneNumber": "+91 98765 00003",
    "category": "Capital Provider / Investor",
    "capitalRange": "₹50 Lakh – ₹1 Crore",
    "message": "Requesting consultation regarding senior secured debentures.",
    "consent": true,
    "website_hp": ""
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "referenceId": "ENQ-2026-0007",
    "message": "Your consultation request has been recorded. Our advisory desk will reach out within one business day."
  }
  ```

---

### 3.2 `GET /api/enquiries`
* **Description:** Lists inquiries. Investors only see their own inquiries; Staff and Admins see all.
* **Access Control:** Authenticated (`INVESTOR`, `STAFF`, `ADMIN`)
* **Response (200 OK):**
  ```json
  {
    "enquiries": [
      {
        "id": "ENQ-2026-0007",
        "full_name": "Vikramaditya Sharma",
        "email": "investor@example.com",
        "phone_number": "+91 98765 00003",
        "category": "Capital Provider / Investor",
        "capital_range": "₹50 Lakh – ₹1 Crore",
        "message": "Requesting consultation regarding senior secured debentures.",
        "status": "NEW",
        "created_at": "2026-11-11 14:39:14"
      }
    ]
  }
  ```

---

## 4. Investments & Investor Ledger

### 4.1 `GET /api/investments`
* **Description:** Retrieves debenture investments and aggregates portfolio metrics. Enforces cross-investor authorization boundaries.
* **Access Control:** Authenticated (`INVESTOR` can only access self; `STAFF` / `ADMIN` can query any `userId`)
* **Query Parameters:** `userId` (optional for staff), `status` (`ALL`, `ACTIVE`, `MATURED`)
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "investments": [
      {
        "id": "INV-DEMO-001",
        "user_id": "usr_investor_dev",
        "product_id": "prod_ncd_tranche_a",
        "product_title": "[ILLUSTRATIVE MODEL] Secured Real Estate Debenture Tranche A",
        "principal_amount": 2500000,
        "interest_rate_pa": 14.5,
        "tenor_months": 36,
        "payout_frequency": "QUARTERLY",
        "start_date": "2025-04-01",
        "maturity_date": "2028-03-31",
        "accrued_interest": 543750,
        "interest_paid": 362500,
        "pending_interest": 181250,
        "next_payout_date": "2026-12-31",
        "status": "ACTIVE",
        "is_demo": 1
      }
    ],
    "summary": {
      "totalPrincipal": 2500000,
      "activeCount": 1,
      "accruedInterest": 543750,
      "interestPaid": 362500,
      "pendingInterest": 181250,
      "nextPayoutDate": "2026-12-31",
      "currency": "INR"
    }
  }
  ```

---

## 5. KYC & Statutory Compliance

### 5.1 `POST /api/kyc`
* **Description:** Submits investor PAN and identity documents for institutional onboarding. Masks PII before persisting.
* **Access Control:** Authenticated Investor
* **Request Body:**
  ```json
  {
    "panNumber": "ABCDE1234F",
    "idType": "PAN",
    "idNumber": "ABCDE1234F",
    "consent": true
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "KYC documentation submitted for institutional compliance verification.",
    "status": "PENDING_VERIFICATION"
  }
  ```

---

## 6. Grievance Redressal

### 6.1 `POST /api/grievances`
* **Description:** Lodges formal grievance ticket under the company's 48-hour acknowledgment SLA.
* **Access Control:** Public / Authenticated
* **Request Body:**
  ```json
  {
    "complainantName": "Rahul Verma",
    "email": "rahul.verma@example.com",
    "phone": "+91 98765 99887",
    "transactionRef": "TXN-2026-0914",
    "subject": "Delay in quarterly interest confirmation note",
    "description": "I have not received the TDS deduction certificate for Q2."
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "ticketId": "GRV-2026-0002",
    "slaDeadline": "2026-12-11T14:30:00.000Z",
    "message": "Grievance successfully registered with Grievance Redressal Officer."
  }
  ```

---

## 7. Institutional Chatbot & Grounded AI

### 7.1 `POST /api/chat`
* **Description:** Grounded institutional question-and-answer retrieval against verified regulatory disclosures.
* **Access Control:** Public
* **Request Body:**
  ```json
  {
    "message": "What is the security structure and indicative yield on your debentures?"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "answer": "Niventra structures senior secured Non-Convertible Debentures (NCDs) under the Companies Act, 2013 framework...",
    "citations": [
      { "title": "Debenture Returns & Yield Guidance", "url": "/debt-debenture/" },
      { "title": "5-Point Due Diligence Methodology", "url": "/due-diligence/" }
    ],
    "isConfident": true,
    "needsAdvisoryEscalation": false
  }
  ```

---

## 8. Additional Backend Resource Endpoints (`NestJS`)

* **Authentication & CSRF (`AuthModule`):**
  * `GET /api/auth/csrf` — Issue session-bound HMAC-SHA256 `csrfToken` / `X-CSRF-Token` header.
* **Products & Holdings:**
  * `GET /api/products` — Public listing filtered to `status: "PUBLISHED"` for guests (`ADMIN` / `STAFF` see drafts too).
  * `POST /api/products` — Publish a new product structure (`ADMIN` only).
  * `GET /api/investments/[id]` — Single debenture holding with chronological `transactions` ledger (owner or `ADMIN`/`STAFF` only; cross-investor `403`).
  * `GET /api/portfolio/summary` & `GET /api/transactions` — Investor-scoped active portfolio totals (paise-exact) and payout/TDS ledger (`GET` read-only).
* **Documents & Watermarked Access:**
  * `GET /api/documents` — Returns only approved `is_public` items for unauthenticated requests; all `APPROVED` compliance/offer documents (excluding other investors' private files) for authorized roles (`INVESTOR`, `STAFF`, `ADMIN`).
  * `POST /api/documents` — Register controlled document metadata (`ADMIN` only).
  * `POST /api/documents/upload` — Upload validated binary document (`ADMIN` only, `15 MB` cap, magic-byte & MIME/extension validation).
  * `GET /api/documents/[id]/download` — Enforces `APPROVED` status, role allowlist, and owner isolation; streams file with `nosniff` + dynamic MIME extension or returns `APPROVED_PENDING_COUNSEL_WATERMARK` notice.
* **Health Probes (`HealthModule`):**
  * `GET /api/health` & `GET /api/health/live` — Liveness probes.
  * `GET /api/health/ready` — Readiness probe verifying database connectivity (`$queryRaw SELECT 1`).
* **Administrative Operations & Audit Logs:**
  * `GET /api/admin/overview`, `GET /api/admin/grievances`, `PATCH /api/admin/grievances/[id]` (`ADMIN` / `STAFF`).
  * `GET /api/audit-logs` — Immutable PII-redacted security audit log feed (`ADMIN` only).
* **Public Advisory Utilities:**
  * `GET /api/branches` — Searchable 25-location verified institutional & regional branch directory (`?q=`, `?tier=`).
  * `POST /api/calculator/simulate` — Authoritative server-side simple-interest repayment schedule and statutory TDS disclosure calculator (`principal`, `annualRatePct`, `tenorMonths`, `payoutFrequency`).
