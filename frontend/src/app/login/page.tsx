"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { apiLogin } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [email, setEmail] = useState("admin@bhopalcity.org");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin(email.trim(), password);
      localStorage.setItem("aarogya_token", res.access_token);
      localStorage.setItem("aarogya_user", JSON.stringify(res.user));
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("admin123");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-8 shadow-lg shadow-slate-200/50 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm shadow-blue-500/30">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            SETU — Hospital Admin Console
          </h1>
          <p className="text-xs text-blue-700 font-medium">
            Sahi hospital, sahi jagah, sahi waqt par.
          </p>
        </div>

        {/* Demo Credentials Box for Hackathon Judges */}
        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Hackathon Quick-Fill Credentials:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setDemoCredentials("admin@bhopalcity.org")}
              className={`p-2 rounded-lg text-left border transition-colors ${
                email === "admin@bhopalcity.org"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-blue-50"
              }`}
            >
              <strong className="block text-[11px]">Bhopal City Hospital</strong>
              <span className="text-[10px] opacity-80">(Shortage scenario)</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("admin@indorememorial.org")}
              className={`p-2 rounded-lg text-left border transition-colors ${
                email === "admin@indorememorial.org"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-blue-50"
              }`}
            >
              <strong className="block text-[11px]">Indore Memorial</strong>
              <span className="text-[10px] opacity-80">(Surplus provider)</span>
            </button>
          </div>
          <p className="text-[10px] text-blue-800/80 pt-1">
            Default password for both demo accounts: <code className="font-mono bg-blue-100 px-1 py-0.5 rounded">admin123</code>
          </p>
        </div>

        {/* Error notice */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Official Email Address
            </label>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
              <Mail className="w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hospital.org"
                className="w-full text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Password
            </label>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 bg-white">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-400 border-t border-slate-100 pt-4">
          Demo Network Security Protocol • Authorized Healthcare Personnel Only
        </div>
      </div>
    </div>
  );
}
