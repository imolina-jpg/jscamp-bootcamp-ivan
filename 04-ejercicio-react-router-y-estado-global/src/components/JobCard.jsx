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
      {/* Enlazo solo el texto y no la tarjeta entera porque un <button> dentro
          de un <a> es HTML inválido */}
      <Link
        href={`/job/${job.id}`}
        className="job-card-link"
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

        <FavoriteButton jobId={job.id} />
      </div>
    </article>
  )
}
