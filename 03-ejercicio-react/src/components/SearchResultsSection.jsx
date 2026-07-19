// PRIMERA + TERCERA + SEXTA PARTE.
//
// SearchResultsSection: la sección de resultados. Fíjate en lo PEQUEÑA y
// DECLARATIVA que ha quedado tras extraer JobListings y Pagination: se lee casi
// como HTML y solo describe "qué hay", no "cómo se hace".
import { JobListings } from './JobListings'
import { Pagination } from './Pagination'

// Props:
//   - jobs: los empleos de la página actual (ya filtrados y recortados)
//   - totalResults: cuántos empleos hay en total tras filtrar (para el resumen)
//   - currentPage / totalPages / onPageChange: todo lo que necesita Pagination
export function SearchResultsSection({
  jobs,
  totalResults,
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <section>
      <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

      <p style={{ textAlign: 'center' }}>
        Se {totalResults === 1 ? 'ha encontrado' : 'han encontrado'} <strong>{totalResults}</strong>{' '}
        {totalResults === 1 ? 'empleo' : 'empleos'}
      </p>

      <JobListings jobs={jobs} />

      {/* SEXTA PARTE: ocultamos la paginación si no hay resultados.
          Con "&&" solo pintamos <Pagination> cuando hay al menos una página. */}
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </section>
  )
}
