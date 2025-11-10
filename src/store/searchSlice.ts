import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Anime, SearchResponse } from '../api/jikan'
import { searchAnime } from '../api/jikan'

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

export type SearchState = {
  query: string
  page: number
  items: Anime[]
  lastVisiblePage: number
  hasNextPage: boolean
  status: Status
  error?: string
}

const initialState: SearchState = {
  query: '',
  page: 1,
  items: [],
  lastVisiblePage: 1,
  hasNextPage: false,
  status: 'idle'
}

export const fetchAnime = createAsyncThunk<SearchResponse, void, { state: { search: SearchState } }>(
  'search/fetch',
  async (_, { getState, signal }) => {
    const { query, page } = getState().search
    return searchAnime(query, page, signal)
  }
)

const slice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    reset(state) {
      Object.assign(state, initialState)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAnime.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(fetchAnime.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.data
        state.lastVisiblePage = action.payload.pagination.last_visible_page
        state.hasNextPage = action.payload.pagination.has_next_page
      })
      .addCase(fetchAnime.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error?.message || 'Unknown error'
      })
  }
})

export const { setQuery, setPage, reset } = slice.actions
export default slice.reducer
