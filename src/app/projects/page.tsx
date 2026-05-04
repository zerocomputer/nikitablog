import { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Проекты",
  description: "Проекты Никиты и SteppeSolutions.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  const statusLabels: Record<string, string> = {
    active: "Активен",
    beta: "Бета",
    archived: "Архив",
  };

  const statusColors: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    beta: "bg-amber-50 text-amber-700 border-amber-200",
    archived: "bg-gray-50 text-gray-500 border-gray-200",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Проекты
      </h1>
      <p className="mt-2 text-gray-600">
        Мои проекты — от идей до продакшна.
      </p>

      {projects.length === 0 ? (
        <p className="mt-12 text-center text-gray-400">Пока нет проектов.</p>
      ) : (
        <div className="mt-8 grid gap-4">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block p-6 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-50 text-gray-500 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                    statusColors[project.status]
                  }`}
                >
                  {statusLabels[project.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
