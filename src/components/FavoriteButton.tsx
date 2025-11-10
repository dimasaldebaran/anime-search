import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { toggleFavorite } from '../store/favoritesSlice'

export function FavoriteButton({ id }: { id: number }) {
  const dispatch = useDispatch<AppDispatch>()
  const isFav = useSelector((s: RootState) => s.favorites.ids.includes(id))

  return (
    <button
      type="button"
      className="star"
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      title={isFav ? 'Saved' : 'Save'}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(toggleFavorite(id)) }}
    >
      {isFav ? '★' : '☆'}
    </button>
  )
}
