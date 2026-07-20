import { useAuthStore } from '../store/authStore.js'
import { useFavoritesStore } from '../store/favoritesStore.js'

// Botón aparte para que al marcar un favorito solo se repinte él y no la
// tarjeta entera.
export function FavoriteButton({ jobId }) {
  // Hay que suscribirse al dato, no a la función isFavorite: su referencia
  // nunca cambia y el botón no se enteraría.
  // MATEO: Lo que no se recomienda es hacer `const { isFavorite } = useFavoritesStore()`, pero llamar a isFavorite() dentro si que se puede hacer
  const isFavorite = useFavoritesStore((state) => state.isFavorite(jobId))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const label = isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'

  return (
    <button
      className={isFavorite ? 'button-favorite is-favorite' : 'button-favorite'}
      onClick={() => toggleFavorite(jobId)}
      disabled={!isLoggedIn}
      aria-pressed={isFavorite}
      title={isLoggedIn ? undefined : 'Inicia sesión para guardar favoritos'}
    >
      {isFavorite ? '★' : '☆'} {label}
    </button>
  )
}
