// Data types for GitHub Releases
export interface GithubRelease {
  id: number;
  name: string;
  tag_name: string;
  html_url: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export type VersionBumpType = 'major' | 'minor' | 'patch' | 'initial' | 'unknown';

export interface ProcessedRelease extends GithubRelease {
  versionGroup: VersionBumpType;
  previousVersion: string | null;
}
