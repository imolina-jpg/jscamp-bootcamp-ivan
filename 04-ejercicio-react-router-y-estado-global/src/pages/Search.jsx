import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Pagination } from '../components/Pagination.jsx'
import { SearchFormSection } from '../components/SearchFormSection.jsx'
import { JobListings } from '../components/JobListings.jsx'

// El número de resultados por página ya no es una constante fija: ahora es un
// filtro más que el usuario controla y que vive en la URL (?limit=8).
import { DEFAULT_RESULTS_PER_PAGE, RESULTS_PER_PAGE_OPTIONS } from '../constants.js'

/**
 * Antes teníamos los filtros duplicados en dos sitios: en useState y en la URL,
 * y un useEffect que copiaba de uno a otro. Eso siempre acaba mal (se
 * desincronizan, aparecen bucles...).
 *
 * Ahora la URL es la ÚNICA fuente de la verdad. useSearchParams funciona casi
 * como un useState, pero el estado vive en la query string (?text=react&page=2):
 *   - searchParams    → para leer  (como la variable de estado)
 *   - setSearchParams → para escribir (como el setter)
 *
 * Ventaja: recargar la página, compartir el enlace o dar a "atrás" simplemente
 * funcionan, porque todo el estado está en la URL.
 */
const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Leemos directamente de la URL. Nada de useState para los filtros.
  const textToFilter = searchParams.get('text') ?? ''
  const filters = {
    technology: searchParams.get('technology') ?? '',
    location: searchParams.get('type') ?? '',
    experienceLevel: searchParams.get('level') ?? '',
  }
  // Number('') es 0 y Number(null) también, así que el `|| 1` cubre los dos casos.
  const currentPage = Number(searchParams.get('page')) || 1

  // Filtro nuevo: cuántos resultados por página. Igual que los demás, su
  // fuente de la verdad es la URL. Validamos que sea uno de los permitidos:
  // si alguien escribe ?limit=9999 a mano, caemos al valor por defecto.
  const limitFromUrl = Number(searchParams.get('limit'))
  const resultsPerPage = RESULTS_PER_PAGE_OPTIONS.includes(limitFromUrl)
    ? limitFromUrl
    : DEFAULT_RESULTS_PER_PAGE

  // Esto SÍ es estado del componente: son datos que vienen de la API,
  // no decisiones del usuario, así que no pintan nada en la URL.
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Convertimos los params a texto para usarlos como dependencia del efecto:
  // comparar strings es fiable, comparar objetos no.
  const searchParamsString = searchParams.toString()

  useEffect(() => {
    const controller = new AbortController()

    async function fetchJobs() {
      try {
        setLoading(true)

        // Los nombres de nuestros filtros en la URL coinciden con los que espera
        // la API (text, technology, type, level), así que podemos reutilizarlos.
        const params = new URLSearchParams(searchParamsString)

        // `page` es cosa nuestra; la API trabaja con limit + offset.
        const page = Number(params.get('page')) || 1

        // `limit` ya viaja en la URL, pero lo reescribimos con el valor
        // validado para no mandarle a la API un ?limit=9999 escrito a mano.
        const limit = RESULTS_PER_PAGE_OPTIONS.includes(Number(params.get('limit')))
          ? Number(params.get('limit'))
          : DEFAULT_RESULTS_PER_PAGE

        params.delete('page')
        params.set('limit', limit)
        params.set('offset', (page - 1) * limit)

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

  const totalPages = Math.ceil(total / resultsPerPage)

  /**
   * Actualiza un parámetro de la URL.
   *
   * Usamos params.set() y NO params.append(): append AÑADE otro valor con la
   * misma clave, así que filtrar tres veces dejaría ?technology=react&technology=vue...
   * set() reemplaza el valor anterior, que es lo que queremos.
   *
   * Y si el valor está vacío, borramos la clave para no ensuciar la URL con
   * ?technology= sin nada detrás.
   */
  const updateSearchParams = (updates, { resetPage = true } = {}) => {
    setSearchParams((previousParams) => {
      const params = new URLSearchParams(previousParams)

      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value)
        else params.delete(key)
      }

      // Al cambiar un filtro volvemos a la página 1: si estabas en la página 5
      // y filtras, lo más probable es que ya no existan 5 páginas.
      if (resetPage) params.delete('page')

      return params
    })
  }

  const handlePageChange = (page) => {
    // La página 1 es el valor por defecto, así que no hace falta escribirla.
    updateSearchParams({ page: page > 1 ? String(page) : '' }, { resetPage: false })
  }

  const handleFilterChange = (name, value) => {
    // El formulario habla de location/experienceLevel; la URL y la API usan
    // type/level. Traducimos aquí, en un único sitio.
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

  const handleResultsPerPageChange = (newLimit) => {
    // Si eligen el valor por defecto mandamos cadena vacía para que se borre
    // de la URL: ?limit=4 no aporta nada si 4 es lo que ya sale por defecto.
    const value = Number(newLimit) === DEFAULT_RESULTS_PER_PAGE ? '' : String(newLimit)
    // resetPage por defecto: al cambiar cuántos caben por página, el número
    // de página en el que estabas ya no significa lo mismo.
    updateSearchParams({ limit: value })
  }

  return {
    loading,
    jobs,
    total,
    totalPages,
    currentPage,
    textToFilter,
    filters,
    resultsPerPage,
    handlePageChange,
    handleFilterChange,
    handleTextFilter,
    handleResultsPerPageChange,
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
    resultsPerPage,
    handlePageChange,
    handleFilterChange,
    handleTextFilter,
    handleResultsPerPageChange,
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
        resultsPerPage={resultsPerPage}
        onFilterChange={handleFilterChange}
        onTextFilter={handleTextFilter}
        onResultsPerPageChange={handleResultsPerPageChange}
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
