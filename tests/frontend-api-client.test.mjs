import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import {
  apiClient,
  ApiClientError,
  clearCsrfToken,
  getApiBaseUrl,
  getInMemoryCsrfToken,
  resolveApiUrl,
} from "../src/lib/api/client.ts";

function collectSourceFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(fullPath, files);
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

test("Frontend API Client — base URL resolution & credentials policy", () => {
  const prevUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    assert.equal(getApiBaseUrl(), "");
    assert.equal(resolveApiUrl("/api/auth/me"), "/api/auth/me");

    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.niventra.example///";
    assert.equal(getApiBaseUrl(), "https://api.niventra.example");
    assert.equal(resolveApiUrl("/api/investments"), "https://api.niventra.example/api/investments");
    assert.equal(resolveApiUrl("api/products"), "https://api.niventra.example/api/products");
  } finally {
    if (prevUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = prevUrl;
    }
  }
});

test("Frontend API Client — routes calls to NestJS backend URL with include credentials and handles array validation errors", async () => {
  const prevUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const originalFetch = globalThis.fetch;
  const recordedRequests = [];

  try {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:4000/";

    globalThis.fetch = async (url, init) => {
      recordedRequests.push({ url: String(url), init });

      if (String(url).endsWith("/api/investments?status=ACTIVE")) {
        return new Response(
          JSON.stringify({
            investments: [],
            summary: {
              totalPrincipal: 1500000,
              activeCount: 1,
              accruedInterest: 163125,
              interestPaid: 108750,
              pendingInterest: 54375,
              nextPayoutDate: "2026-10-15",
              currency: "INR",
            },
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }

      if (String(url).endsWith("/api/account/preferences") && init?.method === "PATCH") {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Notification preferences updated successfully.",
            preferences: {
              notifyConsultations: true,
              notifyDisclosures: false,
              notifyGrievances: true,
            },
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }

      if (String(url).endsWith("/api/project-funding") && init?.method === "POST") {
        return new Response(
          JSON.stringify({
            statusCode: 400,
            message: ["totalCost must be positive", "pinCode must match 6 digits"],
          }),
          { status: 400, headers: { "content-type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    };

    const invResult = await apiClient.investments.list({ status: "ACTIVE" });
    assert.equal(invResult.summary.totalPrincipal, 1500000);
    assert.equal(recordedRequests[0].url, "http://localhost:4000/api/investments?status=ACTIVE");
    assert.equal(recordedRequests[0].init.credentials, "include");

    const prefResult = await apiClient.account.updatePreferences({ notifyDisclosures: false });
    assert.equal(prefResult.preferences.notifyDisclosures, false);
    assert.equal(recordedRequests[1].url, "http://localhost:4000/api/account/preferences");

    await assert.rejects(
      () => apiClient.projects.submit({ projectName: "Bad" }),
      (err) => {
        assert.ok(err instanceof ApiClientError);
        assert.equal(err.status, 400);
        assert.equal(err.message, "totalCost must be positive, pinCode must match 6 digits");
        return true;
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
    if (prevUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = prevUrl;
    }
  }
});

test("Frontend Architecture — centralized API client hygiene & decomposed dashboard/admin components", () => {
  const srcRoot = path.join(process.cwd(), "src");
  const sourceFiles = collectSourceFiles(srcRoot);
  const directFetchViolations = [];

  for (const filePath of sourceFiles) {
    const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
    if (relPath === "src/lib/api/client.ts" || relPath === "src/lib/notifications.ts") {
      continue;
    }
    const content = fs.readFileSync(filePath, "utf-8");
    if (/\bfetch\s*\(/.test(content)) {
      directFetchViolations.push(relPath);
    }
  }

  assert.deepEqual(
    directFetchViolations,
    [],
    `Unexpected direct fetch() calls outside centralized API client: ${directFetchViolations.join(", ")}`
  );

  const requiredComponents = [
    "src/components/admin/AdminAuditLogsTab.tsx",
    "src/components/admin/AdminCatalogAndDocsTabs.tsx",
    "src/components/admin/AdminEnquiriesTab.tsx",
    "src/components/admin/AdminGrievancesTab.tsx",
    "src/components/admin/AdminOverviewTab.tsx",
    "src/components/admin/AdminProjectsTab.tsx",
    "src/components/admin/ProjectReviewModal.tsx",
    "src/components/dashboard/ConsultationsDocumentsGrievancesTabs.tsx",
    "src/components/dashboard/DashboardCalculatorTab.tsx",
    "src/components/dashboard/DashboardOverviewTab.tsx",
    "src/components/dashboard/HoldingsLedgerTab.tsx",
    "src/components/dashboard/KycComplianceTab.tsx",
    "src/components/dashboard/dashboardHelpers.tsx",
  ];

  for (const relComponent of requiredComponents) {
    assert.ok(
      fs.existsSync(path.join(process.cwd(), relComponent)),
      `Decomposed component missing: ${relComponent}`
    );
  }
});

test("Frontend API Client — captures CSRF token on login, sends X-CSRF-Token on mutations, clears on logout, and calls password reset", async () => {
  const prevUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const originalFetch = globalThis.fetch;
  const recorded = [];

  try {
    clearCsrfToken();
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api-staging.example.com";

    globalThis.fetch = async (url, init) => {
      recorded.push({ url: String(url), headers: init?.headers || {}, method: init?.method || "GET" });

      if (String(url).endsWith("/api/auth/login")) {
        return new Response(
          JSON.stringify({
            success: true,
            csrfToken: "csrf_tok_staging_123",
            user: { id: "u1", name: "Test", email: "test@example.com", role: "INVESTOR", status: "ACTIVE", created_at: "2026-01-01" },
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }

      if (String(url).endsWith("/api/account/profile")) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Updated",
            user: { id: "u1", name: "Test", email: "test@example.com", role: "INVESTOR", status: "ACTIVE", created_at: "2026-01-01" },
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }

      return new Response(JSON.stringify({ success: true, message: "OK" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    };

    await apiClient.auth.login({ email: "test@example.com", password: "Password123!" });
    assert.equal(getInMemoryCsrfToken(), "csrf_tok_staging_123");

    await apiClient.account.updateProfile({ name: "Updated" });
    const profileReq = recorded.find((r) => r.url.endsWith("/api/account/profile"));
    assert.equal(profileReq.headers["X-CSRF-Token"], "csrf_tok_staging_123");

    await apiClient.auth.logout();
    const logoutReq = recorded.find((r) => r.url.endsWith("/api/auth/logout"));
    assert.equal(logoutReq.headers["X-CSRF-Token"], "csrf_tok_staging_123");
    assert.equal(getInMemoryCsrfToken(), null);

    await apiClient.auth.forgotPassword({ email: "test@example.com" });
    await apiClient.auth.resetPassword({ token: "reset_tok_abc", newPassword: "NewPassword123!" });
    assert.ok(recorded.some((r) => r.url.endsWith("/api/auth/forgot-password")));
    assert.ok(recorded.some((r) => r.url.endsWith("/api/auth/reset-password")));
  } finally {
    clearCsrfToken();
    globalThis.fetch = originalFetch;
    if (prevUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_BASE_URL;
    } else {
      process.env.NEXT_PUBLIC_API_BASE_URL = prevUrl;
    }
  }
});

test("SQLite Users Table — preference & investor category columns present without touching real rows", () => {
  const dbPath = path.join(process.cwd(), "data", "niventra.db");
  const db = new DatabaseSync(dbPath, { readOnly: true });
  const columns = db.prepare("PRAGMA table_info(users)").all().map((c) => c.name);
  db.close();

  for (const expectedCol of [
    "investor_category",
    "notify_consultations",
    "notify_disclosures",
    "notify_grievances",
  ]) {
    assert.ok(columns.includes(expectedCol), `Missing column "${expectedCol}" on users table`);
  }
});
