import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "School Management System",
  description: "A comprehensive school management system for modern educational institutions. Features include student management, staff administration, course scheduling, and performance tracking.",
  keywords: [
    "education management",
    "school administration",
    "student portal",
    "staff management",
    "course management",
    "academic tracking",
    "attendance system",
    "performance analytics"
  ],
  authors: [{ name: "Hassan" }],
  category: "Education",
  creator: "Hassan",
  publisher: "School Management System",
  applicationName: "School Management System",
  generator: "Next.js",
  manifest: "/manifest.ts",
  abstract: "Advanced school management platform designed to streamline educational administration and enhance learning outcomes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "School Management System",
    description: "Comprehensive school management solution for modern education",
    type: "website",
    images: [{
      url: '/web-app-manifest-512x512.png',
      width: 1200,
      height: 630,
      alt: 'School Management System Dashboard'
    }],
    siteName: 'School Management System',
  },
  twitter: {
    card: "summary_large_image",
    title: "School Management System",
    description: "Comprehensive school management solution for modern education",
    images: ['/web-app-manifest-512x512.png'],
    creator: '@hcissey0', // Optional: your Twitter username
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
