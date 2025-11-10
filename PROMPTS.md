# PROMPTS.md

This file documents where and how AI assistance was used.

## Tools Used
- ChatGPT (GPT-5 Thinking)

## Purpose
- Generate initial project scaffold (Vite + TS + Redux).
- Write boilerplate for slices, hooks, and pages.
- Draft README and this PROMPTS.md.

## Prompts (Summary)
1. *"Create a React + TypeScript Vite SPA that meets this spec (Redux, react-router, debounced instant search with cancelation, server-side pagination using Jikan API, no env vars, dev on port 4000). Produce minimal but production-quality code."*
2. *"Add Search and Detail pages, Redux Toolkit slices, and AbortController-based cancellation. Use a simple responsive UI and skeleton loaders."*

## Human Oversight
- Verified API endpoints and response fields.
- Manually reviewed code organization, naming, and TypeScript types.
- Ensured npm-only scripts and the dev server port are set to 4000.
