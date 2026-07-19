import { useId, useRef } from 'react'

/**
 * Custom hook con la lógica del buscador de texto.
 *
 * Debounce: en vez de buscar en cada tecla, esperamos 500 ms desde la última
 * pulsación. Si el usuario sigue escribiendo, cancelamos el temporizador
 * anterior y arrancamos otro. Así escribir "javascript" hace 1 petición y no 10.
 */
const useSearchForm = ({ onTextFilter }) => {
  // useRef guarda el id del temporizador ENTRE renders sin provocar re-renders.
  // Una variable normal se perdería en cada render; un useState causaría un
  // render extra inútil.
  const timeoutId = useRef(null)

  const handleTextChange = (event) => {
    const text = event.target.value

    if (timeoutId.current) {
      clearTimeout(timeoutId.current)
    }

    timeoutId.current = setTimeout(() => {
      onTextFilter(text)
    }, 500)
  }

  return { handleTextChange }
}

export function SearchFormSection({ onTextFilter, onFilterChange, filters, initialText }) {
  const idText = useId()
  const idTechnology = useId()
  const idLocation = useId()
  const idExperienceLevel = useId()

  const inputRef = useRef()

  const { handleTextChange } = useSearchForm({ onTextFilter })

  const handleClearInput = (event) => {
    event.preventDefault()

    inputRef.current.value = ''
    onTextFilter('')
  }

  // Un único manejador para los tres selects: el `name` nos dice cuál cambió.
  const handleSelectChange = (event) => {
    onFilterChange(event.target.name, event.target.value)
  }

  return (
    <section className="jobs-search">
      <h1>Encuentra tu próximo trabajo</h1>
      <p>Explora miles de oportunidades en el sector tecnológico.</p>

      <form id="empleos-search-form" role="search" onSubmit={(event) => event.preventDefault()}>
        <div className="search-bar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-search"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>

          <label htmlFor={idText} className="sr-only">
            Buscar empleos
          </label>

          {/* Este input va SIN controlar (defaultValue en vez de value) a
              propósito: con el debounce, la URL se actualiza medio segundo
              después de escribir, y si el input dependiera de ella daría saltos
              raros mientras escribes. Solo lee el valor inicial de la URL. */}
          <input
            ref={inputRef}
            id={idText}
            type="text"
            placeholder="Buscar trabajos, empresas o habilidades"
            onChange={handleTextChange}
            defaultValue={initialText}
          />

          <button type="button" onClick={handleClearInput} aria-label="Limpiar búsqueda">
            ✖︎
          </button>
        </div>

        <div className="search-filters">
          {/* Los selects SÍ van controlados: su `value` sale de la URL.
              Esto es lo que hace que al recargar /search?technology=react
              el desplegable siga mostrando "React" seleccionado. */}
          <label htmlFor={idTechnology} className="sr-only">
            Filtrar por tecnología
          </label>
          <select
            name="technology"
            id={idTechnology}
            value={filters.technology}
            onChange={handleSelectChange}
          >
            <option value="">Tecnología</option>
            <optgroup label="Tecnologías populares">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="react">React</option>
              <option value="nodejs">Node.js</option>
            </optgroup>
            <option value="java">Java</option>
            <hr />
            <option value="csharp">C#</option>
            <option value="c">C</option>
            <option value="c++">C++</option>
            <hr />
            <option value="ruby">Ruby</option>
            <option value="php">PHP</option>
          </select>

          <label htmlFor={idLocation} className="sr-only">
            Filtrar por ubicación
          </label>
          <select
            name="location"
            id={idLocation}
            value={filters.location}
            onChange={handleSelectChange}
          >
            <option value="">Ubicación</option>
            <option value="remoto">Remoto</option>
            <option value="cdmx">Ciudad de México</option>
            <option value="guadalajara">Guadalajara</option>
            <option value="monterrey">Monterrey</option>
            <option value="barcelona">Barcelona</option>
          </select>

          <label htmlFor={idExperienceLevel} className="sr-only">
            Filtrar por nivel de experiencia
          </label>
          <select
            name="experienceLevel"
            id={idExperienceLevel}
            value={filters.experienceLevel}
            onChange={handleSelectChange}
          >
            <option value="">Nivel de experiencia</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>
      </form>
    </section>
  )
}
