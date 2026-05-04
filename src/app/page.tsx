import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { getAllProjects } from "@/lib/projects";
import PostCard from "@/components/PostCard";

export default function Home() {
  const posts = getAllPosts().slice(0, 3);
  const projects = getAllProjects().filter((p) => p.featured);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Hero */}
      <section className="mb-20">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Привет, я Никита 👋
        </h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-xl">
          CEO SteppeSolutions. Пишу о жизни, проектах, технологиях и всём, что
          между ними. Добро пожаловать в мой личный уголок.
        </p>
        <div className="mt-6 flex gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            Читать блог
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center px-5 py-2.5 border border-gray-200 text-sm font-medium rounded-xl hover:border-gray-300 transition-colors"
          >
            Проекты
          </Link>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Последние посты</h2>
          <Link
            href="/blog"
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Все посты →
          </Link>
        </div>
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Проекты</h2>
          <Link
            href="/projects"
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Все проекты →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block p-6 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">
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
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
