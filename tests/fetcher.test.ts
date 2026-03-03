import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GithubFetcher } from '../src/core/fetcher';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('GithubFetcher', () => {
    const owner = 'test-owner';
    const repo = 'test-repo';
    const fetcher = new GithubFetcher(owner, repo);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch releases correctly', async () => {
        const mockReleases = [
            { id: 1, tag_name: 'v1.0.0', name: 'v1.0.0', published_at: '2023-01-01T00:00:00Z', body: 'Test release', html_url: 'http://test.com', draft: false, prerelease: false, author: { login: 'user', avatar_url: '', html_url: '' } }
        ];

        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => mockReleases
        });

        const releases = await fetcher.fetchReleases();
        expect(releases).toEqual(mockReleases);
    });

    it('should throw error if fetch fails', async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 404,
            statusText: 'Not Found'
        });

        await expect(fetcher.fetchReleases()).rejects.toThrow('Failed to fetch GitHub releases: 404 Not Found');
    });

    it('should process releases and assign version groups', async () => {
        const mockReleases = [
            { tag_name: 'v2.0.0', published_at: '2023-02-01T00:00:00Z', body: 'Major' },
            { tag_name: 'v1.1.0', published_at: '2023-01-15T00:00:00Z', body: 'Minor' },
            { tag_name: 'v1.0.0', published_at: '2023-01-01T00:00:00Z', body: 'Initial' }
        ];

        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => mockReleases
        });

        const processed = await fetcher.fetchAndProcessReleases();

        // Newest (2.0.0) compared to previous (1.1.0) -> major
        expect(processed[0].versionGroup).toBe('major');
        // 1.1.0 compared to 1.0.0 -> minor
        expect(processed[1].versionGroup).toBe('minor');
        // Oldest (1.0.0) compared to null -> initial
        // Note: The mock data might cause multiple loops, but checking the last one.
        expect(processed[processed.length - 1].versionGroup).toBe('initial');
    });
});
