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


/* 1. Creamos el objeto fuera del componente, como tenemos una SPA, el objeto se creará una sola vez y no se destruirá aunque naveguemos entre páginas. */
const availablePaths = new Set();

// eslint-disable-next-line
export function Route2({ path, component: Component }) {
  const { currentPath } = useRouter();

  /* 2. Cada vez que se llame el componente, lo guardamos en el objeto */
  if (path) {
    availablePaths.add(path);
  }

  /* 3. Si no hay path y la ruta actual no está registrada, cargamos el componente que le pasemos, en este caso el 404 porque se envía sin path */
  if (!path && !availablePaths.has(currentPath)) return <Component />;

  /* 4. Si la ruta actual no coincide con el path, no renderizamos nada */
  if (currentPath !== path) return null;

  return <Component />;
}