"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getProjectsFile, saveProjectsFile } from "@/lib/github-admin";
import type { Project } from "@/lib/projects";

function ProjectEditorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const isNew = searchParams.get("new") === "true";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [role, setRole] = useState("");
  const [github, setGithub] = useState("");
  const [status, setStatus] = useState<Project["status"]>("active");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);

  const [projectsSha, setProjectsSha] = useState<string>("");
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) {
      router.push("/admin");
      return;
    }

    loadProjects(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadProjects(token: string) {
    try {
      const data = await getProjectsFile(token);
      if (!data) {
        setError("Не найден projects.json");
        setLoading(false);
        return;
      }

      const projects: Project[] = JSON.parse(data.content);
      setAllProjects(projects);
      setProjectsSha(data.sha);

      if (!isNew && slug) {
        const project = projects.find((p) => p.slug === slug);
        if (project) {
          setTitle(project.title);
          setDescription(project.description);
          setLongDescription(project.longDescription ?? "");
          setRole(project.role ?? "");
          setGithub(project.github ?? "");
          setStatus(project.status);
          setTags(project.tags.join(", "));
          setFeatured(project.featured);
        } else {
          setError("Проект не найден");
        }
      } else if (isNew) {
        setTitle("");
        setDescription("");
        setLongDescription("");
        setRole("");
        setGithub("");
        setStatus("active");
        setTags("");
        setFeatured(false);
      } else {
        setError("Не указан slug проекта");
      }
    } catch (err) {
      setError("Ошибка загрузки проектов");
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

    let updated: Project[];

    if (isNew) {
      updated = [
        ...allProjects,
        {
          slug,
          title: title || slug,
          description,
          longDescription,
          role,
          github: github || undefined,
          status,
          tags: tagsArray,
          featured,
        },
      ];
    } else {
      updated = allProjects.map((p) =>
        p.slug === slug
          ? {
              ...p,
              title: title || slug,
              description,
              longDescription,
              role,
              github: github || undefined,
              status,
              tags: tagsArray,
              featured,
            }
          : p
      );
    }

    try {
      const ok = await saveProjectsFile(token, JSON.stringify(updated, null, 2), projectsSha);
      if (ok) {
        setSuccess("Проект сохранён! Timeweb пересоберёт сайт через несколько минут.");
      } else {
        setError("Ошибка при сохранении. Возможно, конфликт версий.");
      }
    } catch (err) {
      setError("Ошибка при сохранении");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }, [title, description, longDescription, role, github, status, tags, featured, slug, allProjects, projectsSha, isNew]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-400">Загрузка...</div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">
            {isNew ? "Новый проект" : `Редактирование: ${slug}`}
          </h1>
          <a href="/admin/projects" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            ← Назад к списку
          </a>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</div>}
      {success && <div className="mb-4 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl p-3">{success}</div>}

      <div className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Название</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#1a1a22] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Краткое описание</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
            className="w-full px-4 py-2.5 bg-[#1a1a22] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors resize-y" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Полное описание</label>
          <textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} rows={4}
            className="w-full px-4 py-2.5 bg-[#1a1a22] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors resize-y" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Роль</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a22] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">GitHub</label>
            <input type="text" value={github} onChange={(e) => setGithub(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1a1a22] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="zerocomputer/repo" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Статус</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as Project["status"])}
              className="w-full px-4 py-2.5 bg-[#1a1a22] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors">
              <option value="active">Активен</option>
              <option value="beta">Бета</option>
              <option value="archived">Архив</option>
            </select>
          </div>
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-[#1a1a22] text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-300">Featured</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Теги (через запятую)</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#1a1a22] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Next.js, TypeScript, Tailwind" />
        </div>
      </div>
    </div>
  );
}

export default function AdminProjectEditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="text-gray-400">Загрузка...</div></div>}>
      <ProjectEditorForm />
    </Suspense>
  );
}
