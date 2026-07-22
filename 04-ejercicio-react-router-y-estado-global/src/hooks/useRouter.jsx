import { useLocation, useNavigate } from 'react-router'

// Mantiene la misma interfaz que el hook casero de antes, para no tocar los
// componentes que ya lo usaban.
export function useRouter() {
  const navigate = useNavigate()
  const location = useLocation()

  // Antes envolvias esto en useCallback porque Search.jsx usaba `navigateTo`
  // como dependencia de un useEffect, y sin useCallback la función cambiaba
  // en cada render y disparaba el efecto sin parar. Desde que los filtros
  // pasaron a useSearchParams ya no hace falta, y `navigate` de React Router
  // es estable de todos modos. Así que adiós a `useCallback`
  const navigateTo = (path) => navigate(path)

  return {
    currentPath: location.pathname,
    navigateTo,
  }
}
