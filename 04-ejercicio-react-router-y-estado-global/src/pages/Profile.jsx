import { useEffect, useState } from 'react'

import { JobListings } from '../components/JobListings.jsx'
import { useFavoritesStore } from '../store/favoritesStore.js'

export function ProfilePage() {
  const favorites = useFavoritesStore((state) => state.favorites)
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites)

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  // Mismo truco que en Search: el array como dependencia se compara por
  // referencia y dispararía el efecto en cada render.
  const favoritesKey = favorites.join(',')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchFavorites() {
      if (favorites.length === 0) {
        setJobs([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Promise.all lanza todas las peticiones a la vez, con un for + await
        // irían una detrás de otra y tardaría mucho más.
        const results = await Promise.all(
          favorites.map((id) =>
            fetch(`https://jscamp-api.vercel.app/api/jobs/${id}`, {
              signal: controller.signal,
            }).then((response) => (response.ok ? response.json() : null))
          )
        )

        // Descarto los que hayan fallado, por ejemplo un empleo ya borrado.
        setJobs(results.filter(Boolean))
      } catch (error) {
        if (error.name === 'AbortError') return
        console.error('Error cargando favoritos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoritesKey])

  return (
    <main className="page">
      <title>Mi perfil - DevJobs</title>

      <h1 style={{ display: 'block', marginBottom: '1.5rem' }}>Mis favoritos</h1>

      {loading && <p>Cargando tus favoritos...</p>}

      {!loading && favorites.length === 0 && (
        <p style={{ color: 'var(--text-muted)' }}>
          Todavía no has guardado ningún empleo. Marca la estrella en cualquier
          oferta para verla aquí.
        </p>
      )}

      {!loading && favorites.length > 0 && (
        <>
          <JobListings jobs={jobs} />
          <button
            className="button-favorite"
            onClick={clearFavorites}
            style={{ marginTop: '1.5rem' }}
          >
            Vaciar favoritos
          </button>
        </>
      )}
    </main>
  )
}

export default ProfilePage
