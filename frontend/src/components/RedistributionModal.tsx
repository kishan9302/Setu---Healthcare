"use client";

import React, { useState } from "react";
import {
  X,
  ArrowRight,
  ShieldCheck,
  Truck,
  Building2,
  Sparkles,
  CheckCircle2,
  Clock
} from "lucide-react";
import { RedistributionOpportunity } from "@/lib/api";

interface RedistributionModalProps {
  opportunity: RedistributionOpportunity | null;
  onClose: () => void;
}

export const RedistributionModal: React.FC<RedistributionModalProps> = ({
  opportunity,
  onClose
}) => {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <Truck className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Inter-Hospital Redistribution Opportunity
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic rebalancing recommendation based on live consumption rates
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Medicine Banner */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Target Medicine SKU
            </span>
            <strong className="text-base text-slate-900 block">
              {opportunity.medicine_name}
            </strong>
            <span className="text-xs text-slate-500">
              Generic: {opportunity.generic_name}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-400 block">Suggested Rebalance</span>
            <span className="text-lg font-bold text-blue-700">
              {opportunity.suggested_transfer_quantity} Units
            </span>
          </div>
        </div>

        {/* Visual Node Corridor Connector Diagram */}
        <div className="bg-gradient-to-r from-red-50/50 via-slate-50 to-emerald-50/50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Shortage Node (Hospital A) */}
            <div className="bg-white p-3.5 rounded-xl border border-red-200 shadow-2xs w-full sm:w-48 text-center space-y-1">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                Shortage Risk (~{opportunity.shortage_days_remaining.toFixed(1)} Days)
              </span>
              <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                {opportunity.shortage_hospital_name}
              </h4>
              <p className="text-[11px] text-slate-500">{opportunity.shortage_hospital_city}</p>
              <div className="text-xs pt-1 font-semibold text-red-700">
                Current: {opportunity.shortage_stock} units
              </div>
            </div>

            {/* Transfer Corridor Indicator */}
            <div className="flex flex-col items-center justify-center text-center px-2 py-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                <Truck className="w-4 h-4" />
                <span>{opportunity.suggested_transfer_quantity} Units</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">
                {opportunity.distance_km} km • ~{opportunity.estimated_transit_hours}h Transit
              </span>
            </div>

            {/* Surplus Node (Hospital B) */}
            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs w-full sm:w-48 text-center space-y-1">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Surplus Reserve (~{opportunity.surplus_days_remaining.toFixed(0)} Days)
              </span>
              <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                {opportunity.surplus_hospital_name}
              </h4>
              <p className="text-[11px] text-slate-500">{opportunity.surplus_hospital_city}</p>
              <div className="text-xs pt-1 font-semibold text-emerald-700">
                Surplus: {opportunity.surplus_stock} units
              </div>
            </div>
          </div>
        </div>

        {/* AI Supply Chain Rationale */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Supply Chain Logistics Analysis:</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {opportunity.ai_explanation}
          </p>
        </div>

        {/* Confirmation State */}
        {acknowledged ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">Inter-Hospital Rebalancing Request Logged (Simulated)</p>
              <p className="text-[11px] opacity-90">
                Notification dispatched to medical superintendent at {opportunity.surplus_hospital_name}. No automatic inventory write occurred.
              </p>
            </div>
          </div>
        ) : null}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            Human-in-the-Loop review protocol.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
            >
              Close
            </button>
            {!acknowledged && (
              <button
                onClick={() => setAcknowledged(true)}
                className="flex-1 sm:flex-none px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Request Stock Rebalance</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
