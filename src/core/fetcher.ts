import { GithubRelease, ProcessedRelease } from '../types';
import { getVersionBumpType } from '../utils/version';

export class GithubFetcher {
    private owner: string;
    private repo: string;
    private token?: string;

    constructor(owner: string, repo: string, token?: string) {
        this.owner = owner;
        this.repo = repo;
        this.token = token;
    }

    async fetchReleases(page = 1, perPage = 30): Promise<GithubRelease[]> {
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/releases?page=${page}&per_page=${perPage}`;
        const headers: Record<string, string> = {
            'Accept': 'application/vnd.github.v3+json',
        };

        if (this.token) {
            headers['Authorization'] = `token ${this.token}`;
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error(`Failed to fetch GitHub releases: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    async fetchAndProcessReleases(maxNum = 30): Promise<ProcessedRelease[]> {
        let releases: GithubRelease[] = [];
        let page = 1;

        // Fetch until we have enough, or until there are no more
        while (releases.length < maxNum) {
            const perPage = Math.min(100, maxNum - releases.length);
            const batch = await this.fetchReleases(page, perPage);

            if (batch.length === 0) break;

            releases = releases.concat(batch);
            page++;
        }

        // Process them (assuming GitHub returns them sorted by date DESC)
        const processed: ProcessedRelease[] = [];

        for (let i = 0; i < releases.length; i++) {
            const current = releases[i];
            // The previous release in time is the NEXT one in the array (since array is date DESC)
            const previous = i < releases.length - 1 ? releases[i + 1] : null;

            const bumpType = getVersionBumpType(current.tag_name, previous ? previous.tag_name : null);

            processed.push({
                ...current,
                versionGroup: bumpType,
                previousVersion: previous ? previous.tag_name : null
            });
        }

        return processed;
    }
}
