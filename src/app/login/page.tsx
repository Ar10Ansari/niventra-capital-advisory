"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Authentication failed. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      // Route according to user role
      if (data.user.role === "ADMIN" || data.user.role === "STAFF") {
        router.push("/admin/");
      } else {
        router.push("/dashboard/");
      }
    } catch {
      setErrorMessage("Network error connecting to institutional gateway. Please try again.");
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
            className="text-xs text-[#5C5C5C] hover:text-[#1A1A1A] transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white border border-[rgba(26,26,26,0.1)] rounded-lg p-8 shadow-sm">
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

            {errorMessage && (
              <div className="mb-6 p-3 rounded bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5" htmlFor="login-email">
                  Corporate / Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#1A1A1A]" htmlFor="login-password">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A8A8A] absolute left-3 top-3" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded border border-[rgba(26,26,26,0.15)] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#9A7B2C] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-[#1A1A1A] text-white hover:bg-[#2D2D2D] text-xs font-semibold tracking-wide transition-colors disabled:opacity-50 mt-2"
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

      {/* Footer Minimal */}
      <footer className="border-t border-[rgba(26,26,26,0.08)] py-4 text-center text-[0.6875rem] text-[#8A8A8A]">
        © 2026 Niventra Capital Advisory India. Confidential & Proprietary Systems.
      </footer>
    </div>
  );
}
