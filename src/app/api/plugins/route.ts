export const revalidate = 3600;

type PluginItem = { desc?: string; stars?: number; repo?: string; [key: string]: unknown };
type PluginsMap = Record<string, PluginItem>;
type GithubStats = { stars: number; forks: number; contributors: number };
type ReleaseInfo = { tag_name?: string; name?: string; published_at?: string; body?: string };

const GITHUB_HEADERS: Record<string, string> = {
  "User-Agent": "AstrBot-Landing-Page",
  Accept: "application/vnd.github+json",
};

async function fetchPlugins(): Promise<PluginsMap> {
  try {
    const response = await fetch("https://api.soulter.top/astrbot/plugins", {
      headers: {
        "User-Agent": "AstrBot-Landing-Page",
        Accept: "application/json",
      },
      next: { revalidate },
    });
    if (!response.ok) return {};
    const payload = await response.json();
    return payload && typeof payload === "object" && !Array.isArray(payload) ? (payload as PluginsMap) : {};
  } catch {
    return {};
  }
}

function parseContributors(link: string | null | undefined, fallback: number): number {
  if (!link) return fallback;
  const match = link.match(/page=(\d+)>; rel="last"/);
  if (!match) return fallback;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function fetchGithubStats(): Promise<GithubStats> {
  let stars = 0;
  let forks = 0;
  let contributors = 0;

  try {
    const repoResponse = await fetch("https://api.github.com/repos/AstrBotDevs/AstrBot", {
      headers: GITHUB_HEADERS,
      next: { revalidate },
    });
    if (repoResponse.ok) {
      const repoData: unknown = await repoResponse.json();
      if (repoData && typeof repoData === "object") {
        const repo = repoData as { stargazers_count?: number; forks_count?: number };
        stars = typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0;
        forks = typeof repo.forks_count === "number" ? repo.forks_count : 0;
      }
    }
  } catch {}

  try {
    const contributorsResponse = await fetch("https://api.github.com/repos/AstrBotDevs/AstrBot/contributors?per_page=1&anon=true", {
      headers: GITHUB_HEADERS,
      next: { revalidate },
    });
    if (contributorsResponse.ok) {
      const list: unknown = await contributorsResponse.json();
      const fallback = Array.isArray(list) ? list.length : 0;
      const linkHeader = contributorsResponse.headers.get("link");
      contributors = parseContributors(linkHeader, fallback);
    }
  } catch {}

  return { stars, forks, contributors };
}

async function getLatestRelease(): Promise<ReleaseInfo | null> {
  try {
    const response = await fetch("https://api.github.com/repos/AstrBotDevs/AstrBot/releases/latest", {
      headers: {
        "User-Agent": "AstrBot-Landing-Page",
      },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const [plugins, github, latestRelease] = await Promise.all([
      fetchPlugins(),
      fetchGithubStats(),
      getLatestRelease(),
    ]);
    
    return Response.json({
      plugins,
      github,
      release: latestRelease ? {
        version: latestRelease.tag_name,
        name: latestRelease.name,
        publishedAt: latestRelease.published_at,
        description: latestRelease.body,
      } : null,
    });
  } catch {
    return Response.json({ error: "Failed to load plugins" }, { status: 500 });
  }
}


