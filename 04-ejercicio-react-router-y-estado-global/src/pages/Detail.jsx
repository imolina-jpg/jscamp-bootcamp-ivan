import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import snarkdown from 'snarkdown'

import { Link } from '../components/Link.jsx'
import { FavoriteButton } from '../components/FavoriteButton.jsx'
import { useAuthStore } from '../store/authStore.js'
import styles from './Detail.module.css'

// La API manda estos bloques en Markdown, snarkdown los pasa a HTML.
// Vale porque el contenido es de nuestra API; con texto de usuarios habría que
// sanitizarlo antes (XSS).
function JobSection({ title, content }) {
  if (!content) return null

  const html = snarkdown(content)

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {/* `prose` va sin styles. porque es una clase global de index.css */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  )
}

export function DetailPage() {
  const { id } = useParams()

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isApplied, setIsApplied] = useState(false)

  useEffect(() => {
    if (!id) return

    // Cancela la petición anterior. Si no, al cambiar de empleo rápido puede
    // llegar la respuesta vieja después de la nueva y pintar datos que no son.
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    fetch(`https://jscamp-api.vercel.app/api/jobs/${id}`, {
      signal: controller.signal,
    })
      .then((response) => {
        // fetch no falla con un 404, hay que mirar response.ok a mano
        if (!response.ok) throw new Error('No hemos encontrado este empleo')
        return response.json()
      })
      .then((data) => setJob(data))
      .catch((error) => {
        if (error.name === 'AbortError') return
        setError(error.message)
        setJob(null)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [id])

  if (loading) {
    return (
      <main className={styles.loading}>
        <p>Cargando empleo...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className={styles.notFound}>
        <title>Empleo no encontrado - DevJobs</title>
        <h1 style={{ display: 'block', marginBottom: '0.5rem' }}>Oferta no encontrada</h1>
        <p style={{ marginBottom: '1.5rem' }}>
          Puede que esta oferta haya caducado o que la URL no sea correcta.
        </p>
        <Link href="/search" className={styles.backButton}>
          Volver a la lista de empleos
        </Link>
      </main>
    )
  }

  return (
    <main className={styles.container}>
      <title>{`${job.titulo} en ${job.empresa} - DevJobs`}</title>
      <meta name="description" content={job.descripcion} />

      <nav aria-label="Ruta de navegación" className={styles.breadcrumb}>
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

      <header className={styles.header}>
        <h1>{job.titulo}</h1>
        <p className={styles.company}>
          {job.empresa} · {job.ubicacion}
        </p>

        <ul className={styles.tags}>
          <li>{job.data.modalidad}</li>
          <li>{job.data.nivel}</li>
          {/* technology es un array en esta API */}
          {job.data.technology.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        <div className={styles.actions}>
          {/* Mismo patrón que en JobCard: el "aplicado" es estado local, no hay
              endpoint de candidaturas todavía */}
          <button
            className={isApplied ? 'button-apply-job is-applied' : 'button-apply-job'}
            disabled={!isLoggedIn}
            onClick={() => setIsApplied(true)}
          >
            {!isLoggedIn ? 'Inicia sesión para aplicar' : isApplied ? 'Aplicado' : 'Aplicar'}
          </button>

          <FavoriteButton jobId={job.id} />
        </div>
      </header>

      <JobSection title="Descripción del puesto" content={job.content?.description} />
      <JobSection title="Responsabilidades" content={job.content?.responsibilities} />
      <JobSection title="Requisitos" content={job.content?.requirements} />
      <JobSection title="Acerca de la empresa" content={job.content?.about} />
    </main>
  )
}

export default DetailPage
