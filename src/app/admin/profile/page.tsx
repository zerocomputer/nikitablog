"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getDictionaryFile, saveDictionaryFile } from "@/lib/github-admin";

interface DictData {
  hero: { name: string; role: string; bio: string };
  about: { title: string; text: string };
  experience: { title: string; items: Array<{ period: string; company: string; role: string; description: string; tags: string[] }> };
  site: { title: string; description: string };
  nav: { home: string; blog: string; projects: string };
  footer: { copyright: string; builtWith: string; sourceCode: string };
}

const DEFAULT_RU: DictData = {
  hero: { name: "Никита Сарычев", role: "Full-Stack разработчик", bio: "Занимаюсь полным циклом разработки." },
  about: { title: "Кратко о себе", text: "Вернемся в 2014 год, первое касание с IT..." },
  experience: { title: "Опыт работы", items: [] },
  site: { title: "@zerocomputer | Никита Сарычев", description: "Full-Stack разработчик." },
  nav: { home: "Главная", blog: "Блог", projects: "Проекты" },
  footer: { copyright: "Никита Сарычев", builtWith: "Разработано на", sourceCode: "Открытый исходный код" },
};

const DEFAULT_EN: DictData = {
  hero: { name: "Nikita Sarychev", role: "Full-Stack Developer", bio: "I handle the full development cycle of web applications." },
  about: { title: "About Me", text: "Let's go back to 2014..." },
  experience: { title: "Experience", items: [] },
  site: { title: "@zerocomputer | Nikita Sarychev", description: "Full-Stack developer." },
  nav: { home: "Home", blog: "Blog", projects: "Projects" },
  footer: { copyright: "Nikita Sarychev", builtWith: "Built with", sourceCode: "Open source code" },
};

export default function AdminProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // RU dictionary
  const [ruDict, setRuDict] = useState<DictData>(DEFAULT_RU);
  const [ruSha, setRuSha] = useState("");

  // EN dictionary
  const [enDict, setEnDict] = useState<DictData>(DEFAULT_EN);
  const [enSha, setEnSha] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("github_token");
    if (!token) {
      router.push("/admin");
      return;
    }
    loadDictionaries(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadDictionaries(token: string) {
    try {
      const [ruFile, enFile] = await Promise.all([
        getDictionaryFile(token, "ru"),
        getDictionaryFile(token, "en"),
      ]);

      if (ruFile) {
        setRuDict(JSON.parse(ruFile.content) as DictData);
        setRuSha(ruFile.sha);
      }
      if (enFile) {
        setEnDict(JSON.parse(enFile.content) as DictData);
        setEnSha(enFile.sha);
      }
    } catch (err) {
      setError("Ошибка загрузки словарей");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const updateRu = useCallback((section: string, field: string, value: any) => {
    setRuDict((prev) => {
      const next = { ...prev };
      (next as any)[section] = { ...(next as any)[section], [field]: value };
      return next;
    });
  }, []);

  const updateEn = useCallback((section: string, field: string, value: any) => {
    setEnDict((prev) => {
      const next = { ...prev };
      (next as any)[section] = { ...(next as any)[section], [field]: value };
      return next;
    });
  }, []);

  const updateExp = useCallback(
    (lang: "ru" | "en", idx: number, field: string, value: any) => {
      const setter = lang === "ru" ? setRuDict : setEnDict;
      setter((prev) => {
        const next = { ...prev };
        const items = [...(next.experience.items as any[])];
        items[idx] = { ...items[idx], [field]: value };
        next.experience = { ...next.experience, items };
        return next;
      });
    },
    []
  );

  const addExp = useCallback((lang: "ru" | "en") => {
    const setter = lang === "ru" ? setRuDict : setEnDict;
    setter((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        items: [...prev.experience.items, { period: "", company: "", role: "", description: "", tags: [] }],
      },
    }));
  }, []);

  const removeExp = useCallback((lang: "ru" | "en", idx: number) => {
    const setter = lang === "ru" ? setRuDict : setEnDict;
    setter((prev) => ({
      ...prev,
      experience: {
        ...prev.experience,
        items: prev.experience.items.filter((_, i) => i !== idx),
      },
    }));
  }, []);

  const handleSave = useCallback(async () => {
    const token = localStorage.getItem("github_token");
    if (!token) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const [ruOk, enOk] = await Promise.all([
        saveDictionaryFile(token, "ru", JSON.stringify(ruDict, null, 2), ruSha),
        saveDictionaryFile(token, "en", JSON.stringify(enDict, null, 2), enSha),
      ]);

      if (ruOk && enOk) {
        setSuccess("Профиль сохранён! Timeweb пересоберёт сайт через несколько минут.");
      } else {
        setError("Ошибка при сохранении одного из словарей.");
      }
    } catch (err) {
      setError("Ошибка при сохранении");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }, [ruDict, enDict, ruSha, enSha]);

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

      {(["ru", "en"] as const).map((lang) => {
        const dict = lang === "ru" ? ruDict : enDict;
        const label = lang === "ru" ? "🇷🇺 Русский" : "🇬🇧 English";
        const update = lang === "ru" ? updateRu : updateEn;

        return (
          <div key={lang} className="mb-8 bg-[#1a1a22] border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-white">{label}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Имя / Name</label>
                <input type="text" value={dict.hero.name} onChange={(e) => update("hero", "name", e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0f0f12] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Роль / Subtitle</label>
                <input type="text" value={dict.hero.role} onChange={(e) => update("hero", "role", e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0f0f12] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">О себе / Bio</label>
              <textarea value={dict.hero.bio} onChange={(e) => update("hero", "bio", e.target.value)} rows={3}
                className="w-full px-4 py-2.5 bg-[#0f0f12] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors resize-y" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Текст «О себе» / About text</label>
              <textarea value={dict.about.text} onChange={(e) => update("about", "text", e.target.value)} rows={4}
                className="w-full px-4 py-2.5 bg-[#0f0f12] border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors resize-y" />
            </div>

            {/* Experience */}
            <div className="pt-4 border-t border-zinc-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-300">Опыт работы / Experience</h3>
                <button onClick={() => addExp(lang)} className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  + Добавить
                </button>
              </div>
              {dict.experience.items.map((exp, idx) => (
                <div key={idx} className="bg-[#0f0f12] border border-zinc-800 rounded-xl p-4 mb-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">#{idx + 1}</span>
                    <button onClick={() => removeExp(lang, idx)} className="text-xs text-red-400 hover:text-red-300">Удалить</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Период</label>
                      <input type="text" value={exp.period} onChange={(e) => updateExp(lang, idx, "period", e.target.value)}
                        className="w-full px-3 py-2 bg-[#1a1a22] border border-zinc-700 rounded-lg text-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Компания</label>
                      <input type="text" value={exp.company} onChange={(e) => updateExp(lang, idx, "company", e.target.value)}
                        className="w-full px-3 py-2 bg-[#1a1a22] border border-zinc-700 rounded-lg text-white text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Роль</label>
                    <input type="text" value={exp.role} onChange={(e) => updateExp(lang, idx, "role", e.target.value)}
                      className="w-full px-3 py-2 bg-[#1a1a22] border border-zinc-700 rounded-lg text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Описание</label>
                    <textarea value={exp.description} onChange={(e) => updateExp(lang, idx, "description", e.target.value)} rows={2}
                      className="w-full px-3 py-2 bg-[#1a1a22] border border-zinc-700 rounded-lg text-white text-sm resize-y" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Теги (через запятую)</label>
                    <input type="text" value={exp.tags.join(", ")}
                      onChange={(e) => updateExp(lang, idx, "tags", e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean))}
                      className="w-full px-3 py-2 bg-[#1a1a22] border border-zinc-700 rounded-lg text-white text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
