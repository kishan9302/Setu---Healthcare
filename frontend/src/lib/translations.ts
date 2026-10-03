export type Language = "en" | "hi";

export interface TranslationStrings {
  brandName: string;
  brandTagline: string;
  demoNetworkBadge: string;
  navHome: string;
  navFindCare: string;
  navHospitals: string;
  navDashboard: string;
  navLogin: string;
  navLogout: string;
  emergencyPill: string;
  emergencyNotice: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  searchPlaceholder: string;
  searchBtn: string;
  quickTagsLabel: string;
  tagOrtho: string;
  tagCardio: string;
  tagEmergency: string;
  tagXray: string;
  tagBloodTest: string;
  tagICU: string;
  valueProp1Title: string;
  valueProp1Desc: string;
  valueProp2Title: string;
  valueProp2Desc: string;
  valueProp3Title: string;
  valueProp3Desc: string;
  aiUnderstandingTitle: string;
  departmentLabel: string;
  serviceLabel: string;
  urgencyLabel: string;
  cityLabel: string;
  available: string;
  limited: string;
  unavailable: string;
  viewHospital: string;
  distanceAway: string;
  updatedMinsAgo: string;
  doctorOnDuty: string;
  onDutyToday: string;
  totalMedicines: string;
  healthyStock: string;
  lowStock: string;
  criticalStock: string;
  predictedShortages: string;
  aiSupplyChainInsights: string;
  aiSupplyChainSubtitle: string;
  stockoutRiskTitle: string;
  viewAnalysis: string;
  redistributionTitle: string;
  reviewOpportunity: string;
  medicineInventory: string;
  medicineName: string;
  stock: string;
  dailyUsage: string;
  status: string;
  predictedRisk: string;
  actions: string;
  editStock: string;
  saveChanges: string;
  cancel: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    brandName: "SETU",
    brandTagline: "Sahi hospital, sahi jagah, sahi waqt par.",
    demoNetworkBadge: "Demo Network • Simulated Hospital Data",
    navHome: "Home",
    navFindCare: "Find Healthcare",
    navHospitals: "Hospitals",
    navDashboard: "Admin Console",
    navLogin: "Hospital Login",
    navLogout: "Sign Out",
    emergencyPill: "🚨 Emergency 24x7: Call 108",
    emergencyNotice: "Need urgent trauma attention? Contact emergency desk at 108 or view connected emergency centers.",
    heroTitle: "Find the right healthcare resource, when you need it.",
    heroSubtitle: "Sahi hospital, sahi jagah, sahi waqt par.",
    heroDescription: "Search connected hospitals across Bhopal, Indore, and regional network for verified available healthcare services, on-duty doctors, and critical resources.",
    searchPlaceholder: "What healthcare service do you need? e.g. Mujhe aaj orthopedic doctor chahiye",
    searchBtn: "Find Healthcare",
    quickTagsLabel: "Popular Quick Searches:",
    tagOrtho: "Orthopedic consultation",
    tagCardio: "Cardiologist today",
    tagEmergency: "Emergency care 🚨",
    tagXray: "X-ray & Diagnostics",
    tagBloodTest: "Blood test",
    tagICU: "ICU Bed Availability",
    valueProp1Title: "Real-time Availability",
    valueProp1Desc: "Verified doctors on-duty and operational departments with live synchronization timestamps.",
    valueProp2Title: "AI Understanding",
    valueProp2Desc: "Describe symptoms naturally in English or Hindi; Groq AI extracts clinical intent without jargon.",
    valueProp3Title: "Supply Chain Resilience",
    valueProp3Desc: "Hospitals predict medicine stockouts and identify inter-hospital rebalancing opportunities before shortages occur.",
    aiUnderstandingTitle: "AI Clinical Understanding",
    departmentLabel: "Department",
    serviceLabel: "Service",
    urgencyLabel: "Urgency",
    cityLabel: "City",
    available: "Available",
    limited: "Limited",
    unavailable: "Unavailable",
    viewHospital: "View Hospital",
    distanceAway: "km away",
    updatedMinsAgo: "Updated mins ago",
    doctorOnDuty: "Doctor On Duty",
    onDutyToday: "Available Today",
    totalMedicines: "Total Monitored Medicines",
    healthyStock: "Healthy Stock",
    lowStock: "Low Stock Warning",
    criticalStock: "Critical Stock Alert",
    predictedShortages: "Predicted Shortages",
    aiSupplyChainInsights: "AI Supply Chain Insights & Predictive Warnings",
    aiSupplyChainSubtitle: "Identify potential shortages and activate inter-hospital rebalancing before clinical impact.",
    stockoutRiskTitle: "Stockout Risk Warning",
    viewAnalysis: "View Analysis",
    redistributionTitle: "Inter-Hospital Redistribution Opportunity",
    reviewOpportunity: "Review Opportunity",
    medicineInventory: "Medicine Inventory & Consumables Table",
    medicineName: "Medicine Name & Formulation",
    stock: "Current Stock",
    dailyUsage: "Daily Burn",
    status: "Status",
    predictedRisk: "Predicted Risk",
    actions: "Actions",
    editStock: "Update Stock",
    saveChanges: "Save Updates",
    cancel: "Cancel"
  },
  hi: {
    brandName: "SETU (सेतु)",
    brandTagline: "Sahi hospital, sahi jagah, sahi waqt par.",
    demoNetworkBadge: "डेमो नेटवर्क • सिमुलेटेड अस्पताल डेटा",
    navHome: "मुख्य पृष्ठ",
    navFindCare: "स्वास्थ्य सेवा खोजें",
    navHospitals: "अस्पताल सूची",
    navDashboard: "व्यवस्थापक कंसोल",
    navLogin: "अस्पताल लॉगिन",
    navLogout: "लॉग आउट",
    emergencyPill: "🚨 आपातकालीन 24x7: डायल करें 108",
    emergencyNotice: "तत्काल आपातकालीन सहायता के लिए 108 पर संपर्क करें या नजदीकी आपातकालीन केंद्र देखें।",
    heroTitle: "आवश्यकता के समय सही अस्पताल और स्वास्थ्य सेवा खोजें।",
    heroSubtitle: "Sahi hospital, sahi jagah, sahi waqt par.",
    heroDescription: "भोपाल, इंदौर एवं क्षेत्रीय नेटवर्क में सत्यापित उपलब्ध स्वास्थ्य सेवाओं, डॉक्टरों और महत्वपूर्ण संसाधनों की खोज करें।",
    searchPlaceholder: "आपको किस स्वास्थ्य सेवा की आवश्यकता है? जैसे: मुझे आज ऑर्थोपेडिक डॉक्टर चाहिए",
    searchBtn: "स्वास्थ्य सेवा खोजें",
    quickTagsLabel: "त्वरित खोज सुझाव:",
    tagOrtho: "हड्डी रोग विशेषज्ञ (ऑर्थोपेडिक्स)",
    tagCardio: "हृदय रोग विशेषज्ञ (कार्डियोलॉजिस्ट)",
    tagEmergency: "आपातकालीन देखभाल 🚨",
    tagXray: "एक्स-रे एवं जांच",
    tagBloodTest: "रक्त परीक्षण (ब्लड टेस्ट)",
    tagICU: "आईसीयू बेड उपलब्धता",
    valueProp1Title: "वास्तविक समय उपलब्धता",
    valueProp1Desc: "ड्यूटी पर उपलब्ध डॉक्टर एवं चालू विभाग की जानकारी लाइव सिंक समय के साथ।",
    valueProp2Title: "एआई द्वारा भाषा समझ",
    valueProp2Desc: "हिंदी या अंग्रेजी में अपनी आवश्यकता लिखें; ग्रॉक एआई बिना किसी कठिन शब्दावली के सही विभाग पहचानता है।",
    valueProp3Title: "सक्रिय आपूर्ति श्रृंखला",
    valueProp3Desc: "दवा की कमी होने से पहले एआई द्वारा पूर्वानुमान एवं अन्य अस्पतालों से पुनर्वितरण अवसर।",
    aiUnderstandingTitle: "एआई द्वारा विश्लेषित आवश्यकता",
    departmentLabel: "विभाग",
    serviceLabel: "सेवा प्रकार",
    urgencyLabel: "प्राथमिकता",
    cityLabel: "शहर",
    available: "उपलब्ध",
    limited: "सीमित",
    unavailable: "अनुपलब्ध",
    viewHospital: "अस्पताल विवरण देखें",
    distanceAway: "किमी दूर",
    updatedMinsAgo: "मिनट पूर्व अपडेट",
    doctorOnDuty: "ड्यूटी पर डॉक्टर",
    onDutyToday: "आज उपलब्ध",
    totalMedicines: "कुल ट्रैक की गई दवाएं",
    healthyStock: "पर्याप्त स्टॉक",
    lowStock: "कम स्टॉक चेतावनी",
    criticalStock: "गंभीर कमी अलर्ट",
    predictedShortages: "पूर्वानुमानित अभाव",
    aiSupplyChainInsights: "एआई आपूर्ति श्रृंखला पूर्वानुमान एवं चेतावनी",
    aiSupplyChainSubtitle: "कमी होने से पूर्व पहचानें और अस्पतालों के बीच दवा पुनर्वितरण सक्रिय करें।",
    stockoutRiskTitle: "स्टॉकआउट जोखिम चेतावनी",
    viewAnalysis: "विश्लेषण देखें",
    redistributionTitle: "अंतर-अस्पताल पुनर्वितरण अवसर",
    reviewOpportunity: "अवसर की समीक्षा करें",
    medicineInventory: "दवा एवं उपभोग्य सामग्री भंडार सूची",
    medicineName: "दवा का नाम एवं संयोजन",
    stock: "वर्तमान स्टॉक",
    dailyUsage: "दैनिक खपत",
    status: "स्थिति",
    predictedRisk: "पूर्वानुमानित जोखिम",
    actions: "कार्यवाही",
    editStock: "स्टॉक अपडेट करें",
    saveChanges: "सुरक्षित करें",
    cancel: "रद्द करें"
  }
};
