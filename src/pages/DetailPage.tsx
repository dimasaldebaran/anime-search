import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store/store'
import { fetchAnimeDetail } from '../store/detailSlice'

export default function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const animeId = Number(id)
  const dispatch = useDispatch<AppDispatch>()
  const detail = useSelector((s:RootState)=>s.detail.byId[animeId])
  const status = useSelector((s:RootState)=>s.detail.status)
  const error = useSelector((s:RootState)=>s.detail.error)

  const lastPromiseRef = useRef<ReturnType<typeof dispatch> | null>(null)

  useEffect(() => {
    if (!animeId) return
    if (detail) return
    lastPromiseRef.current?.abort?.()
    const p = dispatch(fetchAnimeDetail(animeId))
    lastPromiseRef.current = p
    return () => p.abort?.()
  }, [animeId, detail, dispatch])

  if (status === 'loading' && !detail) {
    return <div className="panel"><p className="muted">Loading…</p></div>
  }
  if (error && !detail) {
    return <div className="panel"><p>Error: {error}</p></div>
  }
  if (!detail) return null

  const img = detail.images?.jpg?.large_image_url || detail.images?.jpg?.image_url || ''

  return (
    <div className="panel">
      <Link to=".." className="btn-alt">← Back</Link>
      <div style={{display:'grid', gridTemplateColumns:'200px 1fr', gap:16, marginTop:16}}>
        <img src={img} alt={detail.title} style={{width:200, borderRadius:12, border:'1px solid #1b2340'}} />
        <div>
          <h2 style={{marginTop:0}}>{detail.title}</h2>
          <p className="muted">{detail.year || '—'} · {detail.episodes ?? '?'} eps · Score: {detail.score ?? 'N/A'}</p>
          {detail.synopsis && <p style={{whiteSpace:'pre-line'}}>{detail.synopsis}</p>}
          {detail.trailer?.url && <p><a href={detail.trailer.url} target="_blank" rel="noreferrer">Watch Trailer</a></p>}
        </div>
      </div>
    </div>
  )
}
