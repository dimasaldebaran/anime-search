import { toggleFavorite } from '../store/favoritesSlice'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RootState, AppDispatch } from '../store/store'
import type { Anime } from '../api/jikan'
import { setQuery, setPage, fetchAnime } from '../store/searchSlice'
import { useDebounce } from '../hooks/useDebounce'
import { AnimeCard } from '../components/AnimeCard'

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { query, items, page, lastVisiblePage, hasNextPage, status, error } =
    useSelector((s: RootState) => s.search)

  const favIds = useSelector((s: RootState) => s.favorites.ids)
  const favSet = new Set<number>(favIds)

  const [showSaved, setShowSaved] = useState(false)
  const debounced = useDebounce(query, 250)

  

  type Abortable = { abort?: () => void }                     
  

  useEffect(() => {
    if (!debounced.trim()) return
    const p: any = dispatch(fetchAnime())      
    return () => { p?.abort?.() }              
  }, [debounced, page, dispatch])

  const visibleItems: Anime[] = showSaved
    ? items.filter((a: Anime) => favSet.has(a.mal_id))
    : items

  const empty = debounced.trim().length > 0 && status === 'succeeded' && visibleItems.length === 0

  return (
    <div className="panel">
      <div className="searchRow">
        <input
          autoFocus
          className="input"
          placeholder="Search anime… (instant)"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
        />
        <button className="btn-alt" onClick={() => dispatch(setQuery(''))}>Clear</button>
      </div>

      <div className="toolbar">
        <div className="muted">Page {page} / {Math.max(1, lastVisiblePage)}</div>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <label className="muted" style={{display:'flex',alignItems:'center',gap:8}}>
            <input type="checkbox" checked={showSaved} onChange={(e)=>setShowSaved(e.target.checked)} />
            Show saved only
          </label>
          <div className="pager">
            <button className="btn-alt" disabled={page <= 1} onClick={() => dispatch(setPage(page - 1))}>Prev</button>
            <button className="btn-alt" disabled={!hasNextPage} onClick={() => dispatch(setPage(page + 1))}>Next</button>
          </div>
        </div>
      </div>

      {status === 'loading' && <SkeletonGrid />}
      {error && <p className="muted">Error: {error}</p>}
      {empty && <p className="center muted">No results. Try a different keyword.</p>}

      <div className="grid">
        {visibleItems.map((a: Anime) => (
          <AnimeCard key={a.mal_id} anime={a} />
        ))}
      </div>
    </div>
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
