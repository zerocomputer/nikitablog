import { Octokit } from "@octokit/rest";

const OWNER = "zerocomputer";
const REPO = "nikitablog";
const BRANCH = "main";

function getOctokit(token: string) {
  return new Octokit({ auth: token });
}

export interface GitHubFile {
  content: string;
  sha: string;
}

/**
 * Get a file from the GitHub repo. Returns null if not found.
 */
export async function getFile(
  token: string,
  path: string
): Promise<GitHubFile | null> {
  const octokit = getOctokit(token);

  try {
    const res = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path,
      ref: BRANCH,
    });

    if ("content" in res.data) {
      return {
        content: Buffer.from(res.data.content, "base64").toString("utf-8"),
        sha: res.data.sha,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Create or update a file in the GitHub repo with a commit message.
 */
export async function saveFile(
  token: string,
  path: string,
  content: string,
  message: string,
  existingSha?: string
): Promise<boolean> {
  const octokit = getOctokit(token);
  const contentEncoded = Buffer.from(content, "utf-8").toString("base64");

  try {
    if (existingSha) {
      await octokit.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo: REPO,
        path,
        message,
        content: contentEncoded,
        sha: existingSha,
        branch: BRANCH,
      });
    } else {
      await octokit.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo: REPO,
        path,
        message,
        content: contentEncoded,
        branch: BRANCH,
      });
    }
    return true;
  } catch (err) {
    console.error("Failed to save file:", err);
    return false;
  }
}

/**
 * List all markdown files in the content/posts directory.
 */
export async function listPosts(token: string) {
  const octokit = getOctokit(token);

  try {
    const res = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: "content/posts",
      ref: BRANCH,
    });

    if (Array.isArray(res.data)) {
      return res.data
        .filter((item) => item.name.endsWith(".md"))
        .map((item) => ({
          name: item.name,
          path: item.path,
          sha: item.sha,
        }));
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Get a post file by slug (without .md).
 */
export async function getPost(token: string, slug: string) {
  return getFile(token, `content/posts/${slug}.md`);
}

/**
 * Save a post file.
 */
export async function savePost(
  token: string,
  slug: string,
  content: string,
  sha?: string
) {
  return saveFile(
    token,
    `content/posts/${slug}.md`,
    content,
    `Update post: ${slug}`,
    sha
  );
}

/**
 * Get projects.json file.
 */
export async function getProjectsFile(token: string) {
  return getFile(token, "content/projects/projects.json");
}

/**
 * Save projects.json file.
 */
export async function saveProjectsFile(
  token: string,
  content: string,
  sha: string
) {
  return saveFile(
    token,
    "content/projects/projects.json",
    content,
    "Update projects.json",
    sha
  );
}

/**
 * Get the main page.tsx (profile data is hardcoded there).
 * We read it via GitHub API.
 */
export async function getProfilePage(token: string) {
  return getFile(token, "src/app/page.tsx");
}

/**
 * Save the main page.tsx.
 */
export async function saveProfilePage(
  token: string,
  content: string,
  sha: string
) {
  return saveFile(
    token,
    "src/app/page.tsx",
    content,
    "Update profile / page.tsx",
    sha
  );
}
