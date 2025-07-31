import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import StatsProvider from "../components/stats-context";

export const metadata: Metadata = {
  title: "UserMint - Fake User Data Generator",
  description:
    "Generate realistic fake user data for testing and development purposes.",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <StatsProvider>{children}</StatsProvider>
      </body>
    </html>
  );
}
