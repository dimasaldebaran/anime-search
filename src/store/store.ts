import { configureStore } from '@reduxjs/toolkit'
import search from './searchSlice'
import detail from './detailSlice'
import favorites, { favoritesInitialState } from './favoritesSlice'
import { loadFavoritesState, saveFavoritesState } from './persistence'

const baseFavorites = loadFavoritesState() ?? favoritesInitialState
const preloadedFavorites = {
  ids: [...baseFavorites.ids],
  entities: { ...baseFavorites.entities }
}

export const store = configureStore({
  reducer: { search, detail, favorites }
  preloadedState: { favorites: preloadedFavorites }
})

if (typeof window !== 'undefined') {
  let prev = store.getState().favorites
  store.subscribe(() => {
    const next = store.getState().favorites
    if (next !== prev) {
      prev = next
      saveFavoritesState(next)
    }
  })
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch