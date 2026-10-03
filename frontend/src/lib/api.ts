const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface Hospital {
  id: string;
  name: string;
  hindi_name?: string;
  hospital_type: string;
  city: string;
  address: string;
  phone: string;
  emergency_contact: string;
  latitude: number;
  longitude: number;
  is_connected: boolean;
  total_beds: number;
  beds_available: number;
  icu_available: number;
  oxygen_available: boolean;
  blood_bank_available: boolean;
  distance_km?: number;
  last_updated?: string;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialty: string;
  is_available_today: boolean;
  shift_timings: string;
  consultation_fee: number;
}

export interface Department {
  id: string;
  name: string;
  hindi_name?: string;
  is_operational: boolean;
  wait_time_minutes: number;
  description?: string;
  doctors: Doctor[];
}

export interface HospitalDetail extends Hospital {
  departments: Department[];
  doctors: Doctor[];
}

export interface SearchIntent {
  department?: string;
  service?: string;
  urgency?: string;
  city?: string;
  symptoms?: string[];
  confidence?: number;
}

export interface HospitalMatchCard {
  hospital: Hospital;
  matching_department: string;
  matching_doctors: Doctor[];
  department_operational: boolean;
  doctor_available_today: boolean;
  distance_km: number;
  last_updated_minutes_ago: number;
}

export interface SearchResponse {
  query: string;
  intent: SearchIntent;
  hospitals: HospitalMatchCard[];
  total_matches: number;
  ai_interpretation_summary: string;
}

export interface Medicine {
  id: string;
  name: string;
  generic_name: string;
  category: string;
  dosage_form: string;
  unit: string;
}

export interface InventoryItem {
  id: string;
  hospital_id: string;
  medicine_id: string;
  medicine: Medicine;
  current_stock: number;
  daily_consumption: number;
  minimum_threshold: number;
  reorder_quantity: number;
  batch_number: string;
  expiry_date: string;
  last_updated: string;
  days_remaining: number;
  stock_status: "Healthy" | "Low" | "Critical";
  predicted_risk: string;
}

export interface DashboardMetrics {
  total_medicines: number;
  healthy_count: number;
  low_count: number;
  critical_count: number;
  predicted_shortages_count: number;
  redistribution_opportunities_count: number;
  last_updated: string;
}

export interface StockoutAlert {
  medicine_id: string;
  medicine_name: string;
  generic_name: string;
  current_stock: number;
  daily_consumption: number;
  minimum_threshold: number;
  days_remaining: number;
  status: string;
  severity: "Critical" | "Warning" | "Stable";
  ai_explanation: string;
}

export interface RedistributionOpportunity {
  id: string;
  medicine_name: string;
  generic_name: string;
  shortage_hospital_id: string;
  shortage_hospital_name: string;
  shortage_hospital_city: string;
  shortage_stock: number;
  shortage_consumption: number;
  shortage_days_remaining: number;
  surplus_hospital_id: string;
  surplus_hospital_name: string;
  surplus_hospital_city: string;
  surplus_stock: number;
  surplus_consumption: number;
  surplus_days_remaining: number;
  suggested_transfer_quantity: number;
  distance_km: number;
  estimated_transit_hours: number;
  urgency: "High" | "Medium";
  ai_explanation: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  phone?: string;
  hospital_id?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

// Client methods
export async function apiSearch(query: string, userLat?: number, userLon?: number): Promise<SearchResponse> {
  const res = await fetch(`${API_BASE_URL}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      user_latitude: userLat ?? 23.2599,
      user_longitude: userLon ?? 77.4126
    })
  });
  if (!res.ok) throw new Error("Search request failed");
  return res.json();
}

export async function apiGetHospitals(city?: string): Promise<Hospital[]> {
  const url = new URL(`${API_BASE_URL}/api/hospitals`);
  if (city) url.searchParams.set("city", city);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch hospitals");
  return res.json();
}

export async function apiGetHospitalDetail(id: string): Promise<HospitalDetail> {
  const res = await fetch(`${API_BASE_URL}/api/hospitals/${id}`);
  if (!res.ok) throw new Error("Failed to fetch hospital details");
  return res.json();
}

export async function apiGetDashboardMetrics(hospitalId?: string): Promise<DashboardMetrics> {
  const url = new URL(`${API_BASE_URL}/api/insights/metrics`);
  if (hospitalId) url.searchParams.set("hospital_id", hospitalId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
  return res.json();
}

export async function apiGetStockoutAlerts(hospitalId?: string): Promise<StockoutAlert[]> {
  const url = new URL(`${API_BASE_URL}/api/insights/stockout-alerts`);
  if (hospitalId) url.searchParams.set("hospital_id", hospitalId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch stockout alerts");
  return res.json();
}

export async function apiGetRedistribution(hospitalId?: string): Promise<RedistributionOpportunity[]> {
  const url = new URL(`${API_BASE_URL}/api/redistribution`);
  if (hospitalId) url.searchParams.set("hospital_id", hospitalId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch redistribution opportunities");
  return res.json();
}

export async function apiGetInventory(hospitalId?: string, statusFilter?: string, search?: string): Promise<InventoryItem[]> {
  const url = new URL(`${API_BASE_URL}/api/inventory`);
  if (hospitalId) url.searchParams.set("hospital_id", hospitalId);
  if (statusFilter && statusFilter !== "All") url.searchParams.set("status_filter", statusFilter);
  if (search) url.searchParams.set("search", search);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
}

export async function apiUpdateInventory(
  inventoryId: string,
  data: { current_stock?: number; daily_consumption?: number; minimum_threshold?: number },
  token?: string
): Promise<InventoryItem> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/api/inventory/${inventoryId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update inventory item");
  return res.json();
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Authentication failed");
  }
  return res.json();
}
