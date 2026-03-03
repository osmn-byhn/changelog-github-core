import { VersionBumpType } from '../types';

/**
 * Extracts the semver parts from a string (e.g., v1.2.3 or 1.2.3 -> [1, 2, 3])
 */
export function parseSemver(version: string): number[] | null {
    const match = version.match(/v?(\d+)\.(\d+)\.(\d+)(?:-.*)?/i);
    if (!match) return null;
    return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
}

/**
 * Compares current version with previous version to determine bump type.
 * Assumes versions are sorted from NEWEST to OLDEST, so we pass current and previous (which is chronologically older).
 */
export function getVersionBumpType(current: string, previous: string | null): VersionBumpType {
    if (!previous) return 'initial';

    const currSemver = parseSemver(current);
    const prevSemver = parseSemver(previous);

    if (!currSemver || !prevSemver) return 'unknown';

    if (currSemver[0] > prevSemver[0]) return 'major';
    if (currSemver[1] > prevSemver[1]) return 'minor';
    if (currSemver[2] > prevSemver[2]) return 'patch';

    return 'unknown';
}
