// SEGUNDA + TERCERA PARTE | Mapeo de datos y renderizado condicional.
//
// JobListings: se encarga SOLO de la lista de empleos. Recibe por props el array
// "jobs" ya filtrado y paginado por el padre, y decide si pinta las tarjetas o
// el mensaje de "no hay resultados".
//
// Separar esto de SearchResultsSection sigue el principio de "una sola
// responsabilidad": cada componente hace una cosa y se entiende de un vistazo.
import { JobCard } from './JobCard'

export function JobListings({ jobs }) {
  return (
    <div className="jobs-listings">
      {/* RENDERIZADO CONDICIONAL con "&&": si la condición de la izquierda es
          true, React pinta lo de la derecha; si es false, no pinta nada.
          Aquí: si el array está vacío, mostramos el mensaje. */}
      {jobs.length === 0 && (
        <p>No se han encontrado empleos que coincidan con los criterios de búsqueda.</p>
      )}

      {/* MAPEO DE DATOS: .map() transforma cada objeto "job" del array en un
          elemento JSX (<JobCard />). Es la forma de renderizar listas en React.

          key es OBLIGATORIA en las listas: React la usa para identificar cada
          elemento entre renders y saber cuál se ha añadido, movido o borrado.
          Usamos job.id (único y estable), NUNCA el índice del array. */}
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
