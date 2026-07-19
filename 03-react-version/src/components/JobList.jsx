// JobList: agrupa la lista de trabajos.
// Ya no escribimos cada <JobCard> a mano: recorremos un array con .map().
// AHORA (lección "Terminando la paginación") tampoco importamos los datos aquí:
// App nos pasa por prop "jobs" solo los trabajos de la página actual. JobList es
// un componente "tonto" que pinta lo que le den, sin saber nada de paginación.
import { JobCard } from './JobCard'

export function JobList({ jobs }) {
  // Buena práctica: si no hay trabajos, mostramos un mensaje en vez de una lista vacía.
  if (jobs.length === 0) {
    return <p className="no-jobs">No hay trabajos disponibles en este momento.</p>
  }

  return (
    <ul className="jobs-listings">
      {/* .map() convierte cada objeto "job" del array en un <JobCard>.
          key={job.id} es OBLIGATORIO en listas: React lo usa para identificar
          cada elemento y saber cuál cambió, se añadió o se borró. Usamos job.id
          (un identificador único y estable), NUNCA el índice del array. */}
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isRemote={job.isRemote}
          isFeatured={job.isFeatured}
          isNew={job.isNew}
        />
      ))}
    </ul>
  )
}
