"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProjectsFile } from "@/lib/github-admin";
import type { Project } from "@/lib/projects";

export default function AdminProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) {
      router.push("/admin");
      return;
    }

    loadProjects(token);
  }, [router]);

  async function loadProjects(token: string) {
    try {
      const data = await getProjectsFile(token);
      if (!data) {
        setError("Не найден projects.json");
        setLoading(false);
        return;
      }

      setProjects(JSON.parse(data.content));
    } catch (err) {
      setError("Не удалось загрузить проекты");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (projectSlug: string, projectTitle: string) => {
    if (!confirm(`Удалить проект "${projectTitle}"? Это действие нельзя отменить.`)) return;
    const token = localStorage.getItem("github_token");
    if (!token) return;

    try {
      const data = await getProjectsFile(token);
      if (!data) return;
      const updated = JSON.parse(data.content).filter((p: any) => p.slug !== projectSlug);
      const { saveProjectsFile } = await import("@/lib/github-admin");
      const ok = await saveProjectsFile(token, JSON.stringify(updated, null, 2), data.sha);
      if (ok) {
        setProjects(updated);
        alert(`Проект "${projectTitle}" удалён.`);
      } else {
        alert("Ошибка при удалении.");
      }
    } catch (err) {
      alert("Ошибка при удалении");
      console.error(err);
    }
  };

  const handleNewProject = () => {
    const slug = prompt("Введите slug для нового проекта (латиница):");
    if (slug && slug.trim()) {
      router.push(`/admin/projects/edit?slug=${slug.trim()}&new=true`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Проекты</h1>
        <button
          onClick={handleNewProject}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          + Новый проект
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-gray-500 text-center py-16">
          Проектов пока нет
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div className="group block p-5 rounded-2xl bg-[#1a1a22] border border-zinc-800 hover:border-blue-500/50 transition-all">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/admin/projects/edit?slug=${project.slug}`}
                  className="min-w-0 flex-1"
                >
                  <h2 className="font-semibold text-white hover:text-blue-400 transition-colors">
                    {project.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400 line-clamp-1">
                    {project.description}
                  </p>
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                      project.status === "active"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : project.status === "beta"
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                    }`}
                  >
                    {project.status === "active"
                      ? "Активен"
                      : project.status === "beta"
                      ? "Бета"
                      : "Архив"}
                  </span>
                  <button
                    onClick={() => handleDelete(project.slug, project.title)}
                    className="px-2 py-1 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
              {project.tags && project.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-0.5 text-xs font-medium bg-zinc-800 text-gray-400 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
