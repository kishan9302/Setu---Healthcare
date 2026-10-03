"use client";

import React, { useState } from "react";
import { X, Save, AlertCircle, RefreshCw } from "lucide-react";
import { InventoryItem, apiUpdateInventory } from "@/lib/api";

interface InventoryEditModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onSuccess: (updated: InventoryItem) => void;
}

export const InventoryEditModal: React.FC<InventoryEditModalProps> = ({
  item,
  onClose,
  onSuccess
}) => {
  if (!item) return null;

  const [stock, setStock] = useState(item.current_stock);
  const [dailyBurn, setDailyBurn] = useState(item.daily_consumption);
  const [minThreshold, setMinThreshold] = useState(item.minimum_threshold);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("aarogya_token") || undefined;
      const updated = await apiUpdateInventory(
        item.id,
        {
          current_stock: Number(stock),
          daily_consumption: Number(dailyBurn),
          minimum_threshold: Number(minThreshold)
        },
        token
      );
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      console.error("Update error:", err);
      setError("Failed to update inventory record. Ensure you are signed in as Hospital Admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Update Medicine Inventory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {item.medicine.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Current Available Stock ({item.medicine.unit})
            </label>
            <input
              type="number"
              min={0}
              required
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Daily Consumption Rate ({item.medicine.unit}/day)
            </label>
            <input
              type="number"
              min={0.1}
              step={0.1}
              required
              value={dailyBurn}
              onChange={(e) => setDailyBurn(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Minimum Safety Threshold ({item.medicine.unit})
            </label>
            <input
              type="number"
              min={0}
              required
              value={minThreshold}
              onChange={(e) => setMinThreshold(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm font-semibold text-slate-900"
            />
          </div>

          {/* Quick Realtime Preview */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] space-y-1 text-slate-600">
            <div>
              Projected Days Remaining:{" "}
              <strong className="text-slate-900">
                {dailyBurn > 0 ? (stock / dailyBurn).toFixed(1) : "—"} days
              </strong>
            </div>
            <div>
              Calculated Status:{" "}
              <strong className={stock <= minThreshold || (stock / dailyBurn) <= 3 ? "text-red-700" : (stock / dailyBurn) <= 7 ? "text-amber-700" : "text-emerald-700"}>
                {stock <= minThreshold || (stock / dailyBurn) <= 3 ? "Critical" : (stock / dailyBurn) <= 7 ? "Low Stock" : "Healthy"}
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save & Recalculate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
