// Header: cabecera fija de la app. No recibe props porque, de momento,
// no cambia según los datos: siempre muestra lo mismo.
// "export function" (named export) en vez de "export default": así el nombre
// que usamos al importar siempre es el mismo en cualquier archivo.

// Usamos nuestro <Link> en vez de <a> para navegar SIN recargar la página (SPA).
import { Link } from './Link'

export function Header() {
  return (
    <header>
      {/* El logo ahora es un enlace a la página de inicio "/". */}
      <Link href="/" className="logo-link">
        <h1>
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

      {/* Navegación entre las páginas del router (sin recargar, gracias a Link). */}
      <nav>
        <Link href="/">Inicio</Link>
        <Link href="/search">Buscar trabajos</Link>
        <Link href="/contact">Contacto</Link>
      </nav>

      <a href="#" className="avatar-link" aria-label="Ir a mi perfil" title="Mi perfil">
        <img src="https://unavatar.io/github/mdo" alt="Avatar del usuario" width="32" height="32" />
      </a>
    </header>
  )
}
