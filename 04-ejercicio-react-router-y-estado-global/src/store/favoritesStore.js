import { create } from 'zustand'

/**
 * Store de favoritos con Zustand.
 *
 * Compara esto con el Context que hicimos antes:
 *   - No hay <Provider> que envuelva nada. La store existe y punto.
 *   - No hay componente que guarde el estado: vive fuera de React.
 *   - Los componentes se suscriben SOLO al trozo que les interesa, así que
 *     Zustand puede evitar re-renders que Context provoca sin remedio
 *     (con Context, cualquier cambio re-renderiza a TODOS los consumidores).
 *
 * `create` recibe una función con dos herramientas:
 *   - set → actualiza el estado (como el setter de useState)
 *   - get → lee el estado actual SIN suscribirse (útil dentro de las acciones)
 */
export const useFavoritesStore = create((set, get) => ({
  // Guardamos solo los IDs, no los objetos completos de cada empleo.
  // Así el estado no se queda con datos viejos si la API cambia algo.
  favorites: [],

  addFavorite: (jobId) =>
    set((state) => ({
      // Si ya estaba, devolvemos el MISMO array (no una copia). Zustand compara
      // por referencia, así que al no cambiar nada no re-renderiza a nadie.
      favorites: state.favorites.includes(jobId)
        ? state.favorites
        : [...state.favorites, jobId],
    })),

  removeFavorite: (jobId) =>
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== jobId),
    })),

  // Helper de solo lectura: usa get() porque no queremos suscribirnos,
  // solo consultar el valor en este instante.
  isFavorite: (jobId) => get().favorites.includes(jobId),

  // Las acciones pueden llamarse entre ellas a través de get().
  toggleFavorite: (jobId) => {
    const { isFavorite, addFavorite, removeFavorite } = get()

    if (isFavorite(jobId)) removeFavorite(jobId)
    else addFavorite(jobId)
  },

  favoritesCount: () => get().favorites.length,

  // Se llama al cerrar sesión: los favoritos son de un usuario concreto y no
  // deben quedarse ahí para el siguiente que entre en este navegador.
  clearFavorites: () => set({ favorites: [] }),
}))
