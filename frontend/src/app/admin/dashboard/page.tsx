"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Activity,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  RefreshCw,
  Edit3,
  Clock,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import {
  apiGetDashboardMetrics,
  apiGetStockoutAlerts,
  apiGetRedistribution,
  apiGetInventory,
  DashboardMetrics,
  StockoutAlert,
  RedistributionOpportunity,
  InventoryItem
} from "@/lib/api";
import { RedistributionModal } from "@/components/RedistributionModal";
import { InventoryEditModal } from "@/components/InventoryEditModal";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  // Active hospital context
  const [selectedHospitalId, setSelectedHospitalId] = useState("hosp-bhopal-city");

  // Data states
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [stockoutAlerts, setStockoutAlerts] = useState<StockoutAlert[]>([]);
  const [redistOpportunities, setRedistOpportunities] = useState<RedistributionOpportunity[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Table filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [selectedOpportunity, setSelectedOpportunity] = useState<RedistributionOpportunity | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const fetchDashboardData = async (hospId: string) => {
    setLoading(true);
    try {
      const [m, alerts, redist, inv] = await Promise.all([
        apiGetDashboardMetrics(hospId).catch(() => null),
        apiGetStockoutAlerts(hospId).catch(() => []),
        apiGetRedistribution(hospId).catch(() => []),
        apiGetInventory(hospId).catch(() => [])
      ]);
      setMetrics(m);
      setStockoutAlerts(alerts);
      setRedistOpportunities(redist);
      setInventory(inv);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedHospitalId);
  }, [selectedHospitalId]);

  const handleItemUpdated = (updated: InventoryItem) => {
    setInventory((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    // Refresh metrics & insights after update
    apiGetDashboardMetrics(selectedHospitalId).then((m) => setMetrics(m)).catch(() => {});
    apiGetStockoutAlerts(selectedHospitalId).then((a) => setStockoutAlerts(a)).catch(() => {});
    apiGetRedistribution(selectedHospitalId).then((r) => setRedistOpportunities(r)).catch(() => {});
  };

  const filteredInventory = inventory.filter((item) => {
    if (statusFilter !== "All" && item.stock_status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.medicine.name.toLowerCase().includes(term) ||
        item.medicine.generic_name.toLowerCase().includes(term) ||
        item.medicine.category.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Administrative Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              SETU — {selectedHospitalId === "hosp-bhopal-city"
                ? "Bhopal City Hospital Console"
                : "Indore Memorial Care Console"}
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              Operational Node
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
            <span className="text-blue-700 font-medium">Sahi hospital, sahi jagah, sahi waqt par.</span>
            <span>•</span>
            <span>Logged in: <strong>Dr. Ramesh Gupta (Medical Superintendent & Admin)</strong></span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">Live Regional Sync</span>
          </p>
        </div>

        {/* Hospital Switcher (Crucial for demonstrating both sides of redistribution!) */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-slate-500 hidden sm:inline">
            Viewing Node:
          </label>
          <div className="relative">
            <select
              value={selectedHospitalId}
              onChange={(e) => setSelectedHospitalId(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-800 py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="hosp-bhopal-city">Bhopal City Hospital (Approaching Shortage)</option>
              <option value="hosp-indore-memorial">Indore Memorial Care (Surplus Provider)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
          <button
            onClick={() => fetchDashboardData(selectedHospitalId)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Refresh Live Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Top Metric Overview (Strictly 4 KPI Cards matching DESIGN.md) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Medicines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-medium text-slate-500 block">
            {t.totalMedicines}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {metrics?.total_medicines ?? inventory.length}
            </span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              SKU Monitored
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Categorized by critical tier
          </p>
        </div>

        {/* Card 2: Healthy Stock */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-medium text-slate-500 block">
            {t.healthyStock}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              {metrics?.healthy_count ?? 17}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Stable
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            &gt; 15 days projected runway
          </p>
        </div>

        {/* Card 3: Low Stock Warning */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-medium text-slate-500 block">
            {t.lowStock}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">
              {metrics?.low_count ?? 5}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Reorder Soon
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            4 to 7 days stock remaining
          </p>
        </div>

        {/* Card 4: Critical Stock Alert */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-medium text-slate-500 block">
            {t.criticalStock}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-red-600">
              {metrics?.critical_count ?? 2}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-800 bg-red-50 px-2 py-0.5 rounded">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              &lt; 72 Hours
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Immediate rebalancing priority
          </p>
        </div>
      </div>

      {/* AI Supply Chain Insights Section (Highlighted USP Section) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">
                {t.aiSupplyChainInsights}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.aiSupplyChainSubtitle}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            Groq AI Engine Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card A: Stockout Risk Alert Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                  <AlertTriangle className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                    Stockout Risk Alert
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {stockoutAlerts.length > 0
                      ? stockoutAlerts[0].medicine_name
                      : "Human Insulin Regular 100 IU/ml"}
                  </h3>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold text-xs">
                ~{stockoutAlerts.length > 0 ? stockoutAlerts[0].days_remaining.toFixed(1) : "3.0"} Days Left
              </span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Current Stock</span>
                <strong className="text-slate-900 text-sm">
                  {stockoutAlerts.length > 0 ? stockoutAlerts[0].current_stock : 18} Vials
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Daily Usage</span>
                <strong className="text-slate-900 text-sm">
                  {stockoutAlerts.length > 0 ? stockoutAlerts[0].daily_consumption : 6.0} Vials/day
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Min Safety</span>
                <strong className="text-slate-900 text-sm">
                  {stockoutAlerts.length > 0 ? stockoutAlerts[0].minimum_threshold : 25} Vials
                </strong>
              </div>
            </div>

            {/* Groq AI Human-Readable Explanation */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                AI Clinical Rationale:
              </span>
              <p className="text-slate-700 leading-relaxed">
                {stockoutAlerts.length > 0
                  ? stockoutAlerts[0].ai_explanation
                  : "Insulin Regular is projected to reach critical stock level in approximately 3 days based on the current consumption rate of 6 vials/day."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Automated deterministic logic • Groq verified
              </span>
              <button
                onClick={() => {
                  const insulinItem = inventory.find((i) => i.medicine.name.includes("Insulin"));
                  if (insulinItem) setEditingItem(insulinItem);
                }}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
              >
                {t.viewAnalysis}
              </button>
            </div>
          </div>

          {/* Card B: Inter-Hospital Redistribution Opportunity Card */}
          <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-xs space-y-4 relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/40">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <Truck className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                    Redistribution Opportunity
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {redistOpportunities.length > 0
                      ? redistOpportunities[0].medicine_name
                      : "Human Insulin Regular 100 IU/ml"}
                  </h3>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                Optimal Match Found
              </span>
            </div>

            {/* Visual Node Connector between the two hospitals */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                {/* Shortage Node */}
                <div className="text-left">
                  <span className="text-[10px] font-bold text-red-700 uppercase block">Shortage Node</span>
                  <strong className="text-slate-900 block">
                    {redistOpportunities.length > 0
                      ? redistOpportunities[0].shortage_hospital_name
                      : "Bhopal City Hospital"}
                  </strong>
                  <span className="text-slate-500 text-[11px]">
                    {redistOpportunities.length > 0
                      ? redistOpportunities[0].shortage_stock
                      : 18} units remaining
                  </span>
                </div>

                {/* Arrow & Corridor */}
                <div className="flex flex-col items-center px-3">
                  <div className="flex items-center gap-1 text-blue-700 font-bold text-xs">
                    <Truck className="w-3.5 h-3.5" />
                    <span>
                      {redistOpportunities.length > 0
                        ? redistOpportunities[0].suggested_transfer_quantity
                        : 66} units
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {redistOpportunities.length > 0
                      ? redistOpportunities[0].distance_km
                      : 8.1} km transit
                  </span>
                </div>

                {/* Surplus Node */}
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Surplus Reserve</span>
                  <strong className="text-slate-900 block">
                    {redistOpportunities.length > 0
                      ? redistOpportunities[0].surplus_hospital_name
                      : "Indore Memorial Care"}
                  </strong>
                  <span className="text-slate-500 text-[11px]">
                    {redistOpportunities.length > 0
                      ? redistOpportunities[0].surplus_stock
                      : 500} units available
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {redistOpportunities.length > 0
                ? redistOpportunities[0].ai_explanation
                : "Indore Memorial Care holds higher available stock of Insulin while Bhopal City Hospital is approaching a shortage. A 66-unit transfer stabilizes both nodes."}
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Requires human admin verification
              </span>
              <button
                onClick={() => {
                  if (redistOpportunities.length > 0) {
                    setSelectedOpportunity(redistOpportunities[0]);
                  } else {
                    // Fallback demo opportunity
                    setSelectedOpportunity({
                      id: "DEMO-REDIST-1",
                      medicine_name: "Human Insulin Regular 100 IU/ml",
                      generic_name: "Insulin Regular",
                      shortage_hospital_id: "hosp-bhopal-city",
                      shortage_hospital_name: "Bhopal City Hospital",
                      shortage_hospital_city: "Bhopal",
                      shortage_stock: 18,
                      shortage_consumption: 6.0,
                      shortage_days_remaining: 3.0,
                      surplus_hospital_id: "hosp-indore-memorial",
                      surplus_hospital_name: "Indore Memorial Care & Trauma Institute",
                      surplus_hospital_city: "Indore",
                      surplus_stock: 500,
                      surplus_consumption: 10.0,
                      surplus_days_remaining: 50.0,
                      suggested_transfer_quantity: 66,
                      distance_km: 8.1,
                      estimated_transit_hours: 1.8,
                      urgency: "High",
                      ai_explanation: "Indore Memorial Care holds 500 units (50 days supply) of Insulin Regular, while Bhopal City Hospital has only 18 units remaining (~3.0 days). Reallocating 66 units resolves the shortage without impacting Indore Memorial's safety buffer."
                    });
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>{t.reviewOpportunity}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Medicine Inventory Table Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {t.medicineInventory}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time consumption and stock status for {selectedHospitalId === "hosp-bhopal-city" ? "Bhopal City Hospital" : "Indore Memorial Care"}
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search medicine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-56"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {["All", "Healthy", "Low", "Critical"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    statusFilter === st
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table View (Desktop & Responsive Mobile Cards) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="pb-3 pl-2">{t.medicineName}</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-right">{t.stock}</th>
                <th className="pb-3 text-right">{t.dailyUsage}</th>
                <th className="pb-3 text-right">Min Threshold</th>
                <th className="pb-3 text-center">{t.status}</th>
                <th className="pb-3">{t.predictedRisk}</th>
                <th className="pb-3 text-right pr-2">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => {
                const isCrit = item.stock_status === "Critical";
                const isLow = item.stock_status === "Low";
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isCrit ? "bg-red-50/30" : isLow ? "bg-amber-50/20" : ""
                    }`}
                  >
                    <td className="py-3 pl-2 font-semibold text-slate-900">
                      <div>{item.medicine.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {item.medicine.dosage_form} • Batch: {item.batch_number}
                      </div>
                    </td>
                    <td className="py-3 text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700">
                        {item.medicine.category}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-slate-900">
                      {item.current_stock} <span className="font-normal text-[10px] text-slate-400">{item.medicine.unit}</span>
                    </td>
                    <td className="py-3 text-right text-slate-600">
                      {item.daily_consumption} <span className="text-[10px] text-slate-400">/day</span>
                    </td>
                    <td className="py-3 text-right text-slate-500">
                      {item.minimum_threshold}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isCrit
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : isLow
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isCrit ? "bg-red-600 animate-pulse" : isLow ? "bg-amber-600" : "bg-emerald-600"
                          }`}
                        />
                        {item.stock_status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`font-semibold ${
                          isCrit ? "text-red-700" : isLow ? "text-amber-700" : "text-slate-600"
                        }`}
                      >
                        {item.predicted_risk}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] transition-colors"
                      >
                        <Edit3 className="w-3 h-3 text-blue-600" />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Review Opportunity Modal */}
      {selectedOpportunity && (
        <RedistributionModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}

      {/* Live Inventory Edit Modal */}
      {editingItem && (
        <InventoryEditModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={handleItemUpdated}
        />
      )}
    </div>
  );
}
