import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "SecureVault | Layered Cryptographic File Sharing System",
  description:
    "Secure file sharing system using a two-stage Hill Cipher (modulo 256) and DES (CBC Mode) layered cryptographic pipeline with HMAC-SHA256 integrity authentication.",
  keywords: [
    "Cryptography",
    "Hill Cipher",
    "DES",
    "Data Encryption Standard",
    "Information Security",
    "B.Tech Mini Project",
    "CNS Project",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300">
        <ToastProvider>
          {/* Subtle Ambient Background Mesh */}
          <div className="fixed inset-0 pointer-events-none bg-mesh -z-10" />

          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Viewport */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {children}
          </main>

          {/* Footer with Educational Disclaimers */}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
