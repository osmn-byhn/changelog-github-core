import { describe, it, expect } from 'vitest';
import { getVersionBumpType, parseSemver } from '../src/utils/version';

describe('Version Utils', () => {
    it('should parse semver correctly', () => {
        expect(parseSemver('v1.2.3')).toEqual([1, 2, 3]);
        expect(parseSemver('1.2.3')).toEqual([1, 2, 3]);
        expect(parseSemver('v2.0.0-beta.1')).toEqual([2, 0, 0]);
    });

    it('should get correct bump types', () => {
        expect(getVersionBumpType('v2.0.0', 'v1.9.9')).toBe('major');
        expect(getVersionBumpType('v1.3.0', 'v1.2.9')).toBe('minor');
        expect(getVersionBumpType('v1.2.4', 'v1.2.3')).toBe('patch');

        // Test with missing previous
        expect(getVersionBumpType('v1.0.0', null)).toBe('initial');

        // Test with invalid format
        expect(getVersionBumpType('invalid', 'v1.0.0')).toBe('unknown');
    });
});
