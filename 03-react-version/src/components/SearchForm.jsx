// SearchForm: el formulario de búsqueda y filtros. Ahora es un componente casi
// "solo JSX": toda su lógica (ids únicos y handlers) vive en el custom hook
// useSearchForm. El componente solo se preocupa de PINTAR el formulario.
import { useState } from 'react'
import { useSearchForm } from '../hooks/useSearchForm'

// SearchForm recibe del padre (la página Search):
//   - onSearch: se llama al cambiar un SELECT (filtra al instante)
//   - onTextFilter: se llama al escribir en el buscador (con debounce)
//   - onReset: se llama al pulsar "Limpiar", para borrar todos los filtros
//   - defaultText / defaultFilters: valores iniciales (ej. restaurados de la URL
//     o de localStorage) para rellenar el buscador y los selects
//   - hasActiveFilters: true si hay algún filtro puesto (para mostrar "Limpiar")
export function SearchForm({
  onSearch,
  onTextFilter,
  onReset,
  defaultText = '',
  defaultFilters = {},
  hasActiveFilters = false,
}) {
  // El custom hook nos da los ids de los campos y los handlers ya listos.
  const { ids, handleChange, handleTextChange, handleReset } = useSearchForm({
    onSearch,
    onTextFilter,
    onReset,
  })

  // Estado local (de UI, no de datos): qué campo tiene el foco, para mostrar una
  // pista de ayuda solo cuando el buscador está enfocado. Lo dejamos en el
  // componente porque es puramente visual.
  const [focusedField, setFocusedField] = useState(null)

  // Ya no ponemos onChange en el <form>: separamos el buscador (con debounce) de
  // los selects (inmediatos), cada uno con su propio onChange.
  return (
    <form id="empleos-search-form" role="search">
      <div className="search-bar">
        {/* Cada <label> se enlaza a su control con htmlFor={mismoId}. Usamos la
            clase "sr-only" para que el texto exista para lectores de pantalla
            (accesibilidad) pero no se vea, ya que el diseño usa el placeholder. */}
        <label htmlFor={ids.search} className="sr-only">
          Buscar trabajos, empresas o habilidades
        </label>
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

        {/* El buscador usa handleTextChange, que aplica DEBOUNCE (espera a que
            dejes de teclear antes de buscar), para no pedir a la API por cada tecla. */}
        <input
          name={ids.search}
          id={ids.search}
          type="text"
          placeholder="Buscar trabajos, empresas o habilidades"
          defaultValue={defaultText}
          onChange={handleTextChange}
          onFocus={() => setFocusedField('search')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      {/* Pista contextual: solo aparece mientras el buscador tiene el foco.
          "condición && <elemento>" renderiza el elemento solo si la condición es true. */}
      {focusedField === 'search' && (
        <small className="input-hint">Busca por el título del trabajo (ej. "Analista", "Diseñador").</small>
      )}

      <div className="search-filters">
        <label htmlFor={ids.technology} className="sr-only">Tecnología</label>
        <select name={ids.technology} id={ids.technology} value={defaultFilters.technology || ''} onChange={handleChange}>
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

        <label htmlFor={ids.location} className="sr-only">Ubicación</label>
        <select name={ids.location} id={ids.location} value={defaultFilters.location || ''} onChange={handleChange}>
          <option value="">Ubicación</option>
          <option value="remoto">Remoto</option>
          <option value="cdmx">Ciudad de México</option>
          <option value="guadalajara">Guadalajara</option>
          <option value="monterrey">Monterrey</option>
          <option value="barcelona">Barcelona</option>
        </select>

        <label htmlFor={ids.experience} className="sr-only">Nivel de experiencia</label>
        <select name={ids.experience} id={ids.experience} value={defaultFilters.experienceLevel || ''} onChange={handleChange}>
          <option value="">Nivel de experiencia</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid-level</option>
          <option value="senior">Senior</option>
          <option value="lead">Lead</option>
        </select>

        {/* Ya NO hay botón "Buscar": los filtros se aplican automáticamente.
            El botón "Limpiar" solo aparece si hay algún filtro activo. */}
        {hasActiveFilters && (
          <button type="button" className="search-reset" onClick={handleReset}>Limpiar</button>
        )}
      </div>
    </form>
  )
}
