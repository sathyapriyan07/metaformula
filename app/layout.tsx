import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ['300', '400', '500', '600', '700', '800', '900'], variable: '--font-inter' });
const notoSans = Noto_Sans({ subsets: ["latin"], weight: ['400', '500', '600', '700', '800', '900'], variable: '--font-noto' });

export const metadata: Metadata = {
  title: "F1 Historical Archive",
  description: "Premium Formula 1 historical database.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoSans.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
