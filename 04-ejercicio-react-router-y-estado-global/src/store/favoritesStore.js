import { create } from 'zustand'

export const useFavoritesStore = create((set, get) => ({
  // Guardamos solo los IDs, no los empleos enteros.
  favorites: [],

  addFavorite: (jobId) =>
    set((state) => ({
      // Si ya estaba, devolvemos el mismo array para no provocar re-renders.
      favorites: state.favorites.includes(jobId)
        ? state.favorites
        : [...state.favorites, jobId],
    })),

  removeFavorite: (jobId) =>
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== jobId),
    })),

  isFavorite: (jobId) => get().favorites.includes(jobId),

  toggleFavorite: (jobId) => {
    const { isFavorite, addFavorite, removeFavorite } = get()

    if (isFavorite(jobId)) removeFavorite(jobId)
    else addFavorite(jobId)
  },

  favoritesCount: () => get().favorites.length,

  // Se llama al cerrar sesión.
  clearFavorites: () => set({ favorites: [] }),
}))
