# @osmn-byhn/changelog-github-core

> The brain of the GitHub Changelog widget.

This package contains the core logic for fetching and processing GitHub releases. It is designed to be lightweight, platform-agnostic, and easily integrable into any JavaScript environment.

## Features

- 🚀 **High Performance:** Minimal footprint, focused on data operations.
- 📦 **Type Safe:** Fully written in TypeScript with comprehensive type definitions.
- 🔄 **Smart Versioning:** Automatically detects version bump types (Major, Minor, Patch).
- 🌐 **Platform Agnostic:** Works in Browser, Node.js, and Edge environments.

## Installation

```bash
npm install @osmn-byhn/changelog-github-core
# or
pnpm add @osmn-byhn/changelog-github-core
# or
yarn add @osmn-byhn/changelog-github-core
```

## Basic Usage

```typescript
import { GithubFetcher } from '@osmn-byhn/changelog-github-core';

const fetcher = new GithubFetcher('facebook', 'react');

// Fetch and automatically process releases with versioning logic
const releases = await fetcher.fetchAndProcessReleases();

console.log(releases[0].tag_name); // e.g., "v18.0.0"
console.log(releases[0].versionGroup); // "major"
```

## API Reference

### `GithubFetcher`

The main class for interacting with the GitHub API.

- `constructor(owner: string, repo: string)`
- `fetchReleases(): Promise<GithubRelease[]>`: Raw fetch from GitHub.
- `fetchAndProcessReleases(): Promise<ProcessedRelease[]>`: Fetches and applies versioning logic.

### Utils

- `getVersionBumpType(current, previous)`: Determines the semantic versioning increment.
- `parseSemver(versionString)`: Parses a version string into semantic parts.

## Related Packages

- [@osmn-byhn/changelog-github-client](https://github.com/osmn-byhn/changelog-github-client): The official UI implementation for this core.

## License

MIT © [osmn-byhn](https://github.com/osmn-byhn)
