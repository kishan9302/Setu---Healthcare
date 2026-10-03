"use client";

import React from "react";
import Link from "next/link";
import { Activity, Phone, ShieldCheck, HeartHandshake } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & USP */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span>{t.brandName}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                सेतु
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Connecting Indian patients to available hospital resources while providing AI-driven stockout prediction and inter-hospital medicine redistribution across regional healthcare networks.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-amber-300 text-xs border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.demoNetworkBadge}
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
              {t.navFindCare}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/search?q=Orthopedic+doctor" className="hover:text-white transition-colors">
                  Orthopedics & Fracture Care
                </Link>
              </li>
              <li>
                <Link href="/search?q=Cardiologist+today" className="hover:text-white transition-colors">
                  Cardiology & Emergency Cath Lab
                </Link>
              </li>
              <li>
                <Link href="/search?q=Emergency+care" className="hover:text-white transition-colors">
                  Emergency Trauma Units (24x7)
                </Link>
              </li>
              <li>
                <Link href="/search?q=Blood+test" className="hover:text-white transition-colors">
                  Pathology & Diagnostics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Emergency & Command Center */}
          <div className="space-y-2">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
              Regional Command Center
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-1.5 text-white font-medium">
                <Phone className="w-3.5 h-3.5 text-red-400" />
                Ambulance / Emergency: 108
              </p>
              <p>Regional Node: Arera Hills, Bhopal (M.P.)</p>
              <p>Connected Hubs: Indore, Ujjain, Jabalpur</p>
              <p className="flex items-center gap-1 text-emerald-400 pt-1">
                <HeartHandshake className="w-3.5 h-3.5" />
                Zero Fabricated Data Standard
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 SETU (सेतु). Sahi hospital, sahi jagah, sahi waqt par.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-400">Hospital Compliance</Link>
            <Link href="/login" className="hover:text-slate-400">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
