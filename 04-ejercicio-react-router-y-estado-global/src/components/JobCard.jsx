import { useState } from 'react'

import { Link } from './Link.jsx'
import { FavoriteButton } from './FavoriteButton.jsx'

export function JobCard({ job }) {
  const [isApplied, setIsApplied] = useState(false)

  const handleApplyClick = () => {
    setIsApplied(true)
  }

  const buttonClasses = isApplied ? 'button-apply-job is-applied' : 'button-apply-job'
  const buttonText = isApplied ? 'Aplicado' : 'Aplicar'

  return (
    <article
      className="job-listing-card"
      data-modalidad={job.data.modalidad}
      data-nivel={job.data.nivel}
      data-technology={job.data.technology}
    >
      {/* Enlazamos SOLO el bloque de texto, no la tarjeta entera.
          Motivo: meter un <button> dentro de un <a> es HTML inválido y rompe
          la accesibilidad (el navegador no sabe qué acción quieres al pulsar).
          Así el botón "Aplicar" sigue siendo un hermano independiente y
          funciona exactamente igual que antes. */}
      <Link
        href={`/job/${job.id}`}
        className="job-card-link"
        /* Sin esto, un lector de pantalla lee el enlace como el título suelto.
           Con aria-label anuncia la acción completa y el contexto. */
        aria-label={`Ver detalles de ${job.titulo} en ${job.empresa}`}
      >
        <h3>{job.titulo}</h3>
        <small>
          {job.empresa} | {job.ubicacion}
        </small>
        <p>{job.descripcion}</p>
      </Link>

      <div className="job-card-actions">
        <button className={buttonClasses} onClick={handleApplyClick}>
          {buttonText}
        </button>

        {/* JobCard no sabe nada de favoritos: solo le pasa el id.
            Toda la lógica (y la suscripción a la store) vive dentro. */}
        <FavoriteButton jobId={job.id} />
      </div>
    </article>
  )
}
