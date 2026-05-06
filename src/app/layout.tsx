import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "@zerocomputer | Никита Сарычев",
    template: "%s | Никита Сарычев",
  },
  description:
    "Full-Stack разработчик. Laravel, NestJS, Next.js, Vue, React.",
  metadataBase: new URL("https://zerocomputer.ru"),
  openGraph: {
    title: "@zerocomputer | Никита Сарычев",
    description: "Full-Stack разработчик",
    type: "website",
    locale: "ru_RU",
    siteName: "zerocomputer.ru",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      ru: "/",
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f0f12" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
