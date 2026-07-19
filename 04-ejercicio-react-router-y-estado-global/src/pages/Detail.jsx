import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import snarkdown from 'snarkdown'

import { Link } from '../components/Link.jsx'
import { FavoriteButton } from '../components/FavoriteButton.jsx'
import { useAuthStore } from '../store/authStore.js'

/**
 * Sección de texto largo del empleo.
 *
 * La API nos manda estos bloques en Markdown (con guiones para las listas,
 * **negritas**, etc.). snarkdown lo convierte a HTML, y dangerouslySetInnerHTML
 * lo inyecta en el DOM.
 *
 * ¿Por qué React le pone ese nombre tan feo? Para que te lo pienses: inyectar
 * HTML sin filtrar permite ataques XSS (si el texto viniera de un usuario
 * malicioso podría colar un <script>). Aquí lo aceptamos porque el contenido
 * viene de NUESTRA API de confianza. Con datos de usuarios habría que
 * sanitizar antes (por ejemplo con DOMPurify).
 */
function JobSection({ title, content }) {
  // Si la API no manda esta sección, no pintamos nada (guard clause).
  if (!content) return null

  const html = snarkdown(content)

  return (
    <section className="job-detail-section">
      <h2>{title}</h2>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  )
}

export function DetailPage() {
  // useParams lee las partes dinámicas de la URL. Como la ruta está declarada
  // como "/job/:id", aquí recibimos { id: "7a4d1d8b-..." }.
  // Ojo: siempre son strings, aunque en la URL parezca un número.
  const { id } = useParams()

  // Otro consumidor de la store, en una rama del árbol totalmente distinta
  // a la del Header. Ninguno de los dos sabe que el otro existe.
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    // AbortController nos deja CANCELAR la petición. Hace falta porque si el
    // usuario cambia de empleo rápido, la respuesta lenta de la petición vieja
    // podría llegar después de la nueva y pintar los datos equivocados.
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    fetch(`https://jscamp-api.vercel.app/api/jobs/${id}`, {
      signal: controller.signal,
    })
      .then((response) => {
        // Importante: fetch NO lanza error con un 404 o un 500. Solo falla si
        // no hay red. Por eso comprobamos response.ok a mano.
        if (!response.ok) throw new Error('No hemos encontrado este empleo')
        return response.json()
      })
      .then((data) => setJob(data))
      .catch((error) => {
        // Si hemos cancelado nosotros, no es un error de verdad: lo ignoramos.
        if (error.name === 'AbortError') return
        setError(error.message)
        setJob(null)
      })
      .finally(() => setLoading(false))

    // Esta función de limpieza se ejecuta cuando el componente se desmonta
    // o cuando cambia el `id`: cancela la petición anterior.
    return () => controller.abort()
  }, [id])

  if (loading) {
    return (
      <main className="job-detail">
        <p>Cargando empleo...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="job-detail">
        <title>Empleo no encontrado - DevJobs</title>
        <h1>Vaya...</h1>
        <p>{error}</p>
        <Link href="/search">← Volver a la búsqueda</Link>
      </main>
    )
  }

  return (
    <main className="job-detail">
      <title>{`${job.titulo} en ${job.empresa} - DevJobs`}</title>
      <meta name="description" content={job.descripcion} />

      {/* Breadcrumbs (migas de pan): le dicen al usuario dónde está y cómo
          volver. aria-current="page" marca el elemento actual para los
          lectores de pantalla. */}
      <nav aria-label="Ruta de navegación" className="breadcrumbs">
        <ol>
          <li>
            <Link href="/">Inicio</Link>
          </li>
          <li>
            <Link href="/search">Empleos</Link>
          </li>
          <li aria-current="page">{job.titulo}</li>
        </ol>
      </nav>

      <header className="job-detail-header">
        <h1>{job.titulo}</h1>
        <p className="job-detail-company">
          {job.empresa} · {job.ubicacion}
        </p>

        <ul className="job-detail-tags">
          <li>{job.data.modalidad}</li>
          <li>{job.data.nivel}</li>
          {/* technology es un ARRAY en esta API, así que lo recorremos */}
          {job.data.technology.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        {/* Solo se puede aplicar con la sesión iniciada. `disabled` bloquea el
            botón de verdad (también para teclado y lectores de pantalla),
            que es mejor que esconderlo o taparlo con CSS. */}
        <div className="job-detail-actions">
          <button className="button-apply-job" disabled={!isLoggedIn}>
            {isLoggedIn ? 'Aplicar ahora' : 'Inicia sesión para aplicar'}
          </button>

          {/* El mismo componente que en la lista. Como el estado es global,
              si marcas el favorito aquí, la tarjeta de la búsqueda ya sale
              marcada al volver: no hay que sincronizar nada a mano. */}
          <FavoriteButton jobId={job.id} />
        </div>
      </header>

      <JobSection title="Descripción del puesto" content={job.content?.description} />
      <JobSection title="Responsabilidades" content={job.content?.responsibilities} />
      <JobSection title="Requisitos" content={job.content?.requirements} />
      <JobSection title="Sobre la empresa" content={job.content?.about} />
    </main>
  )
}

export default DetailPage
