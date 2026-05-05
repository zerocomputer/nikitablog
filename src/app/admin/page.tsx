"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [inputToken, setInputToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!inputToken.trim()) {
      setError("Введите GitHub Personal Access Token");
      return;
    }

    setLoading(true);

    try {
      // Quick validation: try fetching repo info
      const res = await fetch("https://api.github.com/repos/zerocomputer/nikitablog", {
        headers: {
          Authorization: `Bearer ${inputToken.trim()}`,
          Accept: "application/vnd.github+json",
        },
      });

      if (!res.ok) {
        setError("Токен недействителен или нет доступа к репозиторию");
        setLoading(false);
        return;
      }

      localStorage.setItem("github_token", inputToken.trim());
      router.push("/admin/posts");
    } catch {
      setError("Ошибка подключения к GitHub API");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f12] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">⚙️ Admin</h1>
          <p className="text-sm text-gray-400">
            Панель управления блогом
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="token"
              className="block text-sm font-medium text-gray-300 mb-1.5"
            >
              GitHub Personal Access Token
            </label>
            <input
              id="token"
              type="password"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="ghp_..."
              className="w-full px-4 py-2.5 bg-[#1a1a22] border border-zinc-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            {error && (
              <p className="mt-1.5 text-sm text-red-400">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Проверка..." : "Войти"}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-gray-600">
          Токен хранится локально в браузере
        </p>
      </div>
    </div>
  );
}
