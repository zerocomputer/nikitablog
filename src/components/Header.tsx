"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

const navLabels: Record<Locale, { href: string; label: string }[]> = {
  ru: [
    { href: "/ru", label: "Главная" },
    { href: "/ru/blog", label: "Блог" },
    { href: "/ru/projects", label: "Проекты" },
  ],
  en: [
    { href: "/en", label: "Home" },
    { href: "/en/blog", label: "Blog" },
    { href: "/en/projects", label: "Projects" },
  ],
};

const langSwitcher: Record<Locale, { targetLang: Locale; label: string; flag: string }> = {
  ru: { targetLang: "en", label: "EN", flag: "🇬🇧" },
  en: { targetLang: "ru", label: "RU", flag: "🇷🇺" },
};

type Props = {
  locale: Locale;
};

export default function Header({ locale }: Props) {
  const pathname = usePathname();
  const items = navLabels[locale];
  const switchTo = langSwitcher[locale];

  // Switch locale by replacing /xx/ prefix
  const switchHref = pathname.replace(/^\/(ru|en)/, `/${switchTo.targetLang}`);

  return (
    <header className="border-b border-zinc-800 bg-[#0f0f12]/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="text-lg font-bold text-white tracking-tight hover:text-blue-400 transition-colors"
        >
          <span className="text-blue-400">@</span>zerocomputer
        </Link>

        <ul className="flex items-center gap-1">
          {items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-gray-400 hover:text-gray-200 hover:bg-zinc-800"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="ml-2 pl-2 border-l border-zinc-700">
            <Link
              href={switchHref}
              className="px-2 py-1.5 text-xs font-medium text-gray-400 hover:text-blue-400 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              {switchTo.flag} {switchTo.label}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
