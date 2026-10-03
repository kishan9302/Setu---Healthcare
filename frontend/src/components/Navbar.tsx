"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, Globe, ShieldAlert, User, LogOut } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("aarogya_token");
    setUserToken(token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("aarogya_token");
    localStorage.removeItem("aarogya_user");
    setUserToken(null);
    router.push("/");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Emergency & Simulated Notice Top Ribbon */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-600 text-white">
              {t.demoNetworkBadge}
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Bhopal • Indore • Ujjain • Jabalpur Regional Network
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              {t.emergencyPill}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                {t.brandName}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-200">
                सेतु
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {t.brandTagline}
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            href="/"
            className={`px-3 py-2 rounded-md transition-colors ${
              pathname === "/" ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {t.navHome}
          </Link>
          <Link
            href="/search"
            className={`px-3 py-2 rounded-md transition-colors ${
              pathname.startsWith("/search") ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {t.navFindCare}
          </Link>
          <Link
            href="/admin/dashboard"
            className={`px-3 py-2 rounded-md transition-colors ${
              pathname.startsWith("/admin") ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {t.navDashboard}
          </Link>
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === "en" ? "हिंदी" : "English"}</span>
          </button>

          {/* User Auth Action */}
          {userToken ? (
            <div className="flex items-center gap-2">
              <Link
                href="/admin/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>Dr. Ramesh Gupta</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.navLogout}</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.navLogin}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
