// CUSTOM HOOK: una función que empieza por "use" y usa otros hooks dentro.
// Sirve para EXTRAER y REUTILIZAR lógica. Aquí metemos toda la lógica del router
// (leer la URL, escuchar cambios, navegar) en un solo sitio, para no repetirla
// en App, Link, etc. Cualquier componente que llame a useRouter() obtiene lo mismo.
import { useState, useEffect } from 'react'

export function useRouter() {
  // Guardamos en estado la URL COMPLETA (ruta + query, ej. "/search?page=2").
  // Antes guardábamos solo el pathname, pero entonces un cambio en la query
  // (?page=2, ?text=react) no provocaba re-render. Guardando ruta+query, React
  // repinta ante CUALQUIER cambio de URL (necesario para paginar/filtrar por URL).
  const [location, setLocation] = useState(
    window.location.pathname + window.location.search
  )

  useEffect(() => {
    // Al oír 'popstate' (atrás/adelante o nuestro navigateTo), leemos la URL nueva.
    const handleLocationChange = () => {
      setLocation(window.location.pathname + window.location.search)
    }
    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  // currentPath = solo la ruta (sin query), para casar rutas en App (=== '/search').
  // Lo sacamos de "location" (el estado) partiendo por "?", así es reactivo.
  const currentPath = location.split('?')[0]

  // navigateTo: cambia la URL sin recargar y avisa a TODOS los componentes que
  // usan useRouter (disparando popstate) para que se sincronicen y repinten.
  const navigateTo = (path) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  // Utilidades extra del router:
  const goBack = () => window.history.back()          // botón "atrás"
  const goForward = () => window.history.forward()    // botón "adelante"
  const isActive = (path) => currentPath === path     // ¿estamos en esta ruta?

  // queryParams: convierte "?q=react&x=1" en un objeto { q: 'react', x: '1' }.
  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search)
    return Object.fromEntries(params.entries())
  }

  return {
    currentPath,
    navigateTo,
    goBack,
    goForward,
    isActive,
    queryParams: getQueryParams(),
  }
}
