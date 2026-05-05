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
            <Link
              key={project.slug}
              href={`/admin/projects/edit?slug=${project.slug}`}
              className="group block p-5 rounded-2xl bg-[#1a1a22] border border-zinc-800 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400 line-clamp-1">
                    {project.description}
                  </p>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
