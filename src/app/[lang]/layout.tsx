import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { locales, type Locale } from "@/lib/i18n/config";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const isRu = locale === "ru";

  return {
    title: {
      default: isRu ? "@zerocomputer | Никита Сарычев" : "@zerocomputer | Nikita Sarychev",
      template: isRu ? `%s | Никита Сарычев` : `%s | Nikita Sarychev`,
    },
    description: isRu
      ? "Full-Stack разработчик. Laravel, NestJS, Next.js, Vue, React."
      : "Full-Stack developer. Laravel, NestJS, Next.js, Vue, React.",
    metadataBase: new URL("https://zerocomputer.ru"),
    openGraph: {
      title: isRu ? "@zerocomputer | Никита Сарычев" : "@zerocomputer | Nikita Sarychev",
      description: isRu ? "Full-Stack разработчик" : "Full-Stack developer",
      type: "website",
      locale: isRu ? "ru_RU" : "en_US",
      siteName: "zerocomputer.ru",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      languages: {
        ru: "/ru",
        en: "/en",
      },
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  return (
    <>
      <Header locale={lang as Locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={lang as Locale} />
    </>
  );
}
