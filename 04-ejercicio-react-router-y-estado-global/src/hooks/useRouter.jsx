import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router'

/**
 * Mismo hook de antes, pero por dentro ya no manejamos el history a mano.
 *
 * Antes teníamos que: guardar la ruta en un useState, escuchar el evento
 * 'popstate' con un useEffect, y al navegar hacer pushState + disparar un
 * PopStateEvent falso para que React se enterase. Todo eso desaparece.
 *
 * Lo que NO cambia es lo que devolvemos: { currentPath, navigateTo }. Al mantener
 * la misma "forma", los componentes que ya usaban este hook (Home.jsx) siguen
 * funcionando exactamente igual. Eso es respetar la interfaz.
 */
export function useRouter() {
  // useNavigate nos da una función para navegar por código (no con un click).
  const navigate = useNavigate()
  // useLocation nos da la URL actual y, al ser un hook, re-renderiza el
  // componente automáticamente cuando la URL cambia.
  const location = useLocation()

  // ¿Por qué useCallback? Sin él, `navigateTo` sería una función NUEVA en cada
  // render. Search.jsx la usa como dependencia de un useEffect, así que el efecto
  // se dispararía sin parar: navegar → re-render → función nueva → navegar...
  // (React lo detecta y avisa con "Maximum update depth exceeded").
  // useCallback nos devuelve siempre la MISMA función mientras `navigate` no cambie.
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
