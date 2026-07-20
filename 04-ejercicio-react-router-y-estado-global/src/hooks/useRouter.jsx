import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router'

// Mantiene la misma interfaz que el hook casero de antes, para no tocar los
// componentes que ya lo usaban.
export function useRouter() {
  const navigate = useNavigate()
  const location = useLocation()

  // Sin useCallback esto era una función nueva en cada render y el useEffect de
  // Search.jsx entraba en bucle infinito.
  const navigateTo = useCallback(
    (path) => {
      navigate(path)
    },
    [navigate]
  )

  return {
    currentPath: location.pathname,
    navigateTo,
  }
}
