export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-20">
      <div className="max-w-3xl mx-auto px-4 py-8 flex items-center justify-between text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Никита. Все права защищены.</p>
        <a
          href="https://github.com/SteppeSolutions"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 transition-colors"
        >
          SteppeSolutions →
        </a>
      </div>
    </footer>
  );
}
