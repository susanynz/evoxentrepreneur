import type { Metadata } from "next";
import { Geist_Mono, Orbitron, Rajdhani, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evox Entrepreneur — Connect · Build · Scale",
  description:
    "El copiloto para emprendedores del ecosistema EVOX: valida tu idea con un abogado del diablo constructivo, recibe tu plan de ejecución, identidad visual y posicionamiento, y crece en una comunidad tipo incubadora. Belong to the evolution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${orbitron.variable} ${rajdhani.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
