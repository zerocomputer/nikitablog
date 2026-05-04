export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#0f0f12]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            Разработано на <span className="text-gray-300">Next.js</span> +{" "}
            <span className="text-gray-300">Tailwind</span>.{" "}
            <a
              href="https://github.com/zerocomputer/nikitablog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Открытый исходный код
            </a>
          </p>
          <p>© {new Date().getFullYear()} Никита Сарычев</p>
        </div>
      </div>
    </footer>
  );
}
