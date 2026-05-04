import { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Проекты",
  description: "Проекты Никиты Сарычева.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  const statusLabels: Record<string, string> = {
    active: "Активен",
    beta: "Бета",
    archived: "Архив",
  };

  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    beta: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    archived: "bg-zinc-800 text-gray-500 border-zinc-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-white">Проекты</h1>
      <p className="mt-2 text-gray-400">Мои проекты — от идей до продакшна.</p>

      {projects.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">Пока нет проектов.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block p-6 rounded-2xl bg-[#1a1a22] border border-zinc-800 hover:border-blue-500/50 hover:bg-[#1f1f2a] transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                  {project.title}
                </h2>
                <span
                  className={`shrink-0 inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusColors[project.status] || "bg-zinc-800 text-gray-500"}`}
                >
                  {statusLabels[project.status] || project.status}
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {project.description}
              </p>
              {project.tags && project.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
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
