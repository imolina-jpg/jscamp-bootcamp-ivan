import { useFavoritesStore } from '../store/favoritesStore.js'

/**
 * ¿Por qué un componente aparte solo para un botón?
 *
 * Por rendimiento. El componente que se suscribe a la store es el que se
 * re-renderiza cuando esa store cambia. Si JobCard leyera los favoritos,
 * marcar UN favorito re-renderizaría la tarjeta entera (título, descripción,
 * enlace...). Aislándolo aquí, solo se repinta el botón.
 *
 * La regla: lee el estado global lo más ABAJO posible en el árbol.
 */
export function FavoriteButton({ jobId }) {
  // Muy importante: pasamos un SELECTOR (state => state.algo) en vez de
  // desestructurar la store entera con useFavoritesStore().
  // Con un selector, este componente solo se entera de los cambios en ese
  // trozo concreto. Sin él, se re-renderizaría con cualquier cambio.
  const isFavorite = useFavoritesStore((state) => state.favorites.includes(jobId))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  const label = isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'

  return (
    <button
      className={isFavorite ? 'button-favorite is-favorite' : 'button-favorite'}
      onClick={() => toggleFavorite(jobId)}
      // aria-pressed le dice a los lectores de pantalla que este botón es un
      // interruptor y en qué posición está.
      aria-pressed={isFavorite}
    >
      {isFavorite ? '★' : '☆'} {label}
    </button>
  )
}
