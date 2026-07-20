// SÉPTIMA PARTE | App como ROUTER de la SPA.
//
// App ya no contiene HTML de la página de empleos: ese contenido se mudó a
// src/pages/Search.jsx. Ahora App solo decide QUÉ PÁGINA se ve según la URL.
//
// Header y Footer están FUERA de las rutas porque se ven siempre, en todas las
// páginas. Lo que cambia es únicamente lo de en medio.
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Route } from './components/Route'
import { NotFoundPage } from './pages/404'
import { HomePage } from './pages/Home'
import { SearchPage } from './pages/Search'

function App() {
  return (
    <>
      <Header />

      {/* Cada Route se pinta solo si su "path" coincide con la URL actual.
          Es más declarativo que un if/else: se lee como un índice de la app. */}
      <Route path="/" component={HomePage} />
      <Route path="/search" component={SearchPage} />

      {/* 404: el Route SIN path es el comodín. Se pinta cuando la URL no
          coincide con ninguna de las rutas de arriba.
          Antes teníamos aquí una lista KNOWN_PATHS a mano; ahora es el propio
          Route quien registra las rutas, así que añadir una página nueva es
          escribir UNA sola línea (feedback de Mateo). */}
      <Route component={NotFoundPage} />

      <Footer />
    </>
  )
}

export default App
