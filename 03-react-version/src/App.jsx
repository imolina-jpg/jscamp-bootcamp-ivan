// App es el ROUTER de la SPA. Ahora las rutas se declaran con <Route> (estilo
// declarativo) en vez de con "if (currentPath === ...)". Header y Footer se ven
// siempre; entre ellos, cada <Route> pinta su página solo si la URL coincide.
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Route } from './components/Route'
import { Home } from './pages/Home'
import { Search } from './pages/Search'
import { Contact } from './pages/Contact'
import { NotFound } from './pages/NotFound'
import { useRouter } from './hooks/useRouter'

// Rutas que SÍ existen. Nos sirve para saber cuándo mostrar el 404.
const KNOWN_PATHS = ['/', '/search', '/contact']

export function App() {
  // Ruta actual (para el caso 404: cualquier ruta que no esté en KNOWN_PATHS).
  const { currentPath } = useRouter()
  const isKnownPath = KNOWN_PATHS.includes(currentPath)

  return (
    <>
      <Header />

      {/* Cada Route se muestra solo si su path coincide con la URL. */}
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/contact" component={Contact} />

      {/* 404: si la ruta no es ninguna de las conocidas, mostramos NotFound. */}
      {!isKnownPath && <NotFound />}

      <Footer />
    </>
  )
}
