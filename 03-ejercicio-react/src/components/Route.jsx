// Route: componente DECLARATIVO del router.
//
// En vez de escribir en App.jsx cosas como:
//    if (currentPath === '/') return <Home />
// declaramos:
//    <Route path="/" component={Home} />
// y es el propio Route quien decide si le toca aparecer o no.
import { useRouter } from '../hooks/useRouter'

// Props:
//   - path: la ruta que le corresponde a este Route (ej. "/search")
//   - component: el componente que hay que pintar (la función, sin ejecutar).
export function Route({ path, component }) {
  const { currentPath } = useRouter()

  // Si la URL actual no es la de este Route, no pintamos nada.
  // Devolver null en React significa "no renderices nada aquí".
  if (currentPath !== path) return null

  // Guardamos la prop en una variable con MAYÚSCULA inicial. Es obligatorio:
  // JSX trata los nombres en minúscula como etiquetas HTML, así que <component />
  // intentaría crear una etiqueta llamada "component" en vez de usar el componente.
  const Component = component

  return <Component />
}
