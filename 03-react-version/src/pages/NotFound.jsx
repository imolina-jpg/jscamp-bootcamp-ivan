// Página NotFound (404): se muestra cuando la ruta (pathname) no coincide con
// ninguna de las páginas que conocemos (ni "/" ni "/search").
import { Link } from '../components/Link'

export function NotFound() {
  return (
    <main className="not-found">
      <title>404 · Página no encontrada · DevJobs</title>
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe.</p>
      <Link href="/">Volver al inicio</Link>
    </main>
  )
}
