import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateStaticParams() {
  const projects = getAllProjects();
  return locales.flatMap((lang) =>
    projects.map((project) => ({ lang, slug: project.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  beta: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  archived: "bg-zinc-800 text-gray-500 border-zinc-700",
};

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const dict = await getDictionary(lang as Locale);

  const statusLabels: Record<string, string> = {
    active: dict.projects.statusActive,
    beta: dict.projects.statusBeta,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link
        href={`/${lang}/projects`}
        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-400 transition-colors mb-8"
      >
        {dict.projectsPage.backToProjects}
      </Link>

      <header className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {project.title}
          </h1>
          <span
            className={`shrink-0 inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusColors[project.status]}`}
          >
            {statusLabels[project.status] || project.status}
          </span>
        </div>
        <p className="mt-3 text-lg text-gray-400">{project.description}</p>
        {project.role && (
          <p className="mt-1 text-sm text-blue-400">
            {lang === "en" ? "Role: " : "Роль: "}{project.role}
          </p>
        )}
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
      </header>

      {project.longDescription && (
        <div className="mb-8 p-6 rounded-2xl bg-[#1a1a22] border border-zinc-800">
          <p className="text-gray-300 leading-relaxed">{project.longDescription}</p>
        </div>
      )}

      <div className="flex gap-3">
        <a
          href={`https://github.com/zerocomputer/${project.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          GitHub →
        </a>
      </div>
    </div>
  );
}
