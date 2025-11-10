import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Anime } from '../api/jikan'
import { getAnimeById } from '../api/jikan'

type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

type DetailState = {
  byId: Record<number, Anime>
  status: Status
  error?: string
}

const initialState: DetailState = {
  byId: {},
  status: 'idle'
}

export const fetchAnimeDetail = createAsyncThunk<{ id:number, anime: Anime }, number>(
  'detail/fetch',
  async (id, { signal }) => {
    const res = await getAnimeById(id, signal)
    return { id, anime: res.data }
  }
)

const slice = createSlice({
  name: 'detail',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAnimeDetail.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(fetchAnimeDetail.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.byId[action.payload.id] = action.payload.anime
      })
      .addCase(fetchAnimeDetail.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export default slice.reducer
