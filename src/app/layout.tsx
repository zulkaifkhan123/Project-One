// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/authProvider";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/components/provider";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Wholesale",
  description: "B2B Wholesale Product Distribution Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="antialiased">
        <QueryProvider>
          <AuthProvider>
            <header className="sticky top-0 z-50 bg-white shadow-sm">
              <Navbar />
            </header>

            <main>
              {children}
              <Footer />
              <Toaster position="bottom-right" reverseOrder={false} />
            </main>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
