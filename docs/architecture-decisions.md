# Niventra Capital Advisory — Architecture Decision Records (ADRs)

**Project:** Niventra Capital Advisory Platform  
**Date:** October 16, 2026  
**Status:** Active & Approved for Implementation  
**Architect:** Lead Technical Architect & Senior Full-Stack Engineer  

---

## ADR-001: Application Framework & Rendering Architecture

- **Status:** Accepted
- **Context:** Niventra requires a high-performance, SEO-optimized, accessible institutional financial services website paired with protected investor and administrator portals.
- **Decision:** Utilize Next.js 16 (App Router) with React 19, TypeScript, and Turbopack. Public routes are statically prerendered with dynamic metadata, while authenticated dashboards (`/dashboard`, `/admin`) utilize Server Components and secure server actions / route handlers.
- **Consequences:** Near-instant page loads for public visitors, zero hydration lag, server-enforced authentication boundaries, and complete path parity across canonical routes.

---

## ADR-002: Relational Database Persistence & ORM

- **Status:** Accepted
- **Context:** The platform requires real, persistent storage for users, roles, enquiries, grievances, product catalogues, documents, notifications, and immutable audit logs. The solution must run reliably in local development with zero external infrastructure assumptions, while supporting seamless migration to production PostgreSQL.
- **Decision:** Deploy Prisma ORM with SQLite for local development (`prisma/dev.db`), architected with standard relational schemas that cleanly translate to PostgreSQL via `DATABASE_URL` in production environments.
- **Consequences:** Immediate local zero-config persistence, type-safe database queries via `@prisma/client`, declarative schema migrations, and zero fake mock in-memory data disguised as storage.

---

## ADR-003: Authentication & Password Security

- **Status:** Accepted
- **Context:** Secure authentication is required for investors, staff operators, and administrators without introducing heavyweight external auth services that require internet-hosted cloud tenants.
- **Decision:** Implement native cryptographically signed HTTP-only cookie sessions using standard `node:crypto`. Passwords hashed using industry-standard `scrypt` with cryptographic salts (32-byte salt, 64-byte key). Session tokens signed via HMAC-SHA256 with server-side validation on every protected route.
- **Consequences:** Zero external cloud auth dependency, complete control over session lifetime, protection against XSS/CSRF, and immunity to account enumeration through generic error responses.

---

## ADR-004: Role-Based Access Control (RBAC) Hierarchy

- **Status:** Accepted
- **Context:** Public visitors, investors, support staff, and administrators have strictly segregated privileges.
- **Decision:** Implement a 4-tier role hierarchy:
  1. `PUBLIC`: Can browse public routes, submit enquiries, and lodge grievances.
  2. `INVESTOR`: Can access personal dashboard, track submitted enquiries, view permitted documents, manage profile, and submit deletion requests.
  3. `STAFF`: Can view assigned enquiries and grievances, add internal notes, and update ticket statuses. Cannot manage users, alter audit logs, or edit product terms.
  4. `ADMIN`: Full administrative control over all records, staff assignments, document publishing, product metadata, and audit inspection.
- **Consequences:** Least-privilege enforcement verified on server-side request boundaries; no client-only security checks.

---

## ADR-005: First-Party CRM & Grievance Ticket Generation

- **Status:** Accepted
- **Context:** The legacy website redirected users to dead external Vercel links or unmonitored mailto anchors.
- **Decision:** Build native CRM and grievance intake workflows. Each enquiry generates a persistent record with a unique identifier (`ENQ-2026-XXXX`). Each grievance generates a tracked ticket (`GRV-2026-XXXX`) with status history, assigned operator, and internal notes.
- **Consequences:** Complete elimination of third-party data leakage; verifiable SLAs; full audit traceability.

---

## ADR-006: Grounded AI Chatbot & Knowledge Retrieval

- **Status:** Accepted
- **Context:** Prospective investors and clients need immediate, accurate answers to questions regarding Niventra's structured debt, due diligence framework, and corporate services without hallucinating unverified financial returns.
- **Decision:** Implement a retrieval-grounded AI chatbot architecture (`/api/chat`). The system extracts relevant passages from approved corporate documents and knowledge items, enforces document access permissions, appends explicit source citations, and provides an honest unavailable fallback when external LLM API keys are not configured.
- **Consequences:** Zero hallucinations of guaranteed returns or fake registrations; prompt-injection defenses; transparent human contact fallbacks.

---

## ADR-007: Document Storage & Access Control

- **Status:** Accepted
- **Context:** Offering memoranda (PAS-4), debenture term sheets, and compliance filings require role-based download permissions and versioning.
- **Decision:** Private documents are stored outside public web roots (`storage/documents/`). Access is mediated via authenticated API endpoints (`/api/documents/[id]/download`) that verify user permissions, log an audit event, and stream file contents securely.
- **Consequences:** Prevents direct file scraping and URL guessing; maintains strict investor accreditation checks.

---

## ADR-008: Audit Logging & Security Event Ledger

- **Status:** Accepted
- **Context:** Institutional compliance demands an immutable record of all security-sensitive and business operations.
- **Decision:** Implement an `AuditLog` database model capturing: actor ID, action type, resource entity, resource ID, IP address, timestamp, outcome, and metadata. Audit logs are append-only.
- **Consequences:** Complete forensic traceability for authentication, status transitions, role modifications, and document access.

---

## ADR-009: Financial Workflow Boundaries (Calculator & Real-Money Gating)

- **Status:** Accepted
- **Context:** Premature deployment of financial calculation engines or unapproved payment gateways presents catastrophic regulatory and legal exposure.
- **Decision:** 
  1. Calculator route (`/calculator/`) remains formally deferred until CFO and compliance approval of exact mathematical conventions (Actual/365, TDS deduction, simple interest).
  2. Live payment processing and automated debenture allocation remain strictly disabled. Payment service abstractions define status transitions, but real money movement is gated.
- **Consequences:** Total protection against misleading marketing, unauthorized deposit taking, or regulatory non-compliance.
