import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { setQuery, setPage, fetchAnime } from '../store/searchSlice'
import { useDebounce } from '../hooks/useDebounce'

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { query, items, page, lastVisiblePage, hasNextPage, status, error } = useSelector((s:RootState)=>s.search)
  const debounced = useDebounce(query, 250)

  // keep a ref to abort in-flight requests
  const lastPromiseRef = useRef<ReturnType<typeof dispatch> | null>(null)

  useEffect(() => {
    if (!debounced.trim()) return
    // abort previous request when new search kicks in
    lastPromiseRef.current?.abort?.()
    const promise = dispatch(fetchAnime())
    lastPromiseRef.current = promise
    return () => promise.abort?.()
  }, [debounced, page, dispatch])

  const empty = debounced.trim().length > 0 && status === 'succeeded' && items.length === 0

  return (
    <div className="panel">
      <div className="searchRow">
        <input
          autoFocus
          className="input"
          placeholder="Search anime... (instant)"
          value={query}
          onChange={(e)=>dispatch(setQuery(e.target.value))}
        />
        <button className="btn-alt" onClick={()=>dispatch(setQuery(''))}>Clear</button>
      </div>

      <div className="toolbar">
        <div className="muted">Page {page} / {Math.max(1, lastVisiblePage)}</div>
        <div className="pager">
          <button className="btn-alt" disabled={page<=1} onClick={()=>dispatch(setPage(page-1))}>Prev</button>
          <button className="btn-alt" disabled={!hasNextPage} onClick={()=>dispatch(setPage(page+1))}>Next</button>
        </div>
      </div>

      {status === 'loading' && <SkeletonGrid />}
      {error && <p className="muted">Error: {error}</p>}
      {empty && <p className="center muted">No results. Try a different keyword.</p>}

      <div className="grid">
        {items.map(a => (
          <Link key={a.mal_id} to={`/anime/${a.mal_id}`} className="card">
            <img src={a.images?.jpg?.image_url || ''} alt={a.title} />
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8}}>
              <strong style={{fontSize:14, lineHeight:1.2}}>{a.title}</strong>
              {a.score ? <span className="badge">⭐ {a.score.toFixed(1)}</span> : null}
            </div>
            <span className="muted" style={{fontSize:12}}>{a.year || '—'} · {a.episodes ?? '?'} eps</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid">
      {Array.from({length: 12}).map((_,i)=>(
        <div className="card" key={i}>
          <div className="skeleton" style={{width:'100%', aspectRatio:'3/4'}}></div>
          <div className="skeleton" style={{height:16, width:'80%'}}></div>
          <div className="skeleton" style={{height:12, width:'60%'}}></div>
        </div>
      ))}
    </div>
  )
}
