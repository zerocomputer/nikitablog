"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Главная" },
  { href: "/projects", label: "Проекты" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-800 bg-[#0f0f12]/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold text-white tracking-tight hover:text-blue-400 transition-colors"
        >
          <span className="text-blue-400">@</span>zerocomputer
        </Link>

        <ul className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
        </ul>
      </nav>
    </header>
  );
}
