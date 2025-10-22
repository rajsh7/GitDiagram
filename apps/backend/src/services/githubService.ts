import axios from "axios";
import { cache } from "../utils/cache";
import dotenv from "dotenv";
import { RepositoryData } from "../types/github";

dotenv.config();

const GITHUB_API = "https://api.github.com";

export async function fetchRepositoryData(owner: string, repo: string): Promise<RepositoryData> {
  const cacheKey = `${owner}/${repo}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached as RepositoryData;

  // ✅ Include both Authorization & User-Agent (GitHub API requirement)
  const headers: Record<string, string> = {
    "User-Agent": "GitDiagram-App",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // Step 1️⃣ — Fetch repository info
    const repoRes = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}`, { headers });
    const defaultBranch = repoRes.data.default_branch || "main";

    // Step 2️⃣ — Fetch tree structure dynamically based on branch
    const treeRes = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
      { headers }
    );

    // Step 3️⃣ — Build repo data object
    const data: RepositoryData = {
      metadata: {
        name: repoRes.data.name,
        owner: repoRes.data.owner.login,
        description: repoRes.data.description,
        stars: repoRes.data.stargazers_count,
        forks: repoRes.data.forks_count,
        language: repoRes.data.language,
        default_branch: defaultBranch,
      },
      structure: treeRes.data.tree.map((item: any) => ({
        path: item.path,
        type: item.type,
      })),
    };

    cache.set(cacheKey, data);
    return data;
  } catch (error: any) {
    const status = error.response?.status;
    const message =
      status === 404
        ? "Repository not found — check owner/repo spelling"
        : status === 403
        ? "API rate limit exceeded. Add or refresh your GitHub token."
        : error.response?.data?.message || "Failed to fetch repository data";

    // ✅ Add helpful server-side debug log
    console.error("❌ GitHub API Error:", {
      url: error.config?.url,
      status,
      response: error.response?.data,
    });

    throw new Error(message);
  }
}
