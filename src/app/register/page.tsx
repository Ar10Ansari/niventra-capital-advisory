"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  Mail,
  Phone,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  Info,
  Briefcase,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [investorCategory, setInvestorCategory] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Field-level error states
  const [emailError, setEmailError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  // Password criteria aid (Frontend guidance only)
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteriaCount = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLevel =
    password.length === 0 ? "Empty" : criteriaCount <= 2 ? "Weak" : criteriaCount === 3 ? "Medium" : "Strong";

  const validateEmail = (val: string) => {
    if (!val.trim()) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return "Please enter a valid corporate or individual email address.";
    }
    return "";
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match.");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mailErr = validateEmail(email);
    if (mailErr) {
      setEmailError(mailErr);
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters in length.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match.");
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!consent) {
      setErrorMessage("Statutory DPDP consent is required to create an investor portal profile.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Registration could not be completed.");
        setIsLoading(false);
        return;
      }

      // Automatically authenticated by session cookie
      router.push("/dashboard/");
    } catch {
      setErrorMessage("Network error during registration. Please try again.");
      setIsLoading(false);
    }
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

      {/* Main Form Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          <div className="bg-white border border-[rgba(26,26,26,0.1)] rounded-lg p-6 sm:p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-full bg-[rgba(154,123,44,0.08)] text-[#9A7B2C] mb-3">
                <UserCheck className="w-5 h-5" />
              </div>
              <h1 className="font-heading text-2xl font-semibold text-[#1A1A1A]">
                Investor Portal Onboarding
              </h1>
              <p className="font-body text-xs text-[#5C5C5C] mt-2 leading-relaxed max-w-md mx-auto">
                Establish your client portal account to track advisory consultations, review approved corporate documents, and manage compliance requests.
              </p>
            </div>

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
              {/* Full Legal Name */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="reg-name">
                  Full Legal Name / Entity Representative <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3.5" />
                  <input
                    id="reg-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Vikramaditya Sharma"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] focus:border-transparent transition-all min-h-[44px]"
                  />
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="reg-email">
                    Corporate / Primary Email <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3.5" />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(validateEmail(e.target.value));
                      }}
                      onBlur={handleEmailBlur}
                      placeholder="name@example.com"
                      aria-invalid={Boolean(emailError)}
                      aria-describedby={emailError ? "reg-email-error" : undefined}
                      className={`w-full pl-9 pr-3 py-2.5 text-xs rounded border bg-white text-[#1A1A1A] transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] ${
                        emailError
                          ? "border-red-400 focus:border-red-500"
                          : "border-[rgba(26,26,26,0.15)] focus:border-transparent"
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p id="reg-email-error" role="alert" className="text-[0.6875rem] text-red-600 mt-1 font-body">
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="reg-phone">
                    Mobile Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3.5" />
                    <input
                      id="reg-phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] focus:border-transparent transition-all min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Investor Classification (Subject to Company Approval) */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="reg-category">
                  Investor Category <span className="text-[#8A8A8A] font-normal">(Optional — subject to advisory qualification)</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3.5" />
                  <select
                    id="reg-category"
                    value={investorCategory}
                    onChange={(e) => setInvestorCategory(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] focus:border-transparent transition-all min-h-[44px]"
                  >
                    <option value="">Select preferred classification (Optional)</option>
                    <option value="HNI">High Net Worth Individual (HNI)</option>
                    <option value="FAMILY_OFFICE">Family Office / Multi-Family Office</option>
                    <option value="CORPORATE">Corporate Treasury / Enterprise</option>
                    <option value="INSTITUTIONAL">Institutional Capital Allocator</option>
                  </select>
                </div>
                <p className="text-[0.6875rem] text-[#8A8A8A] mt-1 font-body">
                  Investor classification is optional at onboarding and subject to formal advisory qualification under the Companies Act, 2013.
                </p>
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="reg-pass">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3.5" />
                    <input
                      id="reg-pass"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
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

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="reg-confirm">
                    Confirm Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3.5" />
                    <input
                      id="reg-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (passwordMatchError && e.target.value === password) {
                          setPasswordMatchError("");
                        }
                      }}
                      onBlur={handleConfirmPasswordBlur}
                      placeholder="••••••••••••"
                      aria-invalid={Boolean(passwordMatchError)}
                      aria-describedby={passwordMatchError ? "reg-match-error" : undefined}
                      className={`w-full pl-9 pr-12 py-2.5 text-xs rounded border bg-white text-[#1A1A1A] transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] ${
                        passwordMatchError
                          ? "border-red-400 focus:border-red-500"
                          : "border-[rgba(26,26,26,0.15)] focus:border-transparent"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      aria-pressed={showConfirmPassword}
                      className="absolute right-1.5 top-1.5 min-w-[36px] min-h-[36px] p-2 text-[#8A8A8A] hover:text-[#1A1A1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] rounded flex items-center justify-center transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordMatchError && (
                    <p id="reg-match-error" role="alert" className="text-[0.6875rem] text-red-600 mt-1 font-body">
                      {passwordMatchError}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Strength Aid (Client-Side Guidance Notice) */}
              <div className="p-3.5 rounded bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] space-y-2">
                <div className="flex items-center justify-between text-[0.6875rem]">
                  <span className="font-semibold text-[#1A1A1A]">Password Strength Guidance</span>
                  <span
                    className={`font-semibold ${
                      strengthLevel === "Strong"
                        ? "text-emerald-700"
                        : strengthLevel === "Medium"
                        ? "text-amber-700"
                        : "text-[#8A8A8A]"
                    }`}
                  >
                    {strengthLevel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[0.6875rem] text-[#5C5C5C] font-body">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-700 font-semibold" : ""}`}>
                    <Check className={`w-3.5 h-3.5 ${hasMinLength ? "text-emerald-600" : "text-[#B0B0B0]"}`} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-700 font-semibold" : ""}`}>
                    <Check className={`w-3.5 h-3.5 ${hasUppercase ? "text-emerald-600" : "text-[#B0B0B0]"}`} />
                    <span>Uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-700 font-semibold" : ""}`}>
                    <Check className={`w-3.5 h-3.5 ${hasNumber ? "text-emerald-600" : "text-[#B0B0B0]"}`} />
                    <span>Numeric digit</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-700 font-semibold" : ""}`}>
                    <Check className={`w-3.5 h-3.5 ${hasSpecial ? "text-emerald-600" : "text-[#B0B0B0]"}`} />
                    <span>Special character</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 pt-1 text-[0.625rem] text-[#8A8A8A] font-body">
                  <Info className="w-3.5 h-3.5 text-[#9A7B2C] shrink-0 mt-0.5" />
                  <span>
                    Password criteria shown are client-side input guidance and do not guarantee server-side security. Passwords are cryptographically salted and hashed upon transmission.
                  </span>
                </div>
              </div>

              {/* Statutory DPDP Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#9A7B2C] focus:ring-[#9A7B2C] min-w-[16px] min-h-[16px]"
                  />
                  <span className="text-[0.6875rem] text-[#5C5C5C] leading-relaxed font-body">
                    I confirm that the details provided are accurate and authorize Niventra Capital Advisory India to process this account information strictly in compliance with the Digital Personal Data Protection Act, 2023 and applicable corporate confidentiality covenants.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] text-xs font-semibold tracking-wide transition-colors disabled:opacity-50 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2C] mt-4 shadow-2xs"
              >
                {isLoading ? (
                  <span>Creating Account Profile...</span>
                ) : (
                  <>
                    <span>Create Investor Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[rgba(26,26,26,0.08)] text-center text-xs text-[#5C5C5C]">
              <span>Already registered? </span>
              <Link href="/login/" className="text-[#9A7B2C] font-semibold hover:underline">
                Sign in to your portal
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[0.6875rem] text-[#8A8A8A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9A7B2C]" />
              <span>Registration does not constitute a commitment to subscribe to any financial offer.</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[rgba(26,26,26,0.08)] py-4 text-center text-[0.6875rem] text-[#8A8A8A]">
        © 2026 Niventra Capital Advisory India. All rights reserved.
      </footer>
    </div>
  );
}
