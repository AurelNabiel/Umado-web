import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: { default: "UMADO - Organisasi kreatif Unsada", template: "%s | UMADO" },
  description: "Organization profile UMADO, komunitas kreatif bertema Jepang dengan divisi Kasei, Manga, dan Dance Cover.",
  keywords: ["UMADO", "Organisasi kreatif Unsada", "Manga", "Song Cover", "Dubbing", "Dance Cover"],
  icons: {
    icon: "/assets/UMADO.png",
  },
  openGraph: {
    title: "UMADO - Organisasi kreatif Unsada",
    description: "Organisasi kreatif Unsada",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
