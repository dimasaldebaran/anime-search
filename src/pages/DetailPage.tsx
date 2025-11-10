import { useEffect, useMemo, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store/store'
import { fetchAnimeDetail } from '../store/detailSlice'
import FavoriteButton from '../components/FavoriteButton'
import { createFavoriteSummary, selectIsFavorite, toggleFavorite } from '../store/favoritesSlice'

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const animeId = Number(id)
  const dispatch = useDispatch<AppDispatch>()
  const detail = useSelector((s: RootState) => (animeId ? s.detail.byId[animeId] : undefined))
  const status = useSelector((s: RootState) => s.detail.status)
  const error = useSelector((s: RootState) => s.detail.error)
  const isSaved = useSelector((s: RootState) => selectIsFavorite(s, animeId))

  const lastPromiseRef = useRef<{ abort?: () => void } | null>(null)

  useEffect(() => {
    if (!animeId) return
    if (detail) return
    lastPromiseRef.current?.abort?.()
    const p = dispatch(fetchAnimeDetail(animeId))
    lastPromiseRef.current = p as unknown as { abort?: () => void }
    return () => p.abort?.()
  }, [animeId, detail, dispatch])

  const favoriteSummary = useMemo(() => (detail ? createFavoriteSummary(detail) : undefined), [detail])

  if (status === 'loading' && !detail) {
    return <div className="panel"><p className="muted">Loading…</p></div>
  }
  if (error && !detail) {
    return <div className="panel"><p>Error: {error}</p></div>
  }
  if (!detail) return null

  const img = detail.images?.jpg?.large_image_url || detail.images?.jpg?.image_url || ''

  return (
    <div className="panel detail-panel">
      <div className="detail-header">
        <Link to=".." className="btn-alt">← Back</Link>
        {favoriteSummary && (
          <FavoriteButton
            active={isSaved}
            onClick={() => favoriteSummary && dispatch(toggleFavorite(favoriteSummary))}
            label={isSaved ? 'Remove from favorites' : 'Add to favorites'}
            className="favorite-toggle--outline"
          />
        )}
      </div>
      <div className="detail-body">
        <div className="detail-art">
          <img src={img} alt={detail.title} />
          {isSaved && <span className="badge detail-badge">Saved</span>}
        </div>
        <div className="detail-info">
          <h2>{detail.title}</h2>
          <p className="muted">{detail.year || '—'} · {detail.episodes ?? '?'} eps · Score: {detail.score ?? 'N/A'}</p>
          {detail.synopsis && <p style={{ whiteSpace: 'pre-line' }}>{detail.synopsis}</p>}
          {detail.trailer?.url && <p><a href={detail.trailer.url} target="_blank" rel="noreferrer">Watch Trailer</a></p>}
        </div>
      </div>
    </div>
  )
}
