import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import PostCard from "@/components/PostCard";

export default function Home() {
  const posts = getAllPosts().slice(0, 2);
  const projects = getAllProjects();

  const experience = [
    {
      period: "ИЮЛЬ 2023 — НАСТ. ВРЕМЯ",
      company: "RedPoint: Двор24",
      role: "Веб-разработчик (Vue/Laravel)",
      description:
        "Продолжил разработку фирменного проекта \"Двор24\". Это монолитное веб-приложение, написанное на PHP (Laravel), в качестве осн. клиентского фреймворка используется Vue 3.",
      tags: ["Vue 3", "JavaScript", "TypeScript"],
    },
    {
      period: "СЕН. 2019 — ИЮЛЬ 2023",
      company: "ГАПОУ \"Оренбургский колледж экономики и информатики\"",
      role: "Веб-разработчик (NestJS, ReactJS, Vue 3)",
      description:
        "Занимался командной разработкой проектов для Министерства образования по г. Оренбургу и Оренбургской обл. В команде в основном выполнял роль backend-разработчика.",
      tags: ["NestJS", "PHP", "React", "Vue 3", "JavaScript", "TypeScript"],
    },
    {
      period: "ИЮНЬ 2018 — ОКТ. 2022",
      company: "Freelance · Workzilla.com",
      role: "Дизайнер UI/UX, Fullstack разработчик",
      description:
        "Реализовывал самые различные проекты, от простых дизайна сайтов-визиток и их верстки, до веб-приложений, API и дизайна мобильных приложений.",
      tags: ["NestJS", "React", "Vue 3", "JavaScript", "TypeScript", "PHP", "Laravel"],
    },
  ];

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
          Никита Сарычев
        </h1>
        <p className="mt-2 text-xl text-blue-400 font-medium">
          Full-Stack разработчик
        </p>
        <p className="mt-4 text-gray-400 text-lg leading-relaxed max-w-2xl">
          Занимаюсь полным циклом разработки различных веб-приложений, начиная
          от дизайна и реализации клиентской части, заканчивая серверной частью
          и API.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="mailto:i@zerocomputer.ru"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            i@zerocomputer.ru
          </a>
          <a
            href="https://github.com/zerocomputer"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-gray-300 text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors"
          >
            GitHub →
          </a>
        </div>
      </section>

      {/* About */}
      <section className="mb-20">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
          Кратко о себе
        </h2>
        <div className="bg-[#1a1a22] rounded-2xl p-6 sm:p-8 border border-zinc-800">
          <p className="text-gray-300 leading-relaxed">
            Вернемся в 2014 год, первое касание с IT — попытка создания
            простеньких игр при помощи Unity3D. Было интересно создавать что-то
            осязаемое. По сей день этот интерес актуален, однако нынешние
            проекты интегрированы в мою жизнь.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section className="mb-20">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
          Проекты
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block p-6 rounded-2xl bg-[#1a1a22] border border-zinc-800 hover:border-blue-500/50 hover:bg-[#1f1f2a] transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                  {project.title}
                </h3>
                <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                  {project.status === "active" ? "Активен" : "Бета"}
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
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
      </section>

      {/* Experience */}
      <section className="mb-20">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
          Опыт работы
        </h2>
        <div className="space-y-0">
          {experience.map((exp, idx) => (
            <div key={idx} className="relative pl-8 pb-10 last:pb-0">
              {/* Timeline line */}
              {idx < experience.length - 1 && (
                <div className="absolute left-[11px] top-3 bottom-0 w-0.5 bg-zinc-800" />
              )}
              {/* Dot */}
              <div className="absolute left-0 top-[5px] w-[22px] h-[22px] rounded-full bg-zinc-800 border-[3px] border-[#0f0f12] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              {/* Content */}
              <div>
                <span className="text-xs text-blue-400 font-semibold tracking-wider">
                  {exp.period}
                </span>
                <h3 className="mt-1 text-base font-semibold text-white">
                  {exp.company}
                </h3>
                <p className="text-sm text-blue-300/80 mt-0.5">{exp.role}</p>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  {exp.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-0.5 text-xs font-medium bg-zinc-800 text-gray-400 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Blog Posts */}
      {posts.length > 0 && (
        <section className="mb-20">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
            Последние записи
          </h2>
          <div className="grid gap-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Все записи →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
