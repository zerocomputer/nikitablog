"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getProfilePage, saveProfilePage } from "@/lib/github-admin";

interface ExperienceItem {
  period: string;
  company: string;
  role: string;
  description: string;
  tags: string[];
}

interface ProfileData {
  name: string;
  nickname: string;
  subtitle: string;
  about: string;
  email: string;
  experience: ExperienceItem[];
}

function parseProfilePage(content: string): ProfileData | null {
  try {
    const nameMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const name = nameMatch ? nameMatch[1].trim() : "Никита Сарычев";
    const subtitleMatch = content.match(/<p className="mt-2 text-xl[^>]*>([^<]+)<\/p>/);
    const subtitle = subtitleMatch ? subtitleMatch[1].trim() : "Full-Stack разработчик";
    const nickname = "@zerocomputer";
    const emailMatch = content.match(/href="mailto:([^"]+)"/);
    const email = emailMatch ? emailMatch[1] : "i@zerocomputer.ru";
    const aboutMatch = content.match(/<p className="text-gray-300 leading-relaxed">\s*([\s\S]*?)\s*<\/p>/);
    const about = aboutMatch ? aboutMatch[1].trim() : "";

    const expMatch = content.match(/const experience = \[([\s\S]*?)\];/);
    const experience: ExperienceItem[] = [];
    if (expMatch) {
      const blocks = expMatch[1].split("},");
      for (const block of blocks) {
        const periodMatch = block.match(/period:\s*"([^"]+)"/);
        const companyMatch = block.match(/company:\s*"([^"]+)"/);
        const roleMatch = block.match(/role:\s*"([^"]+)"/);
        const descMatch = block.match(/description:\s*"([^"]+)"/);
        const tagsMatch = block.match(/tags:\s*\[([\s\S]*?)\]/);
        if (periodMatch && companyMatch) {
          const tags = tagsMatch
            ? tagsMatch[1].split(",").map((t) => t.trim().replace(/^"|"$/g, "")).filter(Boolean)
            : [];
          experience.push({
            period: periodMatch[1],
            company: companyMatch[1],
            role: roleMatch ? roleMatch[1] : "",
            description: descMatch ? descMatch[1] : "",
            tags,
          });
        }
      }
    }
    return { name, nickname, subtitle, about, email, experience };
  } catch {
    return null;
  }
}

const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  { period: "ИЮЛЬ 2023 — НАСТ. ВРЕМЯ", company: "RedPoint: Двор24", role: "Веб-разработчик (Vue/Laravel)", description: 'Продолжил разработку фирменного проекта "Двор24".', tags: ["Vue 3", "JavaScript", "TypeScript"] },
  { period: "СЕН. 2019 — ИЮЛЬ 2023", company: 'ГАПОУ "Оренбургский колледж экономики и информатики"', role: "Веб-разработчик (NestJS, ReactJS, Vue 3)", description: "Занимался командной разработкой проектов.", tags: ["NestJS", "PHP", "React", "Vue 3", "JavaScript", "TypeScript"] },
  { period: "ИЮНЬ 2018 — ОКТ. 2022", company: "Freelance · Workzilla.com", role: "Дизайнер UI/UX, Fullstack разработчик", description: "Реализовывал самые различные проекты.", tags: ["NestJS", "React", "Vue 3", "JavaScript", "TypeScript", "PHP", "Laravel"] },
];

function buildPageContent(name: string, subtitle: string, about: string, email: string, experience: ExperienceItem[]): string {
  const expJson = experience.map(
    (exp) => `    {\n      period: "${exp.period}",\n      company: "${exp.company}",\n      role: "${exp.role}",\n      description: "${exp.description}",\n      tags: [${exp.tags.map((t) => `"${t}"`).join(", ")}],\n    }`
  ).join(",\n");

  return `import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import PostCard from "@/components/PostCard";

export default function Home() {
  const posts = getAllPosts().slice(0, 2);
  const projects = getAllProjects();

  const experience = [
${expJson}
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
          ${name}
        </h1>
        <p className="mt-2 text-xl text-blue-400 font-medium">
          ${subtitle}
        </p>
        <p className="mt-4 text-gray-400 text-lg leading-relaxed max-w-2xl">
          Занимаюсь полным циклом разработки различных веб-приложений, начиная
          от дизайна и реализации клиентской части, заканчивая серверной частью
          и API.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="mailto:${email}"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            ${email}
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
            ${about}
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
              href={"/projects/" + project.slug}
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
          Опыт работы
        </h2>
        <div className="space-y-0">
          {experience.map((exp, idx) => (
            <div key={idx} className="relative pl-8 pb-10 last:pb-0">
              {idx < experience.length - 1 && (
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
                  {exp.tags.map((tag) => (
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
            Последние записи
          </h2>
          <div className="grid gap-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/blog" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Все записи →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
`;
}

export default function AdminProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fileSha, setFileSha] = useState<string>("");

  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState<ExperienceItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) {
      router.push("/admin");
      return;
    }
    loadProfile(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadProfile(token: string) {
    try {
      const data = await getProfilePage(token);
      if (!data) {
        setError("Не удалось загрузить page.tsx");
        setLoading(false);
        return;
      }
      setFileSha(data.sha);
      const parsed = parseProfilePage(data.content);
      if (parsed) {
        setName(parsed.name);
        setSubtitle(parsed.subtitle);
        setAbout(parsed.about);
        setEmail(parsed.email);
        setExperience(parsed.experience.length > 0 ? parsed.experience : DEFAULT_EXPERIENCE);
      } else {
        setExperience(DEFAULT_EXPERIENCE);
      }
    } catch (err) {
      setError("Ошибка загрузки профиля");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const updateExp = useCallback(
    (idx: number, field: keyof ExperienceItem, value: string | string[]) => {
      setExperience((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], [field]: value };
        return next;
      });
    },
    []
  );

  const addExp = useCallback(() => {
    setExperience((prev) => [...prev, { period: "", company: "", role: "", description: "", tags: [] }]);
  }, []);

  const removeExp = useCallback((idx: number) => {
    setExperience((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const handleSave = useCallback(async () => {
    const token = localStorage.getItem("github_token");
    if (!token) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Read latest state directly
      // Note: we need to get current values. Using state from closure might be stale,
      // but since React batches updates and this is called from a click handler,
      // it should have the latest values.
      const newContent = buildPageContent(name, subtitle, about, email, experience);
      const ok = await saveProfilePage(token, newContent, fileSha);
      if (ok) {
        setSuccess("Профиль сохранён! Timeweb пересоберёт сайт через несколько минут.");
      } else {
        setError("Ошибка при сохранении. Возможно, конфликт версий.");
      }
    } catch (err) {
      setError("Ошибка при сохранении");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }, [name, subtitle, about, email, experience, fileSha]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-400">Загрузка...</div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Редактирование профиля</h1>
        <button onClick={handleSave} disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      {error && <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</div>}
      {success && <div className="mb-4 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl p-3">{success}</div>}

      <div className="space-y-6 max-w-2xl">
        <div className="bg-[#1a1a22] border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-semibold text-white">Основная информация</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Имя</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0f0f12] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Подзаголовок</label>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0f0f12] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0f0f12] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">О себе</label>
            <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={4}
              className="w-full px-4 py-2.5 bg-[#0f0f12] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors resize-y" />
          </div>
        </div>

        <div className="bg-[#1a1a22] border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Опыт работы</h2>
            <button onClick={addExp} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
              + Добавить
            </button>
          </div>
          {experience.map((exp, idx) => (
            <div key={idx} className="bg-[#0f0f12] border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">#{(idx + 1).toString().padStart(2, "0")}</span>
                <button onClick={() => removeExp(idx)} className="text-xs text-red-400 hover:text-red-300">Удалить</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Период</label>
                  <input type="text" value={exp.period} onChange={(e) => updateExp(idx, "period", e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a22] border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Компания</label>
                  <input type="text" value={exp.company} onChange={(e) => updateExp(idx, "company", e.target.value)}
                    className="w-full px-3 py-2 bg-[#1a1a22] border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Роль</label>
                <input type="text" value={exp.role} onChange={(e) => updateExp(idx, "role", e.target.value)}
                  className="w-full px-3 py-2 bg-[#1a1a22] border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Описание</label>
                <textarea value={exp.description} onChange={(e) => updateExp(idx, "description", e.target.value)} rows={2}
                  className="w-full px-3 py-2 bg-[#1a1a22] border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-y" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Теги (через запятую)</label>
                <input type="text" value={exp.tags.join(", ")}
                  onChange={(e) => updateExp(idx, "tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                  className="w-full px-3 py-2 bg-[#1a1a22] border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
