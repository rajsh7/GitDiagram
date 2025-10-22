export interface RepoMetadata {
  name: string;
  owner: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string;
  default_branch: string;
}

export interface RepoItem {
  path: string;
  type: "blob" | "tree";
}

export interface RepositoryData {
  metadata: RepoMetadata;
  structure: RepoItem[];
}
