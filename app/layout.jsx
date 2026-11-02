import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Anmol Mishra — AI/ML Engineer & Technical Lead",
  description:
    "AI/ML Engineer & Technical Lead with 3+ years shipping citizen AI for Indian governments (21.6K+ chats, ₹7,531 Cr tracked) and scaling SaaS (2 products acquired in 2024, now building Payge).",
  keywords: [
    "Anmol Mishra",
    "AI/ML Engineer",
    "Technical Lead",
    "Next.js",
    "LangChain",
    "CrewAI",
    "RAG",
    "Payge",
    "AI Mitra",
  ],
  authors: [{ name: "Anmol Mishra" }],
  openGraph: {
    title: "Anmol Mishra — AI/ML Engineer & Technical Lead",
    description:
      "AI/ML Engineer & Technical Lead building production AI and SaaS. Two products acquired in 2024.",
    url: "https://anmolmishra.dev",
    siteName: "Anmol Mishra Portfolio",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#21232e] text-[#f1f3f9] selection:bg-[#105bff] selection:text-white">
        {children}
      </body>
    </html>
  );
}
