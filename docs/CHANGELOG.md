# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed

- [Added] [2026-06-08] Rewrote README.md from HTML-based documentation to clean Markdown format with improved async/await examples and additional record fields
- [Added] [2026-06-08] Updated package.json to point `main` and `types` entry points to `./lib/` subdirectory for proper module resolution
- [Changed] [2026-06-08] Downgraded `@types/node` from `^24.0.4` to `^20.11.0` for broader compatibility
- [Added] [2026-06-08] Added IPQS database file `IPQualityScore-IP-Reputation-Database-IPv4.ipqs` to `.gitignore`
- [Fixed] [2026-06-08] Updated README import example to use npm package name `node_js_ipqs_db_reader` instead of relative path
- [Chore] [2026-06-08] Added `test.js` to `.gitignore`
- [Added] [2026-06-08] Added `example.js` to `.gitignore`
- [Changed] [2026-06-08] Updated Jest ecosystem dependencies from v27 to v29 (`jest`, `ts-jest`, `@types/jest`)
