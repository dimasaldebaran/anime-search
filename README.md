# YoPrint React Coding Project — Anime Search App

Meets the spec: React 18 (hooks), TypeScript, react-router-dom, Redux (RTK), server-side pagination, instant debounced search (250ms), cancels in-flight requests, SPA (Vite), no env vars, dev server on **port 4000**.

## Run locally
```bash
npm install
npm run dev   # Vite dev server on http://localhost:4000
```

> Only two commands are required per the instructions.

## Deploy
Any free host works (Netlify recommended). Build once, then deploy the `dist` folder:
```bash
npm run build
# drag-and-drop /dist to Netlify, or use any static host
```

## Architecture
- **Vite + TS**: fast SPA build.
- **Redux Toolkit** for state: `search` (query/page/results) and `detail` (cache by id).
- **Routing**: `/` (Search), `/anime/:id` (Detail).
- **API**: Jikan v4 `GET /v4/anime?q=&page=&limit=` and `GET /v4/anime/:id/full`.
- **Cancellation**: each fetch is an RTK `createAsyncThunk` using `fetch` with `AbortSignal`. Components call `promise.abort()` when a new keystroke/page triggers another request.
- **Debounce**: `useDebounce(value, 250)` to avoid spamming the API.
- **Pagination**: uses server-provided `last_visible_page`/`has_next_page` and current `page` in Redux.
- **UX**: skeletons, empty-state, basic error messages, responsive cards.

## Notes
- No environment variables needed.
- Strong TypeScript types are used for the pieces of the response we render.
- Race conditions: every new request **aborts** the previous one to avoid flicker & stale updates.
- If you hit Jikan rate limits, the UI shows the error and you can retry.

## Project Structure
```
src/
  api/jikan.ts
  hooks/useDebounce.ts
  pages/{SearchPage,DetailPage}.tsx
  store/{store,searchSlice,detailSlice}.ts
  App.tsx, main.tsx, styles.css
vite.config.ts (port 4000)
```
