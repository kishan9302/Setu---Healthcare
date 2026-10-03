"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Sparkles,
  ShieldAlert,
  Clock,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Activity,
  Bed,
  MapPin,
  PhoneCall
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

export default function HomePage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-transparent pt-12 pb-16 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Status Ribbon */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>⚡ Connected Regional Grid: Bhopal • Indore • Ujjain • Jabalpur</span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-lg sm:text-xl font-medium text-blue-700">
              {t.heroSubtitle}
            </p>
          </div>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t.heroDescription}
          </p>

          {/* Main Natural Language Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto bg-white p-2.5 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 flex flex-col sm:flex-row gap-2.5"
          >
            <div className="flex-1 flex items-center gap-3 px-3 py-2">
              <Search className="w-5 h-5 text-blue-600 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <span>{t.searchBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Tag Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">{t.quickTagsLabel}</span>
            <button
              onClick={() => handleTagClick("Mujhe aaj orthopedic doctor chahiye")}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 transition-colors shadow-2xs"
            >
              🦴 {t.tagOrtho}
            </button>
            <button
              onClick={() => handleTagClick("Cardiologist today")}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 transition-colors shadow-2xs"
            >
              ❤️ {t.tagCardio}
            </button>
            <button
              onClick={() => handleTagClick("Emergency care 108")}
              className="px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-medium transition-colors shadow-2xs"
            >
              🚨 {t.tagEmergency}
            </button>
            <button
              onClick={() => handleTagClick("X-ray test")}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 transition-colors shadow-2xs"
            >
              🔬 {t.tagXray}
            </button>
            <button
              onClick={() => handleTagClick("ICU Bed")}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 transition-colors shadow-2xs"
            >
              🛏️ {t.tagICU}
            </button>
          </div>
        </div>
      </section>

      {/* Emergency Strip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-4 sm:p-5 rounded-2xl shadow-lg shadow-red-600/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                24x7 Ambulance & Emergency Trauma Desk
              </h3>
              <p className="text-xs text-red-100">
                {t.emergencyNotice}
              </p>
            </div>
          </div>
          <a
            href="tel:108"
            className="w-full sm:w-auto px-5 py-2.5 bg-white text-red-700 hover:bg-red-50 text-xs sm:text-sm font-bold rounded-xl transition-colors shrink-0 text-center shadow"
          >
            Call 108 Now
          </a>
        </div>
      </section>

      {/* 3 Core Value Pillars (30-Second USP Clarity) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {language === "en" ? "How SETU Works" : "SETU (सेतु) कैसे काम करता है"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Zero fabricated data. Patients find verified availability, while connected hospitals predict supply shortages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t.valueProp1Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.valueProp1Desc}
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Verified On-Duty Doctors
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t.valueProp2Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.valueProp2Desc}
            </p>
            <div className="pt-2 text-xs font-semibold text-blue-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Powered by Groq NLP
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {t.valueProp3Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.valueProp3Desc}
            </p>
            <div className="pt-2 text-xs font-semibold text-amber-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Inter-Hospital Rebalancing
            </div>
          </div>
        </div>
      </section>

      {/* Connected Regional Network Live Preview */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  {language === "en" ? "Connected Hospital Network Snapshot" : "संबद्ध अस्पताल नेटवर्क लाइव स्थिति"}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time operational overview across Madhya Pradesh key centers.
              </p>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>{language === "en" ? "View all hospitals" : "सभी अस्पताल देखें"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hospital 1 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Bhopal City Hospital</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Arera Hills, Bhopal (3.2 km)
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Available
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                <div>Beds: <strong className="text-slate-900">32 Free</strong></div>
                <div>ICU: <strong className="text-slate-900">6 Avail</strong></div>
                <div>Doctors: <strong className="text-emerald-700">On Duty</strong></div>
                <div>Status: <strong className="text-slate-900">Synced 8m ago</strong></div>
              </div>
              <Link
                href="/hospitals/hosp-bhopal-city"
                className="block text-center py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-blue-600 transition-colors"
              >
                {t.viewHospital}
              </Link>
            </div>

            {/* Hospital 2 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">AIIMS Bhopal Regional Node</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Saket Nagar, Bhopal (5.8 km)
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Available
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                <div>Beds: <strong className="text-slate-900">85 Free</strong></div>
                <div>ICU: <strong className="text-slate-900">14 Avail</strong></div>
                <div>Trauma: <strong className="text-emerald-700">Level 1 ER</strong></div>
                <div>Status: <strong className="text-slate-900">Synced 12m ago</strong></div>
              </div>
              <Link
                href="/hospitals/hosp-aiims-bhopal"
                className="block text-center py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-blue-600 transition-colors"
              >
                {t.viewHospital}
              </Link>
            </div>

            {/* Hospital 3 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Indore Memorial Care</h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Vijay Nagar, Indore
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  Surplus Hub
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                <div>Beds: <strong className="text-slate-900">48 Free</strong></div>
                <div>ICU: <strong className="text-slate-900">10 Avail</strong></div>
                <div>Medicine: <strong className="text-blue-700">Surplus Reserve</strong></div>
                <div>Status: <strong className="text-slate-900">Synced 4m ago</strong></div>
              </div>
              <Link
                href="/hospitals/hosp-indore-memorial"
                className="block text-center py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-blue-600 transition-colors"
              >
                {t.viewHospital}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
