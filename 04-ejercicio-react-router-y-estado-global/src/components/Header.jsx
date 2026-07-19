import { NavLink } from 'react-router'

import { Link } from './Link.jsx'
import { useAuthStore } from '../store/authStore.js'
import { useFavoritesStore } from '../store/favoritesStore.js'

export function Header() {
  // Antes esto era `const { isLoggedIn, login, logout } = useAuth()`.
  // Ahora usamos selectores, uno por dato: así este componente solo se
  // re-renderiza cuando cambia ESE valor concreto, y no con cualquier
  // cosa que pase en la store.
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)

  const favoritesCount = useFavoritesStore((state) => state.favorites.length)

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
        {/* NavLink es un Link que además SABE si su ruta es la actual.
            Cuando le pasas una función a className, React Router la llama con
            { isActive }, y así podemos darle un estilo distinto al enlace de
            la sección en la que estamos.
            Bonus: NavLink añade solo aria-current="page", que es lo que anuncia
            a los lectores de pantalla "estás aquí". */}
        <NavLink
          to="/"
          /* `end` significa "coincidencia exacta". Sin él, "/" encajaría con
             TODAS las rutas (porque todas empiezan por /) y el enlace de Inicio
             saldría siempre activo. */
          end
          className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
        >
          Empleos
        </NavLink>

        {/* Solo tiene sentido ver tu perfil si has iniciado sesión.
            Aun así la ruta está protegida: esconder el enlace no basta,
            cualquiera podría escribir /profile en la barra de direcciones. */}
        {isLoggedIn && (
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}
          >
            Mi perfil
            {/* Renderizado condicional con &&: si el contador es 0 no se
                pinta nada (0 es "falsy", pero ojo: React SÍ pintaría un 0
                suelto, por eso comparamos con > 0). */}
            {favoritesCount > 0 && (
              <span className="favorites-badge">
                {/* aria-hidden porque el corazón es decorativo: el lector de
                    pantalla ya lee el número y "Mi perfil". */}
                <span aria-hidden="true">♥</span> {favoritesCount}
              </span>
            )}
          </NavLink>
        )}

        {/* El mismo botón hace las dos cosas según el estado de la sesión. */}
        <button className="button-login" onClick={isLoggedIn ? logout : login}>
          {isLoggedIn ? 'Cerrar sesión' : 'Iniciar sesión'}
        </button>
      </nav>
    </header>
  )
}
