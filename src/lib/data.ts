import { Mic2, BookOpenText, Music2 } from "lucide-react";

export const divisions = [
  {
    slug: "kasei",
    name: "Kasei",
    japanese: "カセイ",
    description: "Divisi song cover & dubbing yang menjadi ruang bagi anggota untuk berkembang dalam vokal dan voice acting.",
    lead: "Coming Soon",
    icon: Mic2,
    image: "/assets/umachan2.png"
  },
  {
    slug: "manga",
    name: "Manga",
    japanese: "漫画",
    description: "Divisi ilustrasi dan manga untuk komikus, illustrator, serta anggota yang tertarik pada visual gambar.",
    lead: "Coming Soon",
    icon: BookOpenText,
    image: "/assets/umachan.png"
  },
  {
    slug: "dance-cover",
    name: "Dance Cover",
    japanese: "ダンス",
    description: "Divisi performance yang berfokus pada dance cover, latihan koreografi, stage performance, dan kolaborasi untuk event komunitas.",
    lead: "Coming Soon",
    icon: Music2,
    image: "/assets/umachan3.png"
  }
];

export const galleryItems = [
  { title: "Kegiatan Umado", category: "Community", image: "/assets/galery/kegiatan.jpg" },
  { title: "Manga Creative Session", category: "Manga", image: "/assets/galery/kegimanga.jpg" },
  { title: "Kasei Session", category: "Kasei", image: "/assets/galery/kegikasei.jpg" },
  { title: "Merch Selling Session", category: "Community", image: "/assets/galery/dagang.jpeg" },
  { title: "Benkyoukai 2025", category: "Community", image: "/assets/galery/benkyou.jpg" },
  { title: "KLBB Dance Cover Performance", category: "Dance", image: "/assets/galery/dance.jpg" }
];
