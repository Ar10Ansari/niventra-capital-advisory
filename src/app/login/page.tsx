"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, CheckCircle2, HelpCircle } from "lucide-react";
import { apiClient, ApiClientError, getApiBaseUrl } from "@/lib/api/client";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlResetToken = searchParams.get("resetToken")?.trim() || "";
  const passwordUpdatedFlag = searchParams.get("passwordUpdated") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Field-level validation state
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Password Reset Request Modal State
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [resetFeedback, setResetFeedback] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Reset Password Token Completion State (?resetToken=...)
  const [newResetPassword, setNewResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [completedResetToken, setCompletedResetToken] = useState<string | null>(null);
  const [tokenResetError, setTokenResetError] = useState("");
  const [tokenResetLoading, setTokenResetLoading] = useState(false);

  const tokenResetDone = Boolean(urlResetToken) && completedResetToken === urlResetToken;

  const validateEmail = (val: string) => {
    if (!val.trim()) {
      return "Corporate email is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return "Please enter a valid corporate email address.";
    }
    return "";
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailTouched) {
      setEmailError(validateEmail(e.target.value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setEmailTouched(true);
      setEmailError(err);
      return;
    }

    if (!password) {
      setErrorMessage("Password is required.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await apiClient.auth.login({ email, password });

      // Route according to user role
      if (data.user.role === "ADMIN" || data.user.role === "STAFF") {
        router.push("/admin/");
      } else {
        router.push("/dashboard/");
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        setErrorMessage(err.message || "Authentication failed. Please verify your credentials.");
      } else {
        setErrorMessage("Network error connecting to institutional gateway. Please try again.");
      }
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErr = validateEmail(resetEmail);
    if (validationErr) {
      setResetError(validationErr);
      return;
    }

    if (!getApiBaseUrl()) {
      setResetError(
        "Automated password recovery requires the external NestJS API gateway (NEXT_PUBLIC_API_BASE_URL). Please contact advisory compliance support for credential reset."
      );
      return;
    }

    setResetLoading(true);
    setResetError("");
    try {
      const response = await apiClient.auth.forgotPassword({ email: resetEmail.trim() });
      setResetFeedback(
        response.message ||
          "If an active account exists for this email address, password recovery instructions have been dispatched."
      );
      setResetSubmitted(true);
    } catch (err) {
      setResetError(
        err instanceof ApiClientError
          ? err.message
          : "Unable to dispatch recovery request right now. Please try again later."
      );
    } finally {
      setResetLoading(false);
    }
  };

  const handleCompleteResetWithToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlResetToken) return;
    if (newResetPassword.length < 8) {
      setTokenResetError("New password must be at least 8 characters long.");
      return;
    }
    if (newResetPassword !== confirmResetPassword) {
      setTokenResetError("Passwords do not match.");
      return;
    }
    if (!getApiBaseUrl()) {
      setTokenResetError("Password reset completion requires the NestJS API gateway.");
      return;
    }

    setTokenResetLoading(true);
    setTokenResetError("");
    try {
      await apiClient.auth.resetPassword({ token: urlResetToken, newPassword: newResetPassword });
      setCompletedResetToken(urlResetToken);
      setNewResetPassword("");
      setConfirmResetPassword("");
    } catch (err) {
      setTokenResetError(
        err instanceof ApiClientError
          ? err.message
          : "Recovery token verification failed or token has expired."
      );
    } finally {
      setTokenResetLoading(false);
    }
  };

  const closeResetModal = () => {
    setIsResetOpen(false);
    setResetSubmitted(false);
    setResetFeedback("");
    setResetError("");
    setResetEmail("");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-between">
      {/* Top Bar */}
      <header className="border-b border-[rgba(26,26,26,0.08)] bg-[#FAFAF7]/90 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-[3px]">
              <Image
                src="/assets/images/logo.png"
                alt="Niventra emblem"
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading text-sm font-semibold tracking-tight text-[#1A1A1A]">
                NIVENTRA
              </span>
              <span className="font-body text-[0.5625rem] uppercase tracking-[0.15em] text-[#9A7B2C] font-semibold mt-0.5">
                Capital Advisory
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-medium text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors min-h-[44px] inline-flex items-center"
          >
            ← Return to Public Website
          </Link>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white border border-[rgba(26,26,26,0.1)] rounded-lg p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-full bg-[rgba(154,123,44,0.08)] text-[#9A7B2C] mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h1 className="font-heading text-2xl font-semibold text-[#1A1A1A]">
                Institutional Portal Login
              </h1>
              <p className="font-body text-xs text-[#5C5C5C] mt-2 leading-relaxed">
                Secure access for verified capital providers, institutional clients, and advisory desk personnel.
              </p>
            </div>

            {passwordUpdatedFlag && !errorMessage && (
              <div
                role="status"
                className="mb-6 p-3 rounded bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>Password updated and prior sessions revoked. Sign in with your new password.</span>
              </div>
            )}

            {urlResetToken ? (
              <div className="space-y-4">
                {tokenResetDone ? (
                  <div className="p-4 rounded bg-emerald-50 border border-emerald-200 space-y-3 text-xs text-emerald-900">
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Password Reset Completed</span>
                    </div>
                    <p>Your credentials have been rotated and all previous sessions revoked.</p>
                    <button
                      type="button"
                      onClick={() => router.replace("/login/")}
                      className="w-full py-2.5 px-4 rounded bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-[#2D2D2D] min-h-[44px]"
                    >
                      Proceed to Portal Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCompleteResetWithToken} className="space-y-4">
                    <div className="p-3 rounded bg-[rgba(154,123,44,0.06)] border border-[rgba(154,123,44,0.2)] text-xs text-[#5C5C5C]">
                      Complete single-use password recovery for your Niventra portal account.
                    </div>
                    {tokenResetError && (
                      <div role="alert" className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                        <span>{tokenResetError}</span>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="new-reset-password">
                        New Password (min 8 chars) *
                      </label>
                      <input
                        id="new-reset-password"
                        type="password"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={newResetPassword}
                        onChange={(e) => setNewResetPassword(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] min-h-[44px]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="confirm-reset-password">
                        Confirm New Password *
                      </label>
                      <input
                        id="confirm-reset-password"
                        type="password"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={confirmResetPassword}
                        onChange={(e) => setConfirmResetPassword(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] min-h-[44px]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={tokenResetLoading}
                      className="w-full py-2.5 px-4 rounded bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] text-xs font-semibold min-h-[44px] disabled:opacity-50"
                    >
                      {tokenResetLoading ? "Updating Password..." : "Complete Password Reset"}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <>
            {errorMessage && (
              <div
                role="alert"
                className="mb-6 p-3 rounded bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4.5">
              {/* Corporate Email Field */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="login-email">
                  Corporate / Registered Email <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3.5" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    placeholder="name@company.com"
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? "login-email-error" : undefined}
                    className={`w-full pl-9 pr-3 py-2.5 text-xs rounded border bg-white text-[#1A1A1A] transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] ${
                      emailError
                        ? "border-red-400 focus:border-red-500"
                        : "border-[rgba(26,26,26,0.15)] focus:border-transparent"
                    }`}
                  />
                </div>
                {emailError && (
                  <p id="login-email-error" role="alert" className="text-[0.6875rem] text-red-600 mt-1 font-body">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Field with Accessible Visibility Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#1A1A1A]" htmlFor="login-password">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsResetOpen(true)}
                    className="text-[0.6875rem] font-semibold text-[#9A7B2C] hover:underline min-h-[32px] inline-flex items-center"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3.5" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-12 py-2.5 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] focus:border-transparent transition-all min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-1.5 top-1.5 min-w-[36px] min-h-[36px] p-2 text-[#8A8A8A] hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] rounded flex items-center justify-center transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] text-xs font-semibold tracking-wide transition-colors disabled:opacity-50 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] mt-2 shadow-2xs"
              >
                {isLoading ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <span>Authenticate Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[rgba(26,26,26,0.08)] text-center text-xs text-[#5C5C5C]">
              <span>Need investor portal access? </span>
              <Link href="/register/" className="text-[#9A7B2C] font-semibold hover:underline">
                Register Onboarding Request
              </Link>
            </div>
              </>
            )}
          </div>

          {/* Institutional Compliance Notice */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[0.6875rem] text-[#8A8A8A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9A7B2C]" />
              <span>End-to-end encrypted session. Activity monitored and audited.</span>
            </div>
          </div>
        </div>
      </main>

      {/* Password Reset Modal */}
      {isResetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(26,26,26,0.5)] backdrop-blur-xs"
        >
          <div className="w-full max-w-md bg-white border border-[rgba(26,26,26,0.12)] rounded-lg p-6 sm:p-7 shadow-xl space-y-4 animate-in fade-in duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#9A7B2C] block">
                  Institutional Credential Security
                </span>
                <h2 id="reset-modal-title" className="font-heading text-xl font-semibold text-[#1A1A1A] mt-0.5">
                  Password Recovery
                </h2>
              </div>
              <button
                type="button"
                onClick={closeResetModal}
                className="text-[#8A8A8A] hover:text-[#1A1A1A] p-1.5 rounded min-w-[36px] min-h-[36px] flex items-center justify-center"
                aria-label="Close recovery dialog"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded bg-[rgba(154,123,44,0.06)] border border-[rgba(154,123,44,0.2)] text-[0.75rem] text-[#5C5C5C] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#1A1A1A]">
                <HelpCircle className="w-3.5 h-3.5 text-[#9A7B2C]" />
                <span>Single-Use Token Recovery</span>
              </div>
              <p className="leading-relaxed">
                Recovery tokens expire after 30 minutes and automatically revoke all previously active sessions upon completion.
              </p>
            </div>

            {resetSubmitted ? (
              <div className="py-4 space-y-4 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-base font-semibold text-[#1A1A1A]">
                    Recovery Request Processed
                  </h3>
                  <p className="text-xs text-[#5C5C5C] leading-relaxed">
                    {resetFeedback}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeResetModal}
                  className="w-full py-2.5 px-4 rounded bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-[#2D2D2D] min-h-[44px]"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4 pt-1">
                {resetError && (
                  <div role="alert" className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <span>{resetError}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="reset-email">
                    Registered Corporate Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] min-h-[44px]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeResetModal}
                    className="px-4 py-2 text-xs font-medium text-[#5C5C5C] hover:text-[#1A1A1A] min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="px-4 py-2 rounded bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] text-xs font-semibold min-h-[44px] disabled:opacity-50"
                  >
                    {resetLoading ? "Submitting Request..." : "Send Recovery Instructions"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer Minimal */}
      <footer className="border-t border-[rgba(26,26,26,0.08)] py-4 text-center text-[0.6875rem] text-[#8A8A8A]">
        © 2026 Niventra Capital Advisory India. Confidential &amp; Proprietary Systems.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center text-xs text-[#5C5C5C]">
          Loading authentication portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
