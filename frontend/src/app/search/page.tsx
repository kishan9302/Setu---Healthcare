"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Sparkles,
  MapPin,
  Clock,
  Building2,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowRight,
  Filter,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { apiSearch, SearchResponse, HospitalMatchCard } from "@/lib/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "Mujhe aaj orthopedic doctor chahiye";

  const { t, language } = useLanguage();
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResponse | null>(null);

  // Filters
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [todayOnly, setTodayOnly] = useState<boolean>(true);

  const executeSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiSearch(searchTerm.trim());
      setResults(data);
    } catch (err: any) {
      console.error("Search error:", err);
      setError("Unable to connect to healthcare search network. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    executeSearch(query.trim());
  };

  // Filtered hospitals
  const filteredHospitals = results?.hospitals.filter((card) => {
    if (todayOnly && !card.doctor_available_today) return false;
    if (selectedDept !== "All" && card.matching_department !== selectedDept) return false;
    return true;
  }) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Search Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search className="w-5 h-5 text-blue-600 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{t.searchBtn}</span>
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-slate-500 font-medium">Try:</span>
          <button
            onClick={() => {
              setQuery("Mujhe aaj orthopedic doctor chahiye");
              executeSearch("Mujhe aaj orthopedic doctor chahiye");
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors"
          >
            🦴 "Mujhe aaj orthopedic doctor chahiye"
          </button>
          <button
            onClick={() => {
              setQuery("Need cardiologist today emergency");
              executeSearch("Need cardiologist today emergency");
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors"
          >
            ❤️ "Cardiologist today emergency"
          </button>
          <button
            onClick={() => {
              setQuery("Child specialist pediatrician Bhopal");
              executeSearch("Child specialist pediatrician Bhopal");
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors"
          >
            👶 "Pediatrician Bhopal"
          </button>
        </div>
      </div>

      {/* AI Understanding Breakdown Card */}
      {results && results.intent && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white rounded-2xl border border-blue-200/80 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-3">
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>{t.aiUnderstandingTitle}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-200/70 text-blue-800 font-medium ml-auto">
              Groq NLP Interpretation
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/80 p-3 rounded-xl border border-blue-100">
              <span className="text-slate-500 block mb-1">{t.departmentLabel}</span>
              <strong className="text-slate-900 font-semibold text-sm">
                {results.intent.department || "General Medicine"}
              </strong>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-blue-100">
              <span className="text-slate-500 block mb-1">{t.serviceLabel}</span>
              <strong className="text-slate-900 font-semibold text-sm">
                {results.intent.service || "Doctor Consultation"}
              </strong>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-blue-100">
              <span className="text-slate-500 block mb-1">{t.urgencyLabel}</span>
              <span className={`inline-flex items-center gap-1 font-semibold text-sm ${
                results.intent.urgency === "Today" || results.intent.urgency === "Urgent"
                  ? "text-red-700"
                  : "text-slate-900"
              }`}>
                {results.intent.urgency || "Normal"}
              </span>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-blue-100">
              <span className="text-slate-500 block mb-1">{t.cityLabel}</span>
              <strong className="text-slate-900 font-semibold text-sm">
                {results.intent.city || "Bhopal"}
              </strong>
            </div>
          </div>

          <p className="text-xs text-blue-800/80 mt-3 pt-3 border-t border-blue-200/50">
            ℹ️ {results.ai_interpretation_summary}
          </p>
        </div>
      )}

      {/* Main Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </div>

            {/* Department Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="All">All Departments</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Emergency & Trauma">Emergency & Trauma</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>

            {/* Doctor Availability Check */}
            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={todayOnly}
                  onChange={(e) => setTodayOnly(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Only show doctors available today</span>
              </label>
            </div>

            {/* Network Note */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-normal">
              Availability is deterministically queried from the regional hospital database.
            </div>
          </div>
        </aside>

        {/* Hospital Result Cards List */}
        <main className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span>
              Showing <strong>{filteredHospitals.length}</strong> matching verified hospital(s)
            </span>
            <span>Sorted by availability & distance</span>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse space-y-4">
                  <div className="h-5 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-10 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Error Notice */}
          {error && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-semibold">Unable to fetch live search results</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Hospital Cards */}
          {!loading && filteredHospitals.length > 0 && (
            <div className="space-y-4">
              {filteredHospitals.map((card, idx) => {
                const h = card.hospital;
                return (
                  <div
                    key={h.id || idx}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900">
                            {h.name}
                          </h3>
                          {h.is_connected && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                              Connected Hospital
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{h.address}</span>
                          <span className="font-semibold text-blue-700">• {card.distance_km} {t.distanceAway}</span>
                        </p>
                      </div>

                      {/* Status Indicator Badge */}
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{card.department_operational ? t.available : t.limited}</span>
                      </div>
                    </div>

                    {/* Operational Checks */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>{card.matching_department}</strong> Operational
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Doctor Available: <strong>{card.doctor_available_today ? "Today" : "Waitlist"}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{t.updatedMinsAgo}: {card.last_updated_minutes_ago}m</span>
                      </div>
                    </div>

                    {/* Doctor Availability Details */}
                    {card.matching_doctors && card.matching_doctors.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-700 block">
                          On-Duty Specialists:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {card.matching_doctors.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50/70 border border-blue-200/60 text-xs text-slate-800"
                            >
                              <UserCheck className="w-4 h-4 text-blue-600" />
                              <div>
                                <span className="font-semibold block">{doc.name}</span>
                                <span className="text-[11px] text-slate-500">
                                  {doc.specialty} • Shift: {doc.shift_timings}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Card Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Beds Free: <strong className="text-slate-900">{h.beds_available}</strong></span>
                        <span>ICU: <strong className="text-slate-900">{h.icu_available}</strong></span>
                        <span>Emergency: <strong className="text-red-700">{h.emergency_contact}</strong></span>
                      </div>

                      <Link
                        href={`/hospitals/${h.id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <span>{t.viewHospital}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredHospitals.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">
                  No matching hospitals found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search query or unchecking filters to view hospitals in neighboring districts.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedDept("All");
                  setTodayOnly(false);
                }}
                className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading Search Portal...</div>}>
      <SearchContent />
    </Suspense>
  );
}
