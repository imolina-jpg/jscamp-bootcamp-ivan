import { create } from 'zustand'

import { useFavoritesStore } from './favoritesStore.js'

/**
 * Store de autenticación.
 *
 * Sustituye al AuthContext que teníamos en src/context/. Hace exactamente lo
 * mismo, pero sin Provider y con menos ceremonia. El login sigue siendo
 * simulado: solo cambiamos un booleano.
 */
export const useAuthStore = create((set) => ({
  isLoggedIn: false,

  login: () => set({ isLoggedIn: true }),

  logout: () => {
    set({ isLoggedIn: false })

    // Una store puede hablar con otra fuera de React usando .getState().
    // Aquí no estamos dentro de un componente, así que NO podemos usar el hook
    // useFavoritesStore(); getState() nos da el estado actual directamente.
    //
    // Sin esta línea, el siguiente usuario que iniciara sesión en este mismo
    // navegador se encontraría los favoritos del anterior.
    useFavoritesStore.getState().clearFavorites()
  },
}))
