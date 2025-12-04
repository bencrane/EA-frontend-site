import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Email Finder - CSV Upload",
  description: "Upload CSV files to find emails via n8n workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
