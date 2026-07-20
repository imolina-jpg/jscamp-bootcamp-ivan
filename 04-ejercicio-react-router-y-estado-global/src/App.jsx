import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'

import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'

// Con lazy() cada página se descarga solo al navegar a ella.
// Ojo: lazy() necesita que el módulo tenga export default.
const HomePage = lazy(() => import('./pages/Home.jsx'))
const SearchPage = lazy(() => import('./pages/Search.jsx'))
const DetailPage = lazy(() => import('./pages/Detail.jsx'))
const LoginPage = lazy(() => import('./pages/Login.jsx'))
const ProfilePage = lazy(() => import('./pages/Profile.jsx'))
const NotFoundPage = lazy(() => import('./pages/404.jsx'))

function App() {
  return (
    <>
      <Header />

      {/* Suspense es obligatorio con lazy: es lo que se ve mientras descarga. */}
      <Suspense fallback={<p style={{ textAlign: 'center', padding: '2rem' }}>Cargando página...</p>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* El :id se lee dentro con useParams() */}
          <Route path="/job/:id" element={<DetailPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* El comodín tiene que ir el último o se come al resto */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <Footer />
    </>
  )
}

export default App
