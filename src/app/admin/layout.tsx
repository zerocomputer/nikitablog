"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ADMIN_NAV = [
  { href: "/admin/posts", label: "Посты", icon: "📝" },
  { href: "/admin/projects", label: "Проекты", icon: "📁" },
  { href: "/admin/profile", label: "Профиль", icon: "👤" },
];

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("github_token");
    if (saved) {
      setToken(saved);
    } else if (pathname !== "/admin") {
      router.push("/admin");
    }
  }, [pathname, router]);

  // Login page without sidebar
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#121218] border-r border-zinc-800 p-4 flex flex-col">
        <div className="mb-6">
          <Link href="/admin" className="text-lg font-bold text-white tracking-tight">
            ⚙️ Admin
          </Link>
          <div className="mt-1 text-xs text-gray-500 truncate">zerocomputer/nikitablog</div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-blue-500/10 text-blue-400" : "text-gray-400 hover:text-gray-200 hover:bg-zinc-800"
                }`}>
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-zinc-800">
          <Link href="/" className="block px-3 py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← На сайт
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("github_token");
              router.push("/admin");
            }}
            className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 transition-colors">
            Выйти
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
    </div>
  );
}
