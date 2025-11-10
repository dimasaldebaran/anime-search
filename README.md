# YoPrint – Anime Search App (React + TS + Vite)

A single-page application to search anime and view details using the **Jikan API**.  
Built with **React 18 (hooks only)**, **TypeScript**, **Redux Toolkit**, **react-router-dom**, and **Vite**.  
Meets the take-home spec: **instant debounced search with cancellation**, **server-side pagination**, **npm-only**, **no env vars**, dev server on **port 4000**.

---

## Tech Stack
- **React 18** (hooks only)
- **TypeScript**
- **Vite** (SPA)
- **react-router-dom** (routing)
- **Redux Toolkit** (state management)
- **Jikan API v4** (data source, no auth)

---

## Features
- **Instant search** (debounce 250ms) + **cancel in-flight requests** to avoid race conditions.
- **Server-side pagination** (Prev/Next) via Jikan’s `page`, `has_next_page`, `last_visible_page`.
- Two routes: `/` (Search), `/anime/:id` (Detail).
- Detail data cached by ID (fast revisit).
- Skeleton loaders, empty state, and error messages.
- Responsive layout; accessible controls.
- Adding saving features. 


---

## Getting Started
```bash
npm install
npm run dev      # http://localhost:4000
