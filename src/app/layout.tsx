import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "Umado — Organisasi kreatif Unsada", template: "%s | Umado" },
  description: "Organization profile Umado, komunitas kreatif bertema Jepang dengan divisi Kasei, Manga, dan Dance Cover.",
  keywords: ["Umado", "Organisasi kreatif Unsada", "Manga", "Song Cover", "Dubbing", "Dance Cover"],
  openGraph: {
    title: "Umado — Organisasi kreatif Unsada",
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
      </body>
    </html>
  );
}
