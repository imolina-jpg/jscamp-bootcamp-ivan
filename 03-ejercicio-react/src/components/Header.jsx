// PRIMERA PARTE | Componetización.
//
// Header: la cabecera de la página. Es un componente "tonto" (presentacional):
// no recibe props ni tiene lógica, siempre pinta lo mismo.
//
// Usamos "export function" (export NOMBRADO) en vez de "export default", tal y
// como pide el enunciado. Así al importarlo siempre se llama igual:
//    import { Header } from './components/Header'
import { Link } from './Link'

export function Header() {
  return (
    <header>
      {/* Usamos nuestro <Link> en lugar de <a> para navegar sin recargar (SPA). */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <h1 style={{ color: 'white' }}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          DevJobs
        </h1>
      </Link>

      <nav>
        <Link href="/search">Empleos</Link>
      </nav>
    </header>
  )
}
