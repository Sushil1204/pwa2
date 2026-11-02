import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { OfflineBanner, UpdatePrompt } from "@/components/pwa/OfflineBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fixora — Trusted Home Service Partner",
    template: "%s · Fixora",
  },
  description:
    "Book verified technicians for plumbing, electrical, appliance and home repairs. Transparent pricing, convenient scheduling.",
  applicationName: "Fixora",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fixora",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#e8ebe6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-dvh flex flex-col">
        <AppProviders>
          <OfflineBanner />
          {children}
          <UpdatePrompt />
        </AppProviders>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
