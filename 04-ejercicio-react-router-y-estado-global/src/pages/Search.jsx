import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Pagination } from '../components/Pagination.jsx'
import { SearchFormSection } from '../components/SearchFormSection.jsx'
import { JobListings } from '../components/JobListings.jsx'

const RESULTS_PER_PAGE = 4

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
