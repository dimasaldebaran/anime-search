
import type { FavoritesState } from './favoritesSlice'

const STORAGE_KEY = 'anime-search:favorites'

export function loadFavoritesState(): FavoritesState | undefined {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return undefined
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as Partial<FavoritesState>
    if (!parsed || typeof parsed !== 'object') return undefined
    if (!Array.isArray(parsed.ids) || typeof parsed.entities !== 'object' || !parsed.entities) {
      return undefined
    }
    const filteredIds = parsed.ids.filter((id): id is number => typeof id === 'number')
    const entities: FavoritesState['entities'] = {}
    for (const id of filteredIds) {
      const entity = (parsed.entities as FavoritesState['entities'])[id]
      if (entity && typeof entity.mal_id === 'number' && typeof entity.title === 'string') {
        entities[id] = {
          mal_id: entity.mal_id,
          title: entity.title,
          coverImage: entity.coverImage,
          year: entity.year ?? null,
          episodes: entity.episodes ?? null,
          score: entity.score ?? null
        }
      }
    }
    return { ids: filteredIds.filter(id => entities[id]), entities }
  } catch (error) {
    console.warn('Failed to load favorites from storage', error)
    return undefined
  }
}

export function saveFavoritesState(state: FavoritesState) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('Failed to persist favorites', error)
  }
}

export { STORAGE_KEY }