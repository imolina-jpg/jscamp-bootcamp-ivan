import { useFavoritesStore } from '../store/favoritesStore.js'
import { useAuthStore } from '../store/authStore.js'

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
  //
  // Ojo con un error sutil: si nos suscribiéramos a `state.isFavorite` (la
  // FUNCIÓN), su referencia nunca cambia, así que el componente no se
  // enteraría de que la lista ha cambiado. Hay que suscribirse al DATO.
  const isFavorite = useFavoritesStore((state) => state.favorites.includes(jobId))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  // Los favoritos son de un usuario, así que sin sesión no se pueden marcar.
  // Si no lo bloqueáramos, se acumularían favoritos "fantasma" que además no
  // se ven, porque el contador del header solo aparece con la sesión iniciada.
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const label = isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'

  return (
    <button
      className={isFavorite ? 'button-favorite is-favorite' : 'button-favorite'}
      onClick={() => toggleFavorite(jobId)}
      disabled={!isLoggedIn}
      // aria-pressed le dice a los lectores de pantalla que este botón es un
      // interruptor y en qué posición está.
      aria-pressed={isFavorite}
      title={isLoggedIn ? undefined : 'Inicia sesión para guardar favoritos'}
    >
      {isFavorite ? '★' : '☆'} {label}
    </button>
  )
}
