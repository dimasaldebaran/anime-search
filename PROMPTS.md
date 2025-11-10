# PROMPTS.md

This file documents where and how AI assistance was used.

## Tools Used
- ChatGPT (GPT-5 Thinking)

## Purpose
- Generate initial project scaffold (Vite + TS + Redux).
- Write boilerplate for slices, hooks, and pages.
- Draft README and this PROMPTS.md.

## Prompts
1. Search slice with server pagination 
“Using Redux Toolkit, implement `searchSlice` managing `query`, `page`, `items`, `lastVisiblePage`, `hasNextPage`, `status`, `error`. Add `fetchAnime` thunk that reads query/page from state and calls the Jikan client.”
2. Jikan API  
“Create `api/jikan.ts` with TypeScript types for Jikan v4 search and detail responses. Export `searchAnime(query, page, signal?)` and `getAnimeById(id, signal?)`. Throw descriptive errors on non-2xx.”
3. 

## Human Oversight
- Verified API endpoints and response fields.
- Manually reviewed code organization, naming, and TypeScript types.
- Ensured npm-only scripts and the dev server port are set to 4000.
