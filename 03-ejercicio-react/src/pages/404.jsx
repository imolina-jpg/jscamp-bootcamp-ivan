// SÉPTIMA PARTE | Página 404.
//
// Se muestra cuando la URL no coincide con ninguna ruta conocida.
// Usamos <Link> (y no <a>) para que volver al inicio no recargue la página.
import { Link } from '../components/Link'

export function NotFoundPage() {
  return (
    <main>
      <section style={{ textAlign: 'center' }}>
        <title>Página no encontrada | DevJobs</title>

        <h1 style={{ fontSize: '5rem', marginBottom: '0' }}>404</h1>
        <h2>Vaya, esta página no existe</h2>
        <p>
          La página que buscas se ha mudado, ha cambiado de nombre o nunca existió. Puedes volver
          al inicio o ir directamente a buscar empleo.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link href="/">Volver al inicio</Link>
          <Link href="/search">Ver todos los empleos</Link>
        </div>
      </section>
    </main>
  )
}
