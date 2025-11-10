import { Link } from 'react-router-dom'
import FavoriteButton from './FavoriteButton'
import type { FavoriteSummary } from '../store/favoritesSlice'

export type AnimeCardProps = {
  anime: FavoriteSummary
  isFavorite: boolean
  onToggle: (summary: FavoriteSummary) => void
}

export function AnimeCard({ anime, isFavorite, onToggle }: AnimeCardProps) {
  const yearLabel = anime.year ? `${anime.year}` : '—'
  const episodesLabel = typeof anime.episodes === 'number' ? `${anime.episodes}` : '?'
  const scoreLabel = typeof anime.score === 'number' ? anime.score.toFixed(1) : null
  const detailPath = `/anime/${anime.mal_id}`

  return (
    <article className={`card ${isFavorite ? 'is-saved' : ''}`}>
      <FavoriteButton
        active={isFavorite}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onToggle(anime)
        }}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      />
      <Link to={detailPath} className="card-link">
        <img src={anime.coverImage || ''} alt={anime.title} loading="lazy" />
        <div className="card-body">
          <div className="card-heading">
            <strong>{anime.title}</strong>
            {scoreLabel ? <span className="badge">⭐ {scoreLabel}</span> : null}
          </div>
          <span className="muted">{yearLabel} · {episodesLabel} eps</span>
        </div>
      </Link>
    </article>
  )
}

export default AnimeCard