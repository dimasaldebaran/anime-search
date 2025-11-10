import { Link } from 'react-router-dom'
import type { Anime } from '../api/jikan'
import { FavoriteButton } from './FavoriteButton'

export function AnimeCard({ anime }: { anime: Anime }) {
  return (
    <Link to={`/anime/${anime.mal_id}`} className="card">
      <FavoriteButton id={anime.mal_id} />
      <img src={anime.images?.jpg?.image_url || ''} alt={anime.title} />
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
        <strong style={{fontSize:14,lineHeight:1.2}}>{anime.title}</strong>
        {typeof anime.score === 'number' ? <span className="badge">⭐ {anime.score.toFixed(1)}</span> : null}
      </div>
      <span className="muted" style={{fontSize:12}}>
        {anime.year || '—'} · {anime.episodes ?? '?'} eps
      </span>
    </Link>
  )
}
