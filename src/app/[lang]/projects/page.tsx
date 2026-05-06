import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.projectsPage.title,
    description: `${
      lang === "en" ? "Projects by Nikita Sarychev" : "Проекты Никиты Сарычева"
    }.`,
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { lang } = await params;
  const projects = getAllProjects();
  const dict = await getDictionary(lang as Locale);

  const statusLabels: Record<string, string> = {
    active: dict.projects.statusActive,
    beta: dict.projects.statusBeta,
  };

  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    beta: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    archived: "bg-zinc-800 text-gray-500 border-zinc-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-white">{dict.projectsPage.title}</h1>
      <p className="mt-2 text-gray-400">{lang === "en" ? "My projects — from ideas to production." : "Мои проекты — от идей до продакшна."}</p>

      {projects.length === 0 ? (
        <p className="mt-12 text-center text-gray-500">{lang === "en" ? "No projects yet." : "Пока нет проектов."}</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/${lang}/projects/${project.slug}`}
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
