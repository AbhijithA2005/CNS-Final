import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";
import { PortGuard } from "@/components/PortGuard";

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
        <PortGuard />
        <ToastProvider>
          {/* Subtle Ambient Background Mesh */}
          <div className="fixed inset-0 pointer-events-none bg-mesh -z-10" />

          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Viewport */}
          <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 sm:py-8 lg:py-10">
            {children}
          </main>

          {/* Footer with Educational Disclaimers */}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
