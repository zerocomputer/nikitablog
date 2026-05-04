import fs from "fs";
import path from "path";

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  role?: string;
  github?: string;
  status: "active" | "beta" | "archived";
  tags: string[];
  featured: boolean;
}

const projectsFile = path.join(process.cwd(), "content", "projects", "projects.json");

export function getAllProjects(): Project[] {
  const raw = fs.readFileSync(projectsFile, "utf-8");
  const projects: Project[] = JSON.parse(raw);
  return projects;
}

export function getProjectBySlug(slug: string): Project | null {
  const projects = getAllProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}
