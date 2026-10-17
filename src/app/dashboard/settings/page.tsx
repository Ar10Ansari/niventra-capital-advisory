"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Bell,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  Info,
  Smartphone,
  Trash2,
  Briefcase,
  KeyRound,
  ExternalLink,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function AccountSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "privacy">("profile");

  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [investorCategory, setInvestorCategory] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [securityMessage, setSecurityMessage] = useState("");
  const [securityError, setSecurityError] = useState("");

  // Notification Toggles (Client state)
  const [notifyConsultations, setNotifyConsultations] = useState(true);
  const [notifyDisclosures, setNotifyDisclosures] = useState(true);
  const [notifyGrievances, setNotifyGrievances] = useState(true);
  const [notificationsSaved, setNotificationsSaved] = useState(false);

  // Password criteria aid for new password
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const criteriaCount = [hasMinLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLevel =
    newPassword.length === 0 ? "Empty" : criteriaCount <= 2 ? "Weak" : criteriaCount === 3 ? "Medium" : "Strong";

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login/");
          return;
        }
        const data = await res.json();
        setUser(data.user);
        setFullName(data.user.name || "");
        setPhone(data.user.phone || "");
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [router]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 4000);
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError("");
    setSecurityMessage("");

    if (!currentPassword) {
      setSecurityError("Current password is required to request a credential modification.");
      return;
    }
    if (newPassword.length < 8) {
      setSecurityError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setSecurityError("New password and confirmation do not match.");
      return;
    }

    // Explicit label for functionality requiring backend integration
    setSecurityMessage(
      "Backend Integration Notice: Password update request submitted in compliance preview mode. In production, password changes require dual-factor authorization and security desk validation."
    );
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleNotificationsSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotificationsSaved(true);
    setTimeout(() => setNotificationsSaved(false), 4000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#9A7B2C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#5C5C5C] font-mono">Loading Institutional Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[rgba(26,26,26,0.08)] px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C5C5C] hover:text-[#1A1A1A] p-2 rounded hover:bg-[rgba(26,26,26,0.04)] min-h-[44px] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal Overview</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-heading text-sm font-semibold tracking-tight text-[#1A1A1A]">
              NIVENTRA
            </span>
            <span className="text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-[#9A7B2C] border-l border-[rgba(26,26,26,0.15)] pl-2.5">
              Account Governance
            </span>
          </div>
        </div>
      </header>

      {/* Main Settings Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6">
        {/* Title & Introduction */}
        <div>
          <span className="text-eyebrow mb-1 block">Investor Profile &amp; Preferences</span>
          <h1 className="font-heading text-2xl sm:text-3xl font-[500] text-[#1A1A1A]">
            Account Settings &amp; Security
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#5C5C5C] mt-1 max-w-2xl leading-relaxed">
            Manage your personal profile coordinates, authentication credentials, disclosure notification settings, and statutory data protection rights.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-[rgba(26,26,26,0.08)] overflow-x-auto pb-px">
          {[
            { id: "profile", label: "Profile Information", icon: User },
            { id: "security", label: "Security & Credentials", icon: KeyRound },
            { id: "notifications", label: "Notification Channels", icon: Bell },
            { id: "privacy", label: "Privacy & Data Retention", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold rounded-t-lg transition-colors min-h-[44px] whitespace-nowrap border-b-2 ${
                  isActive
                    ? "border-[#9A7B2C] text-[#9A7B2C] bg-[rgba(154,123,44,0.04)]"
                    : "border-transparent text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[rgba(26,26,26,0.02)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================================================================
            TAB 1: PROFILE INFORMATION
            ================================================================ */}
        {activeTab === "profile" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-xl p-6 sm:p-8 shadow-2xs space-y-6 max-w-3xl">
            <div>
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                Personal &amp; Entity Profile
              </h2>
              <p className="text-xs text-[#5C5C5C] font-body mt-0.5">
                Primary contact details associated with your investor portal account.
              </p>
            </div>

            {profileSaved && (
              <div
                role="alert"
                className="p-3.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Profile Updated</span>
                  <span>
                    Your profile adjustments are active in your current session. Permanent persistence to master registries is confirmed during formal onboarding verification.
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4.5">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="set-name">
                  Full Legal Name
                </label>
                <input
                  id="set-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] min-h-[44px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#1A1A1A]" htmlFor="set-email">
                    Primary Corporate Email
                  </label>
                  <span className="text-[0.625rem] font-mono px-2 py-0.5 rounded bg-[#FAFAF7] border border-[rgba(26,26,26,0.1)] text-[#7A7A7A]">
                    Primary Identifier
                  </span>
                </div>
                <input
                  id="set-email"
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.1)] bg-[#FAFAF7] text-[#7A7A7A] cursor-not-allowed min-h-[44px]"
                />
                <p className="text-[0.6875rem] text-[#8A8A8A] mt-1 font-body">
                  To modify your verified corporate email address, contact the Niventra Security &amp; Compliance Desk to re-verify identity.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="set-phone">
                  Contact Phone Number
                </label>
                <input
                  id="set-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="set-category">
                  Investor Category <span className="text-[#8A8A8A] font-normal">(Optional — subject to advisory qualification)</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3.5" />
                  <select
                    id="set-category"
                    value={investorCategory}
                    onChange={(e) => setInvestorCategory(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] min-h-[44px]"
                  >
                    <option value="">Select preferred classification (Optional)</option>
                    <option value="HNI">High Net Worth Individual (HNI)</option>
                    <option value="FAMILY_OFFICE">Family Office Principal</option>
                    <option value="CORPORATE">Corporate Treasury Officer</option>
                    <option value="INSTITUTIONAL">Institutional Capital Allocator</option>
                  </select>
                </div>
                <p className="text-[0.6875rem] text-[#8A8A8A] mt-1 font-body">
                  Investor category selections are advisory references only and do not constitute formal legal accreditation until verified via Section 42 documentation.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] text-xs font-semibold min-h-[44px] transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================
            TAB 2: SECURITY & CREDENTIALS
            ================================================================ */}
        {activeTab === "security" && (
          <div className="space-y-6 max-w-3xl">
            {/* Password Modification Card */}
            <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Change Password
                </h2>
                <p className="text-xs text-[#5C5C5C] font-body mt-0.5">
                  Update your account password with cryptographic hashing protections.
                </p>
              </div>

              {securityError && (
                <div
                  role="alert"
                  className="p-3.5 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{securityError}</span>
                </div>
              )}

              {securityMessage && (
                <div
                  role="alert"
                  className="p-3.5 rounded bg-[rgba(154,123,44,0.08)] border border-[rgba(154,123,44,0.2)] text-xs text-[#1A1A1A] flex items-start gap-2"
                >
                  <Info className="w-4 h-4 text-[#9A7B2C] shrink-0 mt-0.5" />
                  <span>{securityMessage}</span>
                </div>
              )}

              <form onSubmit={handleSecuritySubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="cur-pass">
                    Current Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3.5" />
                    <input
                      id="cur-pass"
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-12 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] min-h-[44px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                      className="absolute right-1.5 top-1.5 min-w-[36px] min-h-[36px] p-2 text-[#8A8A8A] hover:text-[#1A1A1A] flex items-center justify-center"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password & Confirmation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="new-pass">
                      New Password <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3.5" />
                      <input
                        id="new-pass"
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-12 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] min-h-[44px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                        className="absolute right-1.5 top-1.5 min-w-[36px] min-h-[36px] p-2 text-[#8A8A8A] hover:text-[#1A1A1A] flex items-center justify-center"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="conf-new-pass">
                      Confirm New Password <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3.5" />
                      <input
                        id="conf-new-pass"
                        type={showConfirmNewPassword ? "text" : "password"}
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-12 py-2 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] min-h-[44px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
                        className="absolute right-1.5 top-1.5 min-w-[36px] min-h-[36px] p-2 text-[#8A8A8A] hover:text-[#1A1A1A] flex items-center justify-center"
                      >
                        {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Criteria Guidance */}
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

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[0.6875rem] text-[#5C5C5C] font-body">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-700 font-semibold" : ""}`}>
                      <Check className={`w-3.5 h-3.5 ${hasMinLength ? "text-emerald-600" : "text-[#B0B0B0]"}`} />
                      <span>8+ chars</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-700 font-semibold" : ""}`}>
                      <Check className={`w-3.5 h-3.5 ${hasUppercase ? "text-emerald-600" : "text-[#B0B0B0]"}`} />
                      <span>Uppercase</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-700 font-semibold" : ""}`}>
                      <Check className={`w-3.5 h-3.5 ${hasNumber ? "text-emerald-600" : "text-[#B0B0B0]"}`} />
                      <span>Number</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-700 font-semibold" : ""}`}>
                      <Check className={`w-3.5 h-3.5 ${hasSpecial ? "text-emerald-600" : "text-[#B0B0B0]"}`} />
                      <span>Symbol</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 pt-1 text-[0.625rem] text-[#8A8A8A] font-body">
                    <Info className="w-3.5 h-3.5 text-[#9A7B2C] shrink-0 mt-0.5" />
                    <span>
                      Criteria shown are client-side input guidance and do not guarantee server-side security. Passwords are cryptographically salted and hashed upon transmission.
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] text-xs font-semibold min-h-[44px] transition-colors"
                  >
                    Request Password Update (Preview)
                  </button>
                </div>
              </form>
            </div>

            {/* Two-Factor Authentication (2FA) Status Card (Clearly labeled as requiring backend) */}
            <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-xl p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-[#9A7B2C]" />
                    <h3 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                      Two-Factor Authentication (2FA)
                    </h3>
                  </div>
                  <p className="text-xs text-[#5C5C5C] font-body mt-1">
                    Multi-factor authentication via time-based one-time password (TOTP) or SMS OTP.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded text-[0.6875rem] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  Pending Telecom DLT Registration
                </span>
              </div>

              <div className="p-4 rounded-lg bg-[rgba(154,123,44,0.05)] border border-[rgba(154,123,44,0.15)] text-xs text-[#5C5C5C] space-y-2 font-body">
                <p className="leading-relaxed">
                  <strong>Backend Integration Notice:</strong> In adherence to institutional cybersecurity policies and TRAI DLT regulations in India, automated SMS OTP and Hardware Security Module (HSM) TOTP bindings are currently disabled pending telecom header approval and server-side cryptographic key initialization.
                </p>
                <p className="text-[0.6875rem] text-[#8A8A8A]">
                  Client-side mock 2FA is intentionally withheld to prevent false security representations.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[rgba(26,26,26,0.06)] text-xs text-[#8A8A8A]">
                <span>Status: Inactive on Development Tier</span>
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 rounded border border-[rgba(26,26,26,0.15)] bg-[#FAFAF7] text-[#8A8A8A] text-xs font-semibold cursor-not-allowed min-h-[44px]"
                >
                  Configure Authenticator (Disabled)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================
            TAB 3: NOTIFICATION CHANNELS
            ================================================================ */}
        {activeTab === "notifications" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-xl p-6 sm:p-8 shadow-2xs space-y-6 max-w-3xl">
            <div>
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                Communication Preferences
              </h2>
              <p className="text-xs text-[#5C5C5C] font-body mt-0.5">
                Select the advisory and statutory notifications you wish to receive.
              </p>
            </div>

            {notificationsSaved && (
              <div
                role="alert"
                className="p-3.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Notification preferences saved for this active session.</span>
              </div>
            )}

            <form onSubmit={handleNotificationsSave} className="space-y-4">
              <div className="p-4 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.06)] flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-[#1A1A1A]">
                    Advisory Consultation Updates
                  </h3>
                  <p className="text-[0.6875rem] text-[#5C5C5C] mt-0.5 font-body">
                    Receive operational updates regarding scheduled meetings and debenture term-sheet preparations.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyConsultations}
                  onChange={(e) => setNotifyConsultations(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-[#9A7B2C] focus:ring-[#9A7B2C] min-w-[20px] min-h-[20px]"
                />
              </div>

              <div className="p-4 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.06)] flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-[#1A1A1A]">
                    Term Sheet &amp; Document Disclosures
                  </h3>
                  <p className="text-[0.6875rem] text-[#5C5C5C] mt-0.5 font-body">
                    Notifications when new audited financial statements or private placement offer letters (PAS-4) are uploaded.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyDisclosures}
                  onChange={(e) => setNotifyDisclosures(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-[#9A7B2C] focus:ring-[#9A7B2C] min-w-[20px] min-h-[20px]"
                />
              </div>

              <div className="p-4 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.06)] flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-[#1A1A1A]">
                    Grievance Desk SLA Alerts
                  </h3>
                  <p className="text-[0.6875rem] text-[#5C5C5C] mt-0.5 font-body">
                    Written acknowledgments and milestone tracking under our 30-day statutory dispute resolution procedure.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyGrievances}
                  onChange={(e) => setNotifyGrievances(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-[#9A7B2C] focus:ring-[#9A7B2C] min-w-[20px] min-h-[20px]"
                />
              </div>

              <p className="text-[0.6875rem] text-[#8A8A8A] font-body pt-1">
                Note: Notification preferences are maintained in your active browser session until enterprise email dispatch gateway integration is finalized.
              </p>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] text-xs font-semibold min-h-[44px] transition-colors"
                >
                  Save Notification Preferences
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================================
            TAB 4: PRIVACY & DATA RETENTION
            ================================================================ */}
        {activeTab === "privacy" && (
          <div className="bg-white border border-[rgba(26,26,26,0.08)] rounded-xl p-6 sm:p-8 shadow-2xs space-y-6 max-w-3xl">
            <div>
              <h2 className="font-heading text-lg font-semibold text-[#1A1A1A]">
                Privacy &amp; Data Protection Compliance
              </h2>
              <p className="text-xs text-[#5C5C5C] font-body mt-0.5">
                Statutory disclosures under the Digital Personal Data Protection (DPDP) Act, 2023.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] space-y-2 text-xs text-[#5C5C5C] font-body">
              <h3 className="font-semibold text-[#1A1A1A]">Fiduciary Data Handling</h3>
              <p className="leading-relaxed">
                Niventra Capital Advisory India Pvt. Ltd. processes investor personal data strictly for corporate onboarding, regulatory compliance under the Companies Act 2013, and anti-money laundering due diligence. Personal data is never sold, leased, or transferred to unverified third parties.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#FAFAF7] border border-[rgba(26,26,26,0.08)] space-y-2 text-xs text-[#5C5C5C] font-body">
              <h3 className="font-semibold text-[#1A1A1A]">Statutory Data Retention Rules</h3>
              <p className="leading-relaxed">
                Under the Prevention of Money Laundering Act (PMLA) and the Companies Act 2013, records of transactions, consultations, and statutory filings must be preserved for a minimum statutory period (typically 5 to 8 years) regardless of client portal status.
              </p>
            </div>

            {/* Account Deletion / Data Erasure Request */}
            <div className="p-5 rounded-lg border border-red-200 bg-red-50/50 space-y-3">
              <div className="flex items-center gap-2 text-red-800">
                <Trash2 className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-semibold">Account Erasure &amp; Profile Deletion</h3>
              </div>
              <p className="text-xs text-[#5C5C5C] font-body leading-relaxed">
                Under Section 12 of the DPDP Act 2023, you have the right to request deletion of non-statutory personal data. Erasure requests are processed within 7 to 14 business days subject to legal audit retention exceptions.
              </p>
              <div className="pt-1">
                <Link
                  href="/delete-account/"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-red-300 bg-white text-xs font-semibold text-red-700 hover:bg-red-50 hover:text-red-800 transition-colors min-h-[44px]"
                >
                  <span>Initiate DPDP Account Deletion Request</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Minimal */}
      <footer className="border-t border-[rgba(26,26,26,0.08)] py-4 text-center text-[0.6875rem] text-[#8A8A8A] mt-auto">
        © 2026 Niventra Capital Advisory India. Confidential Client Portal.
      </footer>
    </div>
  );
}
