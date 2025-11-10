
## Tools Used
- Codex
- ChatGPT 5 (Thinking)

## Purpose
- Generate initial project scaffold (Vite + TS + Redux).
- Write boilerplate for slices, hooks, and pages.
- Draft README and this PROMPTS.md.

## Prompts
1. **Search slice with server pagination**
“Using Redux Toolkit, implement `searchSlice` managing `query`, `page`, `items`, `lastVisiblePage`, `hasNextPage`, `status`, `error`. Add `fetchAnime` thunk that reads query/page from state and calls the Jikan client.”
2. **Jikan API**  
“Create `api/jikan.ts` with TypeScript types for Jikan v4 search and detail responses. Export `searchAnime(query, page, signal?)` and `getAnimeById(id, signal?)`. Throw descriptive errors on non-2xx.”
3. **Design polish + Saved/Favorites (“star”) feature**
"Refine the UI for an anime search SPA: add an anime-inspired visual theme (gradient background, soft glows, card hover lift, subtle route fade/slide), maintain AA contrast, respect prefers-reduced-motion, and keep layouts responsive.
Implement a Saved/Favorites feature with a ‘star’ control on both the result cards and the detail page. Persist favorites in localStorage (no backend), normalize by mal_id, and expose selectors to check saved state. UX rules: toggle instantly (optimistic), show filled star when saved, provide ARIA labels (Add to favorites / Remove from favorites), keyboard accessible, and never block search. Include a small badge or filter to surface saved items later. Provide minimal tests or notes for reducers and persistence."
4. **Redesign**
"Polish the UI with an anime-inspired theme: starfield backdrop, glass header, gradient brand, card lift/glow with holographic shine, saved ribbon, skeleton shimmer, accessible focus states, reduced-motion support, and a ‘Weeb Mode’ toggle—no new libraries, CSS-only, keep performance high."

## Human Oversight
- Verified API endpoints and response fields.
- Manually reviewed code organization, naming, and TypeScript types.
- Ensured npm-only scripts and the dev server port are set to 4000.
