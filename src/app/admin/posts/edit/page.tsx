"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getPost, savePost } from "@/lib/github-admin";
import matter from "gray-matter";

function PostEditorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const isNew = searchParams.get("new") === "true";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [existingSha, setExistingSha] = useState<string | undefined>();
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) {
      router.push("/admin");
      return;
    }

    if (!isNew && slug) {
      loadPost(token);
    } else if (isNew) {
      const today = new Date().toISOString().split("T")[0];
      setTitle("");
      setDate(today);
      setExcerpt("");
      setTags("");
      setContent("## Введите текст...\n\nНачните писать свой пост.");
      setLoading(false);
    } else {
      setLoading(false);
      setError("Не указан slug поста");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, router]);

  async function loadPost(token: string) {
    try {
      const data = await getPost(token, slug);
      if (!data) {
        setError("Пост не найден");
        setLoading(false);
        return;
      }

      const parsed = matter(data.content);
      setTitle(parsed.data.title ?? "");
      setDate(parsed.data.date ?? "");
      setExcerpt(parsed.data.excerpt ?? "");
      setTags((parsed.data.tags ?? []).join(", "));
      setContent(parsed.content.trim());
      setExistingSha(data.sha);
    } catch (err) {
      setError("Ошибка загрузки поста");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = useCallback(async () => {
    const token = localStorage.getItem("github_token");
    if (!token) return;

    if (!slug) {
      setError("Не указан slug");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newContent = matter.stringify(content.trim(), {
      title: title || slug,
      date: date || new Date().toISOString().split("T")[0],
      excerpt: excerpt || "",
      tags: tagsArray,
    });

    try {
      const ok = await savePost(token, slug, newContent, existingSha);
      if (ok) {
        setSuccess("Пост сохранён! Timeweb пересоберёт сайт через несколько минут.");
      } else {
        setError("Ошибка при сохранении. Возможно, конфликт версий.");
      }
    } catch (err) {
      setError("Ошибка при сохранении");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }, [title, date, excerpt, tags, content, slug, existingSha]);

  const renderPreview = useCallback((md: string) => {
    let html = md
      .replace(/^### (.+)$/gm, "<h3 class='text-lg font-semibold text-white mt-4 mb-2'>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2 class='text-xl font-bold text-white mt-5 mb-2'>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1 class='text-2xl font-bold text-white mt-6 mb-3'>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong class='text-white'>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em class='text-gray-300'>$1</em>")
      .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre class='bg-zinc-900 text-gray-200 p-3 rounded-lg overflow-x-auto text-sm my-3'><code>$2</code></pre>")
      .replace(/`(.+?)`/g, "<code class='bg-zinc-800 text-blue-300 px-1 rounded text-sm'>$1</code>")
      .replace(/^- (.+)$/gm, "<li class='text-gray-300 ml-4 list-disc'>$1</li>")
      .replace(/^(\d+)\. (.+)$/gm, "<li class='text-gray-300 ml-4 list-decimal'>$2</li>")
      .replace(/\n\n/g, "</p><p class='text-gray-300 mb-3'>")
      .replace(/\n/g, "<br />");
    html = "<p class='text-gray-300 mb-3'>" + html + "</p>";
    return html;
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-400">Загрузка...</div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">
            {isNew ? "Новый пост" : `Редактирование: ${slug}`}
          </h1>
          <a href="/admin/posts" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            ← Назад к списку
          </a>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPreview(!preview)}
            className="px-3 py-2 text-sm font-medium rounded-xl border border-zinc-700 text-gray-300 hover:bg-zinc-800 transition-colors">
            {preview ? "Редактор" : "Предпросмотр"}
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</div>}
      {success && <div className="mb-4 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl p-3">{success}</div>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Заголовок</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#1a1a22] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Дата</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a22] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Теги (через запятую)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a22] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="react, typescript, nextjs" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Краткое описание</label>
          <input type="text" value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#1a1a22] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Контент (Markdown)</label>
          {preview ? (
            <div className="min-h-[300px] bg-[#1a1a22] border border-zinc-700 rounded-xl p-5 prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: renderPreview(content) }} />
            </div>
          ) : (
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] px-4 py-3 bg-[#1a1a22] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm resize-y" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPostEditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="text-gray-400">Загрузка...</div></div>}>
      <PostEditorForm />
    </Suspense>
  );
}
