// Página Search (/search). AHORA la URL es la FUENTE DE LA VERDAD: el texto, los
// filtros y la página viven en la query string (ej. /search?text=react&page=2).
// Ventajas: la búsqueda es compartible (copias el enlace) y recargable (F5 mantiene
// todo), y los botones atrás/adelante del navegador funcionan solos.
import { SearchForm } from '../components/SearchForm'
import { JobList } from '../components/JobList'
import { Pagination } from '../components/Pagination'
import { Spinner } from '../components/Spinner'
import { useFetch } from '../hooks/useFetch'
import { useRouter } from '../hooks/useRouter'

const API_BASE = 'https://jscamp-api.vercel.app/api/jobs'
const RESULTS_PER_PAGE = 6

export function Search() {
  // useRouter nos da navigateTo y hace que Search se REPINTE al cambiar la URL.
  const { navigateTo } = useRouter()

  // Leemos TODO el estado de la búsqueda desde la URL (no de useState).
  const params = new URLSearchParams(window.location.search)
  const textToFilter = params.get('text') || ''
  const filters = {
    technology: params.get('technology') || '',
    location: params.get('location') || '',
    experienceLevel: params.get('experience') || '',
  }
  const currentPage = Number(params.get('page')) || 1

  // updateURL: navega a /search cambiando algunos parámetros y conservando el resto.
  // resetPage=true borra "page" (volver a la 1), porque al cambiar un filtro la
  // página en la que estabas podría ya no existir.
  const updateURL = (updates, { resetPage = true } = {}) => {
    const next = new URLSearchParams(window.location.search)
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    if (resetPage) next.delete('page')
    const qs = next.toString()
    navigateTo(qs ? `/search?${qs}` : '/search')
  }

  // Los handlers del formulario ya no tocan estado: actualizan la URL.
  const handleSearch = (newFilters) => {
    updateURL({
      technology: newFilters.technology,
      location: newFilters.location,
      experience: newFilters.experienceLevel,
    })
  }
  const handleTextFilter = (text) => updateURL({ text })
  const handleReset = () => navigateTo('/search')
  const handlePageChange = (page) => updateURL({ page: String(page) }, { resetPage: false })

  // Construimos la URL de la API (nombres de la API: text, technology, type, level)
  // con los filtros de la URL + la paginación (limit/offset).
  const apiParams = new URLSearchParams()
  if (textToFilter) apiParams.append('text', textToFilter)
  if (filters.technology) apiParams.append('technology', filters.technology)
  if (filters.location) apiParams.append('type', filters.location)
  if (filters.experienceLevel) apiParams.append('level', filters.experienceLevel)
  apiParams.append('limit', RESULTS_PER_PAGE)
  apiParams.append('offset', (currentPage - 1) * RESULTS_PER_PAGE)
  const apiUrl = `${API_BASE}?${apiParams.toString()}`

  const { data, total, loading, error } = useFetch(apiUrl)
  const jobs = data || []

  const totalResults = total
  const totalPages = Math.ceil(total / RESULTS_PER_PAGE)
  const hasActiveFilters =
    textToFilter !== '' ||
    filters.technology !== '' ||
    filters.location !== '' ||
    filters.experienceLevel !== ''

  // Título de la pestaña (React 19: <title> declarativo, ver más abajo).
  const getTitle = () => {
    if (loading) return 'Cargando empleos... · DevJobs'
    if (error) return 'Error al cargar · DevJobs'
    if (textToFilter) return `${totalResults} trabajos de "${textToFilter}" · Página ${currentPage}`
    return `DevJobs · Página ${currentPage}`
  }

  if (loading) {
    return (
      <main className="jobs-result">
        <title>{getTitle()}</title>
        <Spinner mensaje="Cargando empleos..." />
      </main>
    )
  }

  if (error) {
    return (
      <main className="jobs-result">
        <title>{getTitle()}</title>
        <p className="form-error">No se pudieron cargar los empleos. Inténtalo de nuevo.</p>
        <button className="cta-button" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </main>
    )
  }

  return (
    <main>
      <title>{getTitle()}</title>

      <section className="jobs-search">
        <h1>Encuentra tu próximo trabajo</h1>
        <p>Explora miles de oportunidades en el sector tecnológico.</p>

        {/* SearchForm avisa con onSearch (selects), onTextFilter (texto, con
            debounce) y onReset (Limpiar). Todos acaban cambiando la URL. */}
        <SearchForm
          onSearch={handleSearch}
          onTextFilter={handleTextFilter}
          onReset={handleReset}
          defaultText={textToFilter}
          defaultFilters={filters}
          hasActiveFilters={hasActiveFilters}
        />
      </section>

      <section className="jobs-result">
        <h2>Resultados de búsqueda</h2>

        <p className="results-summary">
          Se encontraron <strong>{totalResults}</strong>{' '}
          {totalResults === 1 ? 'trabajo' : 'trabajos'}
          {textToFilter && ` para "${textToFilter}"`}
        </p>

        {totalResults === 0 ? (
          <p className="no-jobs">
            No se han encontrado empleos que coincidan con los criterios de búsqueda.
          </p>
        ) : (
          <>
            <JobList jobs={jobs} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </main>
  )
}
