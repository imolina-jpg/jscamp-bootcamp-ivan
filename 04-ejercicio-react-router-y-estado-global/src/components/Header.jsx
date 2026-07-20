import { NavLink } from 'react-router'

import { useAuthStore } from '../store/authStore.js'
import { useFavoritesStore } from '../store/favoritesStore.js'
import { Link } from './Link.jsx'

export function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)

  const favoritesCount = useFavoritesStore((state) => state.favorites.length)

  // MATEO: Pasamos los links a un arreglo y lo mapeamos en el `nav`. Más
  // limpio y mantenible que repetir el mismo NavLink tres veces. Filtramos
  // con `filter(Boolean)` para que el link de perfil desaparezca entero
  // cuando no hay sesión.
  const navLinksContent = [
    {
      to: "/",
      content: "Inicio",
      // sin `end`, "/" encaja con todas las rutas e "Inicio" sale siempre activo
      end: true,
    },
    {
      to: "/search",
      content: "Empleos",
    },
    isLoggedIn && {
      to: "/profile",
      content: (
        <>
          Mi perfil
          {/* comparo con > 0 porque si no React pinta un 0 suelto */}
          {favoritesCount > 0 && (
            <span className="favorites-badge">
              <span aria-hidden="true">♥</span> {favoritesCount}
            </span>
          )}
        </>
      ),
    },
  ].filter(Boolean)

  return (
    <header>
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
        {
          navLinksContent.map(({ content, to, ...props }) => <NavLink
            to={to}
            /* sin `end`, "/" encaja con todas las rutas y Inicio sale siempre activo */
            className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
            {...props}
            >
              {content}
            </NavLink>
          )
        }

        <button className="button-login" onClick={isLoggedIn ? logout : login}>
          {isLoggedIn ? 'Cerrar sesión' : 'Iniciar sesión'}
        </button>
      </nav>
    </header>
  )
}
