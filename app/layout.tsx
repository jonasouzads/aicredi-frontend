import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/client-providers";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "AICredy - Plataforma de Automação com IA",
  description: "Automatize atendimentos e processos com inteligência artificial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn-uicons.flaticon.com/3.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css"
        />
      </head>
      <body className={`${geistSans.className} antialiased`} suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
