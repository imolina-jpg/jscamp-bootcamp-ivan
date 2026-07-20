import { create } from 'zustand'

import { useFavoritesStore } from './favoritesStore.js'

// El login es simulado: solo cambia un booleano.
export const useAuthStore = create((set) => ({
  isLoggedIn: false,

  login: () => set({ isLoggedIn: true }),

  logout: () => {
    set({ isLoggedIn: false })

    // Aquí no estamos en un componente, así que no vale el hook: getState().
    useFavoritesStore.getState().clearFavorites()
  },
}))
