"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  ShieldCheck,
  ArrowLeft,
  Bed,
  HeartPulse,
  Activity,
  Calendar
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { apiGetHospitalDetail, HospitalDetail } from "@/lib/api";

export default function HospitalDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();

  const [hospital, setHospital] = useState<HospitalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGetHospitalDetail(id as string);
        setHospital(data);
      } catch (err) {
        console.error("Error fetching hospital details:", err);
        setError("Unable to retrieve hospital profile. Please ensure backend is active.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-6 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/4" />
        <div className="h-32 bg-white rounded-2xl border border-slate-200" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Hospital Profile Not Found</h2>
        <p className="text-xs text-slate-500">{error || "The requested hospital record is unavailable."}</p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hospital Search</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search Results</span>
        </button>
      </div>

      {/* Hospital Overview Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {hospital.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                {hospital.hospital_type}
              </span>
            </div>
            {hospital.hindi_name && (
              <p className="text-sm font-medium text-slate-600">
                {hospital.hindi_name}
              </p>
            )}
            <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{hospital.address}</span>
            </p>
          </div>

          {/* Operational Status */}
          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Verified Operational Grid
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last synchronized 8 mins ago
            </span>
          </div>
        </div>

        {/* Real-time Core Capacity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-xs text-slate-500 block mb-1">General Beds</span>
            <strong className="text-xl font-bold text-slate-900">
              {hospital.beds_available} / {hospital.total_beds}
            </strong>
            <span className="text-[10px] text-emerald-700 block font-medium mt-0.5">Available</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-xs text-slate-500 block mb-1">ICU Beds</span>
            <strong className="text-xl font-bold text-slate-900">
              {hospital.icu_available} Free
            </strong>
            <span className="text-[10px] text-emerald-700 block font-medium mt-0.5">Critical Ready</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-xs text-slate-500 block mb-1">Oxygen Grid</span>
            <strong className="text-base font-bold text-emerald-700">
              {hospital.oxygen_available ? "100% Operational" : "Limited"}
            </strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">Liquid Medical O2</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-xs text-slate-500 block mb-1">Emergency Desk</span>
            <strong className="text-base font-bold text-red-700">
              {hospital.emergency_contact}
            </strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">24x7 Ambulance Link</span>
          </div>
        </div>
      </div>

      {/* Departments & On-Duty Doctors */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {language === "en" ? "Departments & Verified Availability" : "सत्यापित विभाग एवं उपलब्धता"}
          </h2>
          <span className="text-xs text-slate-500">
            {hospital.departments?.length || 0} active department(s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospital.departments?.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{dept.name}</h3>
                  {dept.hindi_name && (
                    <p className="text-xs text-slate-500">{dept.hindi_name}</p>
                  )}
                  {dept.description && (
                    <p className="text-xs text-slate-600 mt-1">{dept.description}</p>
                  )}
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  {dept.is_operational ? "Active" : "Closed"}
                </span>
              </div>

              {/* Department Doctors */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Doctors in this Department:
                </span>
                {dept.doctors && dept.doctors.length > 0 ? (
                  <div className="space-y-2">
                    {dept.doctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                            Dr
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{doc.name}</span>
                            <span className="text-[11px] text-slate-500">
                              {doc.qualification} • {doc.specialty}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {doc.is_available_today ? "On Duty Today" : "Unavailable"}
                          </span>
                          <span className="block text-[10px] text-slate-400">{doc.shift_timings}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No scheduled doctors today for this wing.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
