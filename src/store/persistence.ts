import type { FavoritesState } from './favoritesSlice'

const KEY = 'favorites:v1'

export function loadFavoritesState(): FavoritesState | undefined {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw)
    const ids: number[] = Array.isArray(parsed?.ids)
      ? parsed.ids.map((n: unknown) => Number(n)).filter(Number.isFinite)
      : []
    return { ids }
  } catch {
    return undefined
  }
}

export function saveFavoritesState(v: FavoritesState) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ids: v.ids }))
  } catch {}
}
