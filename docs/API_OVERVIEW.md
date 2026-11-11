# Niventra Capital Advisory — API Overview

**Updated:** November 12, 2026  
**Detailed Schema & Examples:** [`docs/api/API_REFERENCE.md`](api/API_REFERENCE.md) | **Interactive OpenAPI:** `GET /api/docs` (non-production or `SWAGGER_ENABLED=true`)

---

## 1. API Architecture & Authentication Contract

The standalone NestJS backend exposes all endpoints under the `/api` global prefix (`backend/src/modules/`).  
When `NEXT_PUBLIC_API_BASE_URL` is unset, Next.js serves compatible transition Route Handlers under `src/app/api/*` against SQLite (`data/niventra.db`).

- **Authentication Modes:**
  - Browser Cookie Session (`niventra_session` HttpOnly cookie; `SameSite=None; Secure` in staging/prod) + `X-CSRF-Token` header on state-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`).
  - `Authorization: Bearer <jwt>` (`HS256`, `iss: niventra-api`, `aud: niventra-portal`, `sid` verified active in PostgreSQL `sessions`).
- **Rate Limiting:** Global `@nestjs/throttler` (tighter `5 req/60s` limits on `/api/auth/login`, `register`, `forgot-password`, `reset-password`, and `/api/enquiries`, `/api/project-funding`).

---

## 2. Endpoint Inventory by Domain

### Health (`HealthModule`)
| Method & Path | Access | Description |
| :--- | :---: | :--- |
| `GET /api/health` | Public (`@SkipThrottle`) | Process liveness JSON (`{ status: "ok", service, timestamp }`). |
| `GET /api/health/live` | Public (`@SkipThrottle`) | Container liveness probe. |
| `GET /api/health/ready` | Public (`@SkipThrottle`) | Executes `$queryRaw SELECT 1` (`2s` timeout); `200 ready` or `503 not_ready` (`Cache-Control: no-store`). |

### Authentication (`AuthModule`)
| Method & Path | Access | Description |
| :--- | :---: | :--- |
| `POST /api/auth/register` | Public | Registers `INVESTOR` account, sets session cookie, returns `accessToken` + `csrfToken`. |
| `POST /api/auth/login` | Public | Verifies credentials, sets session cookie, returns `accessToken` + `csrfToken` (blocks `PENDING_DELETION` `403`). |
| `POST /api/auth/logout` | Cookie / Bearer | Deletes current session from DB and clears session cookie (`clearSessionCookie`). |
| `GET /api/auth/me` | `@OptionalAuth()` | Returns authenticated user (`null` if unauthenticated) + fresh `X-CSRF-Token`. |
| `GET /api/auth/csrf` | Session / Optional | Returns CSRF token bound to active `niventra_session` cookie. |
| `POST /api/auth/forgot-password` | Public | Generates single-use 30-min hashed reset token (uniform non-enumerating `200`). |
| `POST /api/auth/reset-password` | Public | Validates token, updates password hash, revokes **all** active sessions (`401` on all prior JWTs/cookies). |

### Account & User Profiles (`UsersModule`)
| Method & Path | Access | Description |
| :--- | :---: | :--- |
| `GET/PATCH /api/account/profile` | Authenticated | Fetch or update user `name`, `phone`, `investorCategory`. *(Legacy alias: `/api/users/profile`)* |
| `GET/PATCH /api/account/preferences` | Authenticated | Fetch or update email/disclosure/grievance opt-ins. *(Alias: `/api/users/preferences`)* |
| `POST /api/account/change-password` | Authenticated | Verifies current password, updates password, revokes all sessions (`200 OK`). *(Alias: `/api/users/change-password`)* |
| `POST /api/account/delete` | `@OptionalAuth()` | Queues DPDP Act 2023 deletion (`DEL-2026-...`); requires `password` if authenticated and revokes all sessions. *(Alias: `/api/users/delete-account`)* |

### Project Funding (`ProjectFundingModule`)
| Method & Path | Access | Description |
| :--- | :---: | :--- |
| `POST /api/project-funding` | Public | Submits developer funding proposal with honeypot & `fundingRequested <= totalCost` checks. |
| `GET /api/project-funding` | `ADMIN`, `STAFF` | Lists applications filtered by validated `status`, `category`, `state`, and search `q`. |
| `GET /api/project-funding/:id` | `ADMIN`, `STAFF` | Returns single application with chronological `statusHistory`. |
| `PATCH /api/project-funding/:id` | `ADMIN`, `STAFF` | Updates underwriting status (`DECLINED` requires reason) and logs status history. |

### Documents (`DocumentsModule`)
| Method & Path | Access | Description |
| :--- | :---: | :--- |
| `GET /api/documents` | `@OptionalAuth()` | Lists accessible approved documents (`isPublic` for guests; excludes other investors' private docs). |
| `POST /api/documents` | `ADMIN` | Registers document metadata (`docType`, validated safe `filePath`, MIME, size). |
| `POST /api/documents/upload` | `ADMIN` | Multipart binary upload (`15 MB` max, magic-byte & extension validation; `503` if `S3_*` implies unimplemented cloud driver). |
| `GET /api/documents/:id` | `@OptionalAuth()` | Metadata retrieval enforcing `APPROVED` status, role allowlist, and owner isolation. |
| `GET /api/documents/:id/download` | `@OptionalAuth()` | Streams binary with `nosniff`, dynamic MIME extension, `private, no-store`, or returns counsel-watermark notice. |

### Investments, Portfolio, Transactions & KYC (`Investments`, `Portfolio`, `Transactions`, `InvestorAccounts`)
| Method & Path | Access | Description |
| :--- | :---: | :--- |
| `GET /api/products` | `@OptionalAuth()` | Public listing returns `PUBLISHED` only; staff/admin also see drafts. |
| `POST /api/products` | `ADMIN` | Creates debenture/debt product catalog record (`ADMIN` only). |
| `GET /api/investments` & `/:id` | Authenticated | Lists owner-scoped holdings (or staff cross-account `?userId=`) with paise-exact active totals. *(Read-only)* |
| `GET /api/investments/products` | Authenticated | Lists product offerings within investment namespace. |
| `GET /api/portfolio/summary` | Authenticated | Active holding metrics (`currency: "INR"`) via shared integer-paise summary logic. |
| `GET /api/transactions` | Authenticated | Owner/staff-scoped read-only transaction ledger query. *(Read-only)* |
| `GET/POST /api/kyc` | Authenticated | Retrieves or submits investor PAN/KYC record (`PAN` masked cleanly). |
| `PATCH /api/kyc` | `ADMIN`, `STAFF` | Marks KYC verified or rejected with compliance notes. |

### Advisory Operations, Public Utilities & Audit Logs
| Method & Path | Access | Description |
| :--- | :---: | :--- |
| `POST /api/enquiries` | Public (Optional Auth) | Consultation request intake with duplicate suppression and notification dispatch. |
| `GET /api/enquiries`, `PATCH /api/enquiries/:id` | Authenticated / Staff | Investor sees own enquiries; staff/admin manage CRM statuses. |
| `POST /api/grievances` | Public (Optional Auth) | Registers grievance ticket (`GRV-2026-...`) with 30-day statutory SLA deadline. |
| `GET /api/grievances`, `PATCH /api/grievances/:id` | Authenticated / Staff | Lists own or staff-wide grievances (`ADMIN` also exposes `/api/admin/grievances`). |
| `GET /api/admin/overview` | `ADMIN`, `STAFF` | Operational KPI counts across domains. |
| `GET /api/audit-logs` | `ADMIN` | Immutable audit log feed. |
| `GET /api/notifications`, `PATCH /api/notifications/:id/read` | Authenticated | Lists/marks read in-app notifications. |
| `GET /api/branches` | Public | Returns 25-location national branch directory (`?q=`, `?tier=`). |
| `POST /api/calculator/simulate` | Public | Simple-interest repayment schedule simulation + Section 193/194A TDS disclosures. |
| `POST /api/chat` | Public | Grounded institutional FAQ assistant with prompt-injection refusal. |

