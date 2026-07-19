// Route: componente DECLARATIVO para el router. En vez de escribir en App
// "if (ruta === '/') ...", declaramos <Route path="/" component={Home} /> y este
// componente decide solo si le toca aparecer o no.
import { useRouter } from '../hooks/useRouter'

// Recibe:
//   - path: la ruta que le corresponde (ej. "/search")
//   - component: el componente a pintar. Lo renombramos a "Component" (mayúscula)
//     porque JSX solo trata como componente a los nombres que empiezan por mayúscula.
export function Route({ path, component: Component }) {
  const { currentPath } = useRouter()

  // Si la ruta actual no coincide con la de este Route, no pintamos nada (null).
  if (currentPath !== path) {
    return null
  }

  // Si coincide, pintamos el componente asociado.
  return <Component />
}
