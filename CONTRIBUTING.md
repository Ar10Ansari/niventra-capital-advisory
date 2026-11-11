# Contributing Guidelines — Niventra Capital Advisory

Thank you for contributing to Niventra Capital Advisory's financial engineering codebase. To maintain production stability, regulatory compliance, and architectural integrity, all contributors must follow these engineering standards.

---

## 1. Code of Conduct & Fiduciary Responsibility

As a financial advisory technology platform, our codebase is subject to strict regulatory scrutiny. Contributors must:
* **Never commit secrets, credentials, API keys, or database passwords.**
* **Never commit real client personal data, bank account numbers, or PANs.**
* **Never commit unverified claims of guaranteed or assured investment returns.**
* **Maintain complete documentation integrity:** Do not delete existing statutory disclaimers or compliance notes.

---

## 2. Development Workflow & Branching Strategy

1. **Primary Branch:** `main` represents production-ready code deployed to Vercel.
2. **Feature Branches:** Create branches off `main` using descriptive naming:
   * `feat/<domain>-<short-description>` (e.g. `feat/nestjs-backend-init`)
   * `fix/<domain>-<short-description>` (e.g. `fix/branch-search-typo`)
   * `refactor/<domain>-<short-description>` (e.g. `refactor/admin-modals`)
   * `docs/<topic>` (e.g. `docs/api-contracts`)
3. **Never force-push (`git push --force`) to `main` or shared development branches.**
4. Keep changes focused and pull-request sized.

---

## 3. Engineering Conventions

### 3.1 Strict TypeScript
* Do not introduce unexplained `any` types.
* Explicitly type function parameters, return values, and API response structures.
* Run `npm run typecheck` before pushing any branch.

### 3.2 Code Quality & Linting
* Adhere to ESLint flat configuration (`eslint.config.mjs`).
* Avoid oversized components. Break large UI modules into smaller, reusable presentation units.
* Preserve existing comments that explain business rationale or regulatory requirements.

### 3.3 Commit Message Standards
Use Conventional Commits formatting:
```
<type>(<scope>): <short imperative summary>

[optional body explaining business or architectural context]

[optional issue reference]
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.

---

## 4. Verification & Testing Protocol

Before opening a pull request, run all verification commands locally (for both frontend and backend):

```bash
# Frontend (root)
npm run typecheck
npm run lint
npm test          # 8 suites, 51 tests
npm run build

# Standalone NestJS Backend (backend/)
cd backend
npx prisma validate
npm run lint
npm run typecheck
npm run build
npm test
npm run test:e2e
```

---

## 5. Security & Sensitive File Safeguards

Ensure the following files remain ignored by `.gitignore` and are never committed:
* `.env`, `.env.local`, `.env.production`
* `data/*.db`, `data/*.db-wal`, `data/*.db-shm`
* `data/email_sink.log`
* `storage/documents/*` (except sample test templates)
* `data/backups/*`
