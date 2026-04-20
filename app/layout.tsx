import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/context/context";

export const metadata: Metadata = {
  title: "Transform SQL to ER diagram",
  description: "A simple tool to transform SQL to ER diagram using Mermaid.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className=''>
      <ThemeProvider>
        <body className="min-h-full flex flex-col">{children}</body>
      </ThemeProvider>
    </html>
  );
}