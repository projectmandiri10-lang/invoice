import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Head from 'next/head';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MJW Perfect INVOICE Maker Free - Professional Invoice Generator",
  description: "Create professional invoices in seconds with our free invoice generator. No registration required. Support for 40+ languages and 30+ currencies. Download PDF instantly.",
  keywords: ["invoice generator", "invoice maker", "free invoice", "professional invoice", "PDF invoice", "billing", "invoice template"],
  authors: [{ name: "MJW Invoice Team" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title: "MJW Perfect INVOICE Maker Free",
    description: "Create professional invoices in seconds. Free invoice generator with PDF download.",
    url: "https://invoice.mjw.web.id",
    siteName: "MJW Invoice",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MJW Perfect INVOICE Maker Free",
    description: "Create professional invoices in seconds. Free invoice generator with PDF download.",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}