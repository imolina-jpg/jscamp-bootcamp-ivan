// SÉPTIMA PARTE + EXTRAS | La página /search.
//
// Aquí vive el contenido que antes estaba en App.jsx. Search es el componente
// "listo": sabe de dónde salen los datos y cómo se paginan. Sus hijos (el
// formulario, la lista, la paginación) son "tontos": solo pintan sus props.
//
// IDEA CLAVE (quinta parte): la URL es la FUENTE DE LA VERDAD.
// El texto, los filtros y la página NO están en useState, sino en la query string
// (ej. /search?text=react&technology=react&page=2). Ventajas:
//   - la búsqueda es compartible: copias el enlace y funciona
//   - al recargar con F5 no se pierde nada
//   - los botones atrás/adelante del navegador funcionan gratis
//
// EXTRAS 1, 2 y 3: los datos ya no salen de src/data.json, sino de una API real.
// Y el filtrado y la paginación tampoco los hacemos aquí: se los PEDIMOS a la
// API por search params. Así el navegador solo descarga los 5 empleos que va a
// mostrar, en vez de los 34 enteros para tirar 29 a la basura.
import { SearchFormSection } from '../components/SearchFormSection'
import { SearchResultsSection } from '../components/SearchResultsSection'
import { Spinner } from '../components/Spinner'
import { useFetch } from '../hooks/useFetch'
import { useRouter } from '../hooks/useRouter'

const API_URL = 'https://jscamp-api.vercel.app/api/jobs'

// Cuántos empleos mostramos por página. Al estar en una constante, cambiar el
// número es tocar una sola línea (y el nombre explica de dónde sale ese 5).
const RESULTS_PER_PAGE = 5

export function SearchPage() {
  // useRouter nos da los parámetros actuales de la URL y la función para navegar.
  // Además hace que esta página se repinte sola cada vez que la URL cambia.
  const { searchParams, navigateTo } = useRouter()

  // Leemos el estado desde la URL. El "|| ''" es por si el parámetro no existe.
  const filters = {
    text: searchParams.get('text') || '',
    technology: searchParams.get('technology') || '',
    location: searchParams.get('location') || '',
    experience: searchParams.get('experience') || '',
  }

  // Number('2') → 2. Si no hay page (o es basura), Number(null) es 0 → usamos 1.
  const currentPage = Number(searchParams.get('page')) || 1

  // updateURL: cambia unos parámetros y CONSERVA el resto.
  // resetPage=true borra "page" para volver a la página 1: al cambiar un filtro,
  // la página en la que estabas podría ya no existir (quinta parte del enunciado).
  const updateURL = (updates, { resetPage = true } = {}) => {
    const next = new URLSearchParams(searchParams)

    // Object.entries convierte { text: 'react' } en [['text', 'react']] para recorrerlo.
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value)
      else next.delete(key) // si el valor está vacío, quitamos el parámetro de la URL
    }

    if (resetPage) next.delete('page')

    const queryString = next.toString()
    navigateTo(queryString ? `/search?${queryString}` : '/search')
  }

  // Handlers que pasamos a los hijos. Ninguno toca "estado": todos cambian la URL,
  // y es ese cambio de URL lo que provoca el nuevo render con los datos nuevos.
  const handleTextChange = (text) => updateURL({ text })

  // [name] es una CLAVE DINÁMICA: si name vale "technology", el objeto que
  // creamos es { technology: value }. Así un solo handler sirve para los 3 selects.
  const handleFilterChange = (name, value) => updateURL({ [name]: value })

  // Al paginar NO reseteamos la página (sería absurdo: es justo lo que cambiamos).
  const handlePageChange = (page) => updateURL({ page: String(page) }, { resetPage: false })

  // Construimos la URL de la API. Ojo: los nombres de los parámetros de la API
  // no son los mismos que los nuestros, así que los traducimos:
  //   nuestro "location"   → API "type"
  //   nuestro "experience" → API "level"
  const apiParams = new URLSearchParams()
  // NOTA: En vez de usar una una variable que se actualiza en cada render, lo mejor es guardar esto en un useState
  // NOTA: Lo dejo como tarea
  if (filters.text) apiParams.set('text', filters.text)
  if (filters.technology) apiParams.set('technology', filters.technology)
  if (filters.location) apiParams.set('type', filters.location)
  if (filters.experience) apiParams.set('level', filters.experience)

  // limit = cuántos queremos; offset = desde cuál empezar.
  // Página 1 → offset 0; página 2 → offset 5; página 3 → offset 10...
  apiParams.set('limit', String(RESULTS_PER_PAGE))
  apiParams.set('offset', String((currentPage - 1) * RESULTS_PER_PAGE))

  const apiUrl = `${API_URL}?${apiParams.toString()}`

  // Una sola línea para pedir los datos, gracias al custom hook.
  // Como apiUrl cambia al cambiar cualquier filtro o página, useFetch vuelve a
  // pedir automáticamente: no tenemos que llamar a nada "a mano".
  const { data: jobs, total, loading, error } = useFetch(apiUrl)

  // Math.ceil redondea hacia arriba: 34 resultados / 5 por página = 6.8 → 7 páginas.
  const totalPages = Math.ceil(total / RESULTS_PER_PAGE)

  // EXTRA: en React 19 se puede poner <title> dentro de cualquier componente y
  // React lo mueve solo al <head>. Así el título de la pestaña refleja la búsqueda.
  const pageTitle = loading
    ? 'Buscando empleos... | DevJobs'
    : `Resultados ${total} | Página ${currentPage} | DevJobs`

  return (
    <main>
      <title>{pageTitle}</title>

      {/* El formulario se pinta SIEMPRE, también mientras carga: si lo
          escondiéramos, el input perdería el foco a cada búsqueda y no se
          podría seguir escribiendo. */}
      <SearchFormSection
        filters={filters}
        onTextChange={handleTextChange}
        onFilterChange={handleFilterChange}
      />

      {/* RENDERIZADO CONDICIONAL en tres estados: cargando, error y datos.
          Con una API SIEMPRE hay que contemplar los tres: la red puede tardar
          o fallar, cosa que con un import de JSON no pasaba nunca. */}
      {loading && (
        <section>
          <Spinner mensaje="Cargando empleos..." />
        </section>
      )}

      {error && (
        <section style={{ textAlign: 'center' }}>
          <h2>No se han podido cargar los empleos</h2>
          <p>Revisa tu conexión a internet e inténtalo de nuevo.</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </section>
      )}

      {!loading && !error && (
        <SearchResultsSection
          jobs={jobs}
          totalResults={total}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  )
}
