import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Pagination } from '../components/Pagination.jsx'
import { SearchFormSection } from '../components/SearchFormSection.jsx'
import { JobListings } from '../components/JobListings.jsx'

const RESULTS_PER_PAGE = 4

// Los filtros no están en useState: viven en la URL, que es la fuente de la
// verdad. Así recargar, compartir el enlace y el botón de atrás funcionan solos.
const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const textToFilter = searchParams.get('text') ?? ''
  const filters = {
    technology: searchParams.get('technology') ?? '',
    location: searchParams.get('type') ?? '',
    experienceLevel: searchParams.get('level') ?? '',
  }
  const currentPage = Number(searchParams.get('page')) || 1

  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Como dependencia del efecto uso el string y no el objeto, que se compara
  // por referencia y dispararía el efecto en cada render.
  const searchParamsString = searchParams.toString()

  useEffect(() => {
    const controller = new AbortController()

    async function fetchJobs() {
      try {
        setLoading(true)

        // Los nombres de la URL ya son los que espera la API, se reutilizan.
        const params = new URLSearchParams(searchParamsString)

        // `page` es nuestra; la API va con limit + offset.
        const page = Number(params.get('page')) || 1
        params.delete('page')
        params.set('limit', RESULTS_PER_PAGE)
        params.set('offset', (page - 1) * RESULTS_PER_PAGE)

        const response = await fetch(
          `https://jscamp-api.vercel.app/api/jobs?${params.toString()}`,
          { signal: controller.signal }
        )
        const json = await response.json()

        setJobs(json.data)
        setTotal(json.total)
      } catch (error) {
        if (error.name === 'AbortError') return
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()

    return () => controller.abort()
  }, [searchParamsString])

  const totalPages = Math.ceil(total / RESULTS_PER_PAGE)

  // set() y no append(): con append, filtrar tres veces deja la URL como
  // ?technology=react&technology=vue&technology=java en vez de reemplazar.
  const updateSearchParams = (updates, { resetPage = true } = {}) => {
    setSearchParams((previousParams) => {
      const params = new URLSearchParams(previousParams)

      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value)
        else params.delete(key)
      }

      // Al filtrar vuelvo a la página 1, que si no puede que ya no exista.
      if (resetPage) params.delete('page')

      return params
    })
  }

  const handlePageChange = (page) => {
    // La página 1 no hace falta ponerla en la URL, es la de por defecto.
    updateSearchParams({ page: page > 1 ? String(page) : '' }, { resetPage: false })
  }

  const handleFilterChange = (name, value) => {
    // El formulario los llama location/experienceLevel y la API type/level.
    const keyByName = {
      technology: 'technology',
      location: 'type',
      experienceLevel: 'level',
    }

    updateSearchParams({ [keyByName[name]]: value })
  }

  const handleTextFilter = (newTextToFilter) => {
    updateSearchParams({ text: newTextToFilter })
  }

  return {
    loading,
    jobs,
    total,
    totalPages,
    currentPage,
    textToFilter,
    filters,
    handlePageChange,
    handleFilterChange,
    handleTextFilter,
  }
}

export function SearchPage() {
  const {
    jobs,
    total,
    loading,
    totalPages,
    currentPage,
    textToFilter,
    filters,
    handlePageChange,
    handleFilterChange,
    handleTextFilter,
  } = useFilters()

  const title = loading
    ? `Cargando... - DevJobs`
    : `Resultados: ${total}, Página ${currentPage} - DevJobs`

  return (
    <main>
      <title>{title}</title>
      <meta name="description" content="Explora miles de oportunidades laborales en el sector tecnológico. Encuentra tu próximo empleo en DevJobs." />

      <SearchFormSection
        initialText={textToFilter}
        filters={filters}
        onFilterChange={handleFilterChange}
        onTextFilter={handleTextFilter}
      />

      <section>
        <h2 style={{ textAlign: 'center' }}>Resultados de búsqueda</h2>

        {
          loading ? <p>Cargando empleos...</p> : <JobListings jobs={jobs} />
        }
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </section>
    </main>
  )
}

export default SearchPage
