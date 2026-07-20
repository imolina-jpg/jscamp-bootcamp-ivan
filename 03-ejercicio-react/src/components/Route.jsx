// Route: componente DECLARATIVO del router.
//
// En vez de escribir en App.jsx cosas como:
//    if (currentPath === '/') return <Home />
// declaramos:
//    <Route path="/" component={Home} />
// y es el propio Route quien decide si le toca aparecer o no.
import { useRouter } from '../hooks/useRouter'

// MEJORA (feedback de Mateo): antes App.jsx tenía una lista KNOWN_PATHS escrita
// a mano para saber cuándo mostrar el 404. El problema es que había que acordarse
// de añadir cada página nueva en DOS sitios: su <Route> y esa lista.
//
// Ahora las rutas se registran SOLAS aquí. Este Set vive FUERA del componente:
// como esto es una SPA, el módulo se carga una única vez y el Set sobrevive
// aunque naveguemos entre páginas (no se borra en cada render).
const availablePaths = new Set()

// Props:
//   - path: la ruta que le corresponde a este Route (ej. "/search").
//           Si NO se pasa, este Route es el "comodín": el que se pinta cuando
//           ninguna otra ruta coincide (nuestro 404).
//   - component: el componente que hay que pintar (la función, sin ejecutar).
//
export function Route({ path, component }) {
  const { currentPath } = useRouter()

  // Guardamos la prop en una variable con MAYÚSCULA inicial. Es obligatorio:
  // JSX trata los nombres en minúscula como etiquetas HTML, así que <component />
  // intentaría crear una etiqueta llamada "component" en vez de usar el componente.
  const Component = component

  // Cada vez que se renderiza un Route con path, lo apuntamos como ruta conocida.
  // Set ignora los duplicados, así que da igual que esto pase en cada render.
  if (path) availablePaths.add(path)

  // Route comodín (sin path): solo se pinta si la URL actual NO es ninguna de
  // las rutas registradas. Es decir: aquí es donde aparece el 404.
  if (!path) return availablePaths.has(currentPath) ? null : <Component />

  // Route normal: si la URL actual no es la suya, no pinta nada.
  // Devolver null en React significa "no renderices nada aquí".
  if (currentPath !== path) return null

  return <Component />
}
