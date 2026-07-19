import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'

import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'

/**
 * Carga diferida (lazy loading).
 *
 * Con `import` normal, todo el código de todas las páginas acaba en un único
 * archivo JS que el navegador descarga al entrar, aunque solo visites la home.
 *
 * Con lazy() + import() dinámico, Vite corta el bundle en trozos ("code
 * splitting") y cada página se descarga SOLO cuando el usuario navega a ella.
 * Se comprueba en la pestaña Coverage de las DevTools de Chrome.
 *
 * Nota: lazy() carga el `export default` del módulo, no los nombrados.
 */
const HomePage = lazy(() => import('./pages/Home.jsx'))
const SearchPage = lazy(() => import('./pages/Search.jsx'))
const DetailPage = lazy(() => import('./pages/Detail.jsx'))
const LoginPage = lazy(() => import('./pages/Login.jsx'))
const ProfilePage = lazy(() => import('./pages/Profile.jsx'))
const NotFoundPage = lazy(() => import('./pages/404.jsx'))

function App() {
  return (
    <>
      {/* Header y Footer viven FUERA de <Routes>, así que se pintan en todas
          las páginas. Solo lo que está dentro de <Routes> cambia al navegar. */}
      <Header />

      {/* Descargar la página lleva un momento. Suspense muestra el `fallback`
          mientras tanto: sin él, React lanzaría un error al encontrarse un
          componente que todavía no ha terminado de cargar. */}
      <Suspense fallback={<p style={{ textAlign: 'center', padding: '2rem' }}>Cargando página...</p>}>
        {/* <Routes> mira la URL y renderiza la PRIMERA <Route> que encaje.
            Ojo: a diferencia de nuestro Route casero, aquí `element` recibe JSX
            ya creado (<HomePage />), no la referencia al componente (HomePage). */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Ruta DINÁMICA: los dos puntos convierten :id en un hueco que encaja
              con cualquier valor. /job/abc123 y /job/xyz789 usan esta misma ruta,
              y dentro leemos el valor con useParams(). */}
          <Route path="/job/:id" element={<DetailPage />} />

          <Route path="/login" element={<LoginPage />} />

          {/* Ruta protegida: si no hay sesión, ProtectedRoute redirige a /login
              antes de que ProfilePage llegue a renderizarse siquiera. */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* El comodín "*" encaja con cualquier ruta que no hayamos definido
              arriba. Va al final: si lo pusiéramos primero, se comería el resto.
              Nuestro router casero no sabía hacer esto y la 404 nunca se veía. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <Footer />
    </>
  )
}

export default App
