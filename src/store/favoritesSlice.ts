import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type FavoritesState = { ids: number[] }
export const favoritesInitialState: FavoritesState = { ids: [] }

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: favoritesInitialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<number>) {
      const id = action.payload
      state.ids = state.ids.includes(id)
        ? state.ids.filter(x => x !== id)
        : [...state.ids, id]
    },
    setFavorites(state, action: PayloadAction<number[]>) {
      state.ids = Array.from(new Set(action.payload.map(Number).filter(Number.isFinite)))
    }
  }
})

export const { toggleFavorite, setFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer

export const selectFavoriteIds = (s: { favorites: FavoritesState }) => s.favorites.ids
