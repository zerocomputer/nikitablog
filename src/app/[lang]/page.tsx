import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import PostCard from "@/components/PostCard";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const l = dict as any;
  const posts = getAllPosts().filter((p) => p.language === lang).slice(0, 2);
  const projects = getAllProjects();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
      {/* Hero */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
            Н
          </div>
          <span className="text-blue-400 font-mono text-sm">@zerocomputer</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          {l.hero.name}
        </h1>
        <p className="mt-2 text-xl text-blue-400 font-medium">
          {l.hero.role}
        </p>
        <p className="mt-4 text-gray-400 text-lg leading-relaxed max-w-2xl">
          {l.hero.bio}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="mailto:zerocomputer@yandex.ru"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            zerocomputer@yandex.ru
          </a>
          <a
            href="https://github.com/zerocomputer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-gray-300 text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors"
          >
            {l.hero.github}
          </a>
        </div>
      </section>

      {/* About */}
      <section className="mb-20">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
          {l.about.title}
        </h2>
        <div className="bg-[#1a1a22] rounded-2xl p-6 sm:p-8 border border-zinc-800">
          <p className="text-gray-300 leading-relaxed">
            {l.about.text}
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="mb-20">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
          {l.projects.title}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/${lang}/projects/${project.slug}`}
              className="group block p-6 rounded-2xl bg-[#1a1a22] border border-zinc-800 hover:border-blue-500/50 hover:bg-[#1f1f2a] transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                  {project.title}
                </h3>
                <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                  {project.status === "active" ? l.projects.statusActive : l.projects.statusBeta}
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                {project.description}
              </p>
              {project.tags && project.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="inline-block px-2 py-0.5 text-xs font-medium bg-zinc-800 text-gray-400 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-20">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
          {l.experience.title}
        </h2>
        <div className="space-y-0">
          {(l.experience.items as any[]).map((exp: any, idx: number) => (
            <div key={idx} className="relative pl-8 pb-10 last:pb-0">
              {idx < l.experience.items.length - 1 && (
                <div className="absolute left-[11px] top-3 bottom-0 w-0.5 bg-zinc-800" />
              )}
              <div className="absolute left-0 top-[5px] w-[22px] h-[22px] rounded-full bg-zinc-800 border-[3px] border-[#0f0f12] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <div>
                <span className="text-xs text-blue-400 font-semibold tracking-wider">
                  {exp.period}
                </span>
                <h3 className="mt-1 text-base font-semibold text-white">{exp.company}</h3>
                <p className="text-sm text-blue-300/80 mt-0.5">{exp.role}</p>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{exp.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {exp.tags.map((tag: string) => (
                    <span key={tag} className="inline-block px-2 py-0.5 text-xs font-medium bg-zinc-800 text-gray-400 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {posts.length > 0 && (
        <section className="mb-20">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
            {l.blog.latest}
          </h2>
          <div className="grid gap-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} lang={lang} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href={`/${lang}/blog`} className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
              {l.blog.allPosts}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
