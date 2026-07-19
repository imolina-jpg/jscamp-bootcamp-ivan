// SÉPTIMA PARTE | App como ROUTER de la SPA.
//
// App ya no contiene HTML de la página de empleos: ese contenido se mudó a
// src/pages/Search.jsx. Ahora App solo decide QUÉ PÁGINA se ve según la URL.
//
// Header y Footer están FUERA de las rutas porque se ven siempre, en todas las
// páginas. Lo que cambia es únicamente lo de en medio.
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Route } from './components/Route'
import { HomePage } from './pages/Home'
import { SearchPage } from './pages/Search'
import { NotFoundPage } from './pages/404'
import { useRouter } from './hooks/useRouter'

// Lista de rutas que SÍ existen. Nos sirve para detectar cuándo hay que
// mostrar el 404: si la ruta actual no está en esta lista, es que no existe.
const KNOWN_PATHS = ['/', '/search']

function App() {
  const { currentPath } = useRouter()
  const isKnownPath = KNOWN_PATHS.includes(currentPath)

  return (
    <>
      <Header />

      {/* Cada Route se pinta solo si su "path" coincide con la URL actual.
          Es más declarativo que un if/else: se lee como un índice de la app. */}
      <Route path="/" component={HomePage} />
      <Route path="/search" component={SearchPage} />

      {/* 404: no lo ponemos como <Route> porque no tiene una ruta fija;
          aparece con CUALQUIER ruta desconocida. */}
      {!isKnownPath && <NotFoundPage />}

      <Footer />
    </>
  )
}

export default App
