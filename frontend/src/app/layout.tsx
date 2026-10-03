import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SETU | Sahi hospital, sahi jagah, sahi waqt par.",
  description: "SETU — Sahi hospital, sahi jagah, sahi waqt par. Find available hospital services and doctors while predicting medicine shortages and inter-hospital redistribution opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
