import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type FavoriteSummary = {
  mal_id: number
  title: string
  coverImage?: string
  year?: number | null
  episodes?: number | null
  score?: number | null
}

export type FavoritesState = {
  entities: Record<number, FavoriteSummary>
  ids: number[]
}

const initialState: FavoritesState = {
  entities: {},
  ids: []
}

function normalizeSummary(payload: FavoriteSummary): FavoriteSummary {
  return {
    mal_id: payload.mal_id,
    title: payload.title,
    coverImage: payload.coverImage,
    year: payload.year ?? null,
    episodes: payload.episodes ?? null,
    score: payload.score ?? null
  }
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    replaceFavorites: (_state, action: PayloadAction<FavoritesState>) => {
      return {
        entities: { ...action.payload.entities },
        ids: [...action.payload.ids]
      }
    },
    toggleFavorite: (state, action: PayloadAction<FavoriteSummary>) => {
      const id = action.payload.mal_id
      if (state.entities[id]) {
        delete state.entities[id]
        state.ids = state.ids.filter(existingId => existingId !== id)
      } else {
        const summary = normalizeSummary(action.payload)
        state.entities[id] = summary
        state.ids = [id, ...state.ids.filter(existingId => existingId !== id)]
      }
    },
    upsertFavorite: (state, action: PayloadAction<FavoriteSummary>) => {
      const id = action.payload.mal_id
      if (!state.entities[id]) {
        state.ids = [id, ...state.ids]
      }
      state.entities[id] = normalizeSummary(action.payload)
    }
  }
})

export const { replaceFavorites, toggleFavorite, upsertFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer

export const selectFavoritesState = (state: { favorites: FavoritesState }) => state.favorites
export const selectFavoritesList = (state: { favorites: FavoritesState }) =>
  state.favorites.ids.map(id => state.favorites.entities[id]).filter(Boolean) as FavoriteSummary[]
export const selectIsFavorite = (state: { favorites: FavoritesState }, malId: number) =>
  Boolean(state.favorites.entities[malId])

type AnimeLike = {
  mal_id: number
  title: string
  images?: { jpg?: { image_url?: string | null; large_image_url?: string | null } }
  year?: number | null
  episodes?: number | null
  score?: number | null
}

function isFavoriteSummary(value: AnimeLike | FavoriteSummary): value is FavoriteSummary {
  return (
    (value as FavoriteSummary).coverImage !== undefined ||
    Object.prototype.hasOwnProperty.call(value, 'coverImage')
  )
}

export function createFavoriteSummary(source: AnimeLike | FavoriteSummary): FavoriteSummary {
  if (isFavoriteSummary(source)) {
    return normalizeSummary(source)
  }
  const coverImage = source.images?.jpg?.large_image_url || source.images?.jpg?.image_url || undefined
  return normalizeSummary({
    mal_id: source.mal_id,
    title: source.title,
    coverImage,
    year: source.year ?? null,
    episodes: source.episodes ?? null,
    score: source.score ?? null
  })
}

export const favoritesInitialState = initialState