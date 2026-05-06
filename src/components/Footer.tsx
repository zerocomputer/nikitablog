import type { Locale } from "@/lib/i18n/config";

const footerText: Record<Locale, { builtWith: string; sourceCode: string; copyright: string }> = {
  ru: {
    builtWith: "Разработано на",
    sourceCode: "Открытый исходный код",
    copyright: "Никита Сарычев",
  },
  en: {
    builtWith: "Built with",
    sourceCode: "Open source code",
    copyright: "Nikita Sarychev",
  },
};

type Props = {
  locale: Locale;
};

export default function Footer({ locale }: Props) {
  const t = footerText[locale];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-[#0f0f12]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            {t.builtWith} <span className="text-gray-300">Next.js</span> +{" "}
            <span className="text-gray-300">Tailwind</span>.{" "}
            <a
              href="https://github.com/zerocomputer/nikitablog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {t.sourceCode}
            </a>
          </p>
          <p>© {year} {t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
