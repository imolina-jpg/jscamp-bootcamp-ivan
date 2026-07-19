// CUSTOM HOOK: una función que empieza por "use" y que por dentro usa otros hooks
// de React. Sirve para EXTRAER lógica y reutilizarla en varios componentes.
//
// Aquí encapsulamos TODO el router de nuestra SPA (Single Page Application):
// leer la URL, enterarnos cuando cambia y navegar sin recargar la página.
// Cualquier componente que llame a useRouter() recibe lo mismo.
import { useState, useEffect } from 'react'

export function useRouter() {
  // Guardamos en estado la URL COMPLETA: ruta + query string.
  // Ej: "/search?text=react&page=2"
  //
  // ¿Por qué la completa y no solo el pathname? Porque si guardásemos solo
  // "/search", al cambiar de "?page=1" a "?page=2" el estado no cambiaría y
  // React NO repintaría. Con ruta+query, cualquier cambio en la URL provoca render.
  const [location, setLocation] = useState(window.location.pathname + window.location.search)

  useEffect(() => {
    // 'popstate' se dispara cuando el usuario usa atrás/adelante del navegador,
    // y también cuando nosotros lo disparamos a mano desde navigateTo().
    const handleLocationChange = () => {
      setLocation(window.location.pathname + window.location.search)
    }

    window.addEventListener('popstate', handleLocationChange)

    // La función que devuelve useEffect es la LIMPIEZA: se ejecuta cuando el
    // componente se desmonta. Quitamos el listener para no acumular listeners.
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, []) // [] = solo al montar el componente

  // currentPath = solo la ruta, sin la query. Lo usamos para casar rutas ("/search").
  // Lo sacamos del ESTADO (location), no de window, para que sea reactivo.
  const currentPath = location.split('?')[0]

  // searchParams: los parámetros de la URL ya parseados como objeto URLSearchParams.
  // Ej: de "?text=react&page=2" podemos leer searchParams.get('text') → "react".
  const searchParams = new URLSearchParams(location.split('?')[1] || '')

  // navigateTo: cambia la URL SIN recargar la página (history.pushState) y avisa
  // a todos los componentes que usan useRouter disparando un evento 'popstate'.
  // Ese aviso es imprescindible: pushState por sí solo no notifica a nadie.
  const navigateTo = (path) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return { currentPath, searchParams, navigateTo }
}
