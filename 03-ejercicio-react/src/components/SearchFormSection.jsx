// PRIMERA + QUINTA PARTE | Componetización y funcionalidad del filtrado.
//
// SearchFormSection: la sección del buscador con su input de texto y sus 3 selects.
// No guarda los filtros: los RECIBE por props y AVISA al padre cuando cambian.
// El "dueño" del estado es la página Search (que a su vez lo guarda en la URL).
import { useRef } from 'react'

// Props:
//   - filters: { text, technology, location, experience } → valores actuales
//   - onTextChange: se llama al escribir en el buscador (con debounce)
//   - onFilterChange: se llama al cambiar cualquier select (al instante)
export function SearchFormSection({ filters, onTextChange, onFilterChange }) {
  // useRef es una "caja" que React conserva entre renders y que, al cambiar,
  // NO provoca un re-render. Perfecta para guardar el id de un setTimeout.
  // (Si usáramos useState, cada tecla repintaría el componente sin necesidad).
  const timeoutId = useRef(null)

  // DEBOUNCE: en vez de filtrar en cada tecla, programamos el filtrado para
  // dentro de 400 ms. Si el usuario sigue escribiendo, cancelamos el temporizador
  // anterior y arrancamos otro. Solo cuando para de teclear se filtra una vez.
  const handleTextChange = (event) => {
    const text = event.target.value

    if (timeoutId.current) clearTimeout(timeoutId.current)

    timeoutId.current = setTimeout(() => {
      onTextChange(text)
    }, 400)
  }

  // Los selects filtran al momento (no hace falta debounce: un clic = un cambio).
  // event.target.name nos dice QUÉ select cambió, así usamos un solo handler
  // para los tres en lugar de escribir tres funciones casi idénticas.
  const handleSelectChange = (event) => {
    onFilterChange(event.target.name, event.target.value)
  }

  return (
    <section className="jobs-search">
      <h1>Encuentra tu próximo trabajo</h1>
      <p>Explora miles de oportunidades en el sector tecnológico.</p>

      {/* onSubmit + preventDefault: si el usuario pulsa Enter, evitamos que el
          formulario recargue la página (el filtrado ya es automático). */}
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
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
            <path d="M21 21l-6 -6" />
          </svg>

          {/* Este input es NO CONTROLADO: usamos defaultValue (valor inicial) en
              vez de value. Así el usuario escribe con total fluidez y solo
              avisamos al padre cuando termina (debounce). Si usáramos value,
              tendríamos que repintar en cada tecla. */}
          <input
            id="empleos-search-input"
            type="text"
            name="search-value"
            placeholder="Buscar trabajos, empresas o habilidades"
            defaultValue={filters.text}
            onChange={handleTextChange}
          />
        </div>

        <div className="search-filters">
          {/* Estos selects sí son CONTROLADOS: su value sale de las props.
              Ventaja: si la URL cambia (por ejemplo al pulsar "atrás"), los
              selects se actualizan solos para reflejar el estado real. */}
          <select
            name="technology"
            id="filter-technology"
            value={filters.technology}
            onChange={handleSelectChange}
          >
            <option value="">Tecnología</option>
            <optgroup label="Tecnologías populares">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="react">React</option>
              <option value="node">Node.js</option>
            </optgroup>
            <option value="mobile">Mobile</option>
          </select>

          <select
            name="location"
            id="filter-location"
            value={filters.location}
            onChange={handleSelectChange}
          >
            <option value="">Ubicación</option>
            <option value="remoto">Remoto</option>
            <option value="cdmx">Ciudad de México</option>
            <option value="guadalajara">Guadalajara</option>
            <option value="monterrey">Monterrey</option>
            <option value="barcelona">Barcelona</option>
            <option value="madrid">Madrid</option>
            <option value="valencia">Valencia</option>
            <option value="bogota">Bogotá</option>
            <option value="lima">Lima</option>
            <option value="santiago">Santiago</option>
            <option value="bsas">Buenos Aires</option>
          </select>

          <select
            name="experience"
            id="filter-experience-level"
            value={filters.experience}
            onChange={handleSelectChange}
          >
            <option value="">Nivel de experiencia</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
          </select>
        </div>
      </form>
    </section>
  )
}
