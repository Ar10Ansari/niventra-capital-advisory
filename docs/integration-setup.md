# Niventra Capital Advisory — Integration & Environment Setup Guide

**Document Version:** 1.0  
**Date:** October 16, 2026  
**Lead DevOps & Systems Architect:** Lead Full-Stack Architect  
**Workspace:** `d:\Projects\niventra website`  

---

## 1. Local Development Setup (Current State)

The application runs entirely locally with zero external network dependencies, featuring native SQLite storage and built-in Node.js cryptographic security.

### 1.1 Prerequisites
- **Node.js:** v24.15.0 or later (supports native `node:sqlite` and built-in type stripping).
- **Package Manager:** npm (v10+).
- **Port:** `3000` (free and unbound).

### 1.2 Running the Application Locally
```bash
# 1. Install dependencies (if fresh clone)
npm install

# 2. Seed the local development database
node scripts/seed.mjs

# 3. Run automated test suites
npm test

# 4. Start local development server
npm run dev
```

The application will be accessible at `http://localhost:3000/`.

### 1.3 Local Development Credentials
The following accounts are created by `scripts/seed.mjs` for testing:
- **System Administrator:** `admin@niventra.local` / `NiventraAdmin2026!` (Access to `/admin`)
- **Staff Advisory Operator:** `staff@niventra.local` / `NiventraStaff2026!` (Access to `/admin`)
- **Verified Investor Client:** `investor@example.com` / `Investor2026!` (Access to `/dashboard`)

---

## 2. Production Environment Variables Reference

When transitioning to a live staging or production deployment, configure the following environment variables:

```bash
# --- CORE APPLICATION ---
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://niventracapitaladvisory.com
SESSION_SECRET=super_secret_high_entropy_hex_key_at_least_64_chars

# --- DATABASE PERSISTENCE (POSTGRESQL) ---
# Replace SQLite with PostgreSQL in production:
DATABASE_URL=postgresql://niventra_user:strong_password@db-host:5432/niventra_prod?sslmode=require

# --- SPAM & BOT PROTECTION ---
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAA_your_site_key
TURNSTILE_SECRET_KEY=0x4AAAAAA_your_secret_key

# --- TRANSACTIONAL EMAIL NOTIFICATIONS ---
# Replaces local file sink (data/email_sink.log)
EMAIL_PROVIDER=smtp # or sendgrid, ses, resend
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
EMAIL_FROM="Niventra Capital Advisory <notifications@niventracapitaladvisory.com>"

# --- AI RETRIEVAL & LLM PROVIDER (OPTIONAL) ---
# When configured, powers live generation on top of knowledge grounding:
AI_PROVIDER=google_gemini # or openai, anthropic
GEMINI_API_KEY=your_gemini_api_key_here

# --- DOCUMENT STORAGE & S3 (OPTIONAL) ---
# For distributed multi-instance deployments:
STORAGE_DRIVER=local # or s3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=niventra-secure-documents
```

---

## 3. Storage & Persistence Layout

- **Database:** `data/niventra.db` (SQLite in WAL journal mode). Ignored by git in `.gitignore`.
- **Email Sink:** `data/email_sink.log` (Local record of all system notifications and email bodies).
- **Documents Repository:** `storage/documents/` (Contains authentic PDF binary assets streamed via `/api/documents/[id]/download`).
