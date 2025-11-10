import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { setQuery, setPage, fetchAnime } from '../store/searchSlice'
import { useDebounce } from '../hooks/useDebounce'
import AnimeCard from '../components/AnimeCard'
import FavoriteButton from '../components/FavoriteButton'
import {
  createFavoriteSummary,
  selectFavoritesList,
  toggleFavorite
} from '../store/favoritesSlice'

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { query, items, page, lastVisiblePage, hasNextPage, status, error } = useSelector((s: RootState) => s.search)
  const favorites = useSelector(selectFavoritesList)
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const debounced = useDebounce(query, 250)

 
   const lastPromiseRef = useRef<{ abort?: () => void } | null>(null)

  useEffect(() => {
    if (!debounced.trim()) return
    
    lastPromiseRef.current?.abort?.()
    const promise = dispatch(fetchAnime())
    lastPromiseRef.current = promise as unknown as { abort?: () => void }
    return () => promise.abort?.()
  }, [debounced, page, dispatch])

    useEffect(() => {
    if (favorites.length === 0 && showSavedOnly) {
      setShowSavedOnly(false)
    }
  }, [favorites.length, showSavedOnly])

  const searchSummaries = useMemo(
    () => items.map(item => createFavoriteSummary(item)),
    [items]
  )

  const favoriteIds = useMemo(() => new Set(favorites.map(item => item.mal_id)), [favorites])

  const displayItems = useMemo(
    () => (showSavedOnly ? favorites : searchSummaries),
    [showSavedOnly, favorites, searchSummaries]
  )

  const empty =
    debounced.trim().length > 0 &&
    status === 'succeeded' &&
    searchSummaries.length === 0
  const savedCount = favorites.length

  return (
    <div className="panel">
      <div className="searchRow">
        <input
          autoFocus
          className="input"
          placeholder="Search anime... (instant)"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
        />
        <button className="btn-alt" onClick={() => dispatch(setQuery(''))}>Clear</button>
      </div>

      <div className="toolbar">
        <div className="muted">
          {showSavedOnly ? 'Saved anime' : `Page ${page} / ${Math.max(1, lastVisiblePage)}`}
        </div>
        <div className="toolbar-actions">
          <button
            className="btn-alt"
            disabled={page <= 1 || showSavedOnly}
            onClick={() => dispatch(setPage(page - 1))}
          >
            Prev
          </button>
          <button
            className="btn-alt"
            disabled={!hasNextPage || showSavedOnly}
            onClick={() => dispatch(setPage(page + 1))}
          >
            Next
          </button>
          <FavoriteSavedFilter
            count={savedCount}
            active={showSavedOnly}
            onToggle={() => setShowSavedOnly(prev => !prev)}
          />
        </div>
      </div>

      {!showSavedOnly && status === 'loading' && <SkeletonGrid />}
      {error && !showSavedOnly && <p className="muted">Error: {error}</p>}
      {empty && !showSavedOnly && <p className="center muted">No results. Try a different keyword.</p>}
      {showSavedOnly && savedCount === 0 && (
        <p className="center muted">You haven't saved any anime yet.</p>
      )}

      <div className="grid">
        {displayItems.map(anime => (
          <AnimeCard
            key={anime.mal_id}
            anime={anime}
            isFavorite={favoriteIds.has(anime.mal_id)}
            onToggle={(summary) => dispatch(toggleFavorite(summary))}
          />
        ))}
      </div>
    </div>
  )
}

function FavoriteSavedFilter({ count, active, onToggle }: { count: number; active: boolean; onToggle: () => void }) {
  const label = active
    ? `Show all results (saved ${count})`
    : `Show saved anime only (saved ${count})`
  return (
    <FavoriteButton
      active={active}
      onClick={onToggle}
      label={label}
      className={`favorite-filter ${active ? 'favorite-filter--active' : ''}`}
    >
      <span aria-hidden="true">★</span>
      <span className="favorite-filter__label">Saved</span>
      <span className="favorite-filter__badge" aria-hidden="true">{count}</span>
    </FavoriteButton>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid">
        {Array.from({ length: 12 }).map((_, i) => (
        <div className="card" key={i}>
          <div className="skeleton" style={{ width: '100%', aspectRatio: '3/4' }}></div>
          <div className="skeleton" style={{ height: 16, width: '80%' }}></div>
          <div className="skeleton" style={{ height: 12, width: '60%' }}></div>
        </div>
      ))}
    </div>
  )
}
