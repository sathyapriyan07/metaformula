import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "F1 Historical Archive CMS",
  description: "Admin-managed Formula 1 historical database.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={"overflow-x-hidden w-full max-w-full"}>
      <body className={`${inter.className} bg-gradient-to-br from-[#020308] via-[#08111f] to-[#020308] text-white min-h-screen antialiased overflow-x-hidden w-full max-w-full`}>
        {children}
      </body>
    </html>
  );
}
