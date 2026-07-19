/* Aquí va la lógica para filtrar los resultados de búsqueda */

/*
  DESAFÍOS 3, 4 y 5 | Filtrar por ubicación, nivel, título y tecnología

  Reutilizamos las funciones que exporta `fetch-data.js`:
    - getJobs()      -> nos da la lista completa de empleos
    - renderJobs()   -> pinta en pantalla la lista que le pasemos

  La idea clave: NO escondemos ni mostramos tarjetas con CSS. Cada vez que el
  usuario toca un filtro, partimos SIEMPRE de la lista completa, la filtramos
  y volvemos a pintar. Así los filtros se combinan entre sí sin pisarse.
*/

import { getJobs, renderJobs } from './fetch-data.js'

// Seleccionamos los cuatro controles del formulario.
const searchInput = document.querySelector('#empleos-search-input')
const technologySelect = document.querySelector('#filter-technology')
const locationSelect = document.querySelector('#filter-location')
const experienceSelect = document.querySelector('#filter-experience-level')

/**
 * Decide si UN empleo concreto debe mostrarse con los filtros actuales.
 * Devuelve true (se muestra) o false (se descarta).
 */
function matchesFilters(job) {
  // Leemos el valor actual de cada control en el momento de filtrar.
  // `.trim()` quita los espacios sobrantes al principio y al final.
  // `.toLowerCase()` lo pasa todo a minúsculas para que la búsqueda
  // no distinga entre "Analista", "analista" o "ANALISTA".
  const searchText = searchInput.value.trim().toLowerCase()
  const technology = technologySelect.value
  const location = locationSelect.value
  const experience = experienceSelect.value

  /*
    Para cada filtro comprobamos dos cosas con `||` (O lógico):
      - que el filtro esté vacío ('' = opción por defecto) -> entonces no filtra nada
      - o que el empleo coincida con lo elegido
  */

  // DESAFÍO 4 | Búsqueda por título (ambos ya en minúsculas)
  const matchesSearch = searchText === '' || job.titulo.toLowerCase().includes(searchText)

  /*
    DESAFÍO 5 | Tecnología.
    Cuidado: en data.json `technology` es un ARRAY, por ejemplo ["react", "nodejs"].
    Por eso NO vale comparar con === ; usamos `.includes()` para preguntar
    si esa tecnología está dentro del array.
  */
  const matchesTechnology = technology === '' || job.data.technology.includes(technology)

  // DESAFÍO 3 | Ubicación. En el JSON el campo se llama `modalidad`
  // y sus valores ("remoto", "cdmx"...) coinciden con los value del <select>.
  const matchesLocation = location === '' || job.data.modalidad === location

  // DESAFÍO 3 | Nivel de experiencia. En el JSON el campo se llama `nivel`.
  const matchesExperience = experience === '' || job.data.nivel === experience

  // El empleo se muestra solo si cumple TODOS los filtros a la vez (`&&` = Y lógico).
  return matchesSearch && matchesTechnology && matchesLocation && matchesExperience
}

/*
  Pedimos los empleos una vez y, cuando llegan, conectamos los eventos.
  Como `getJobs()` guarda su promesa, esto NO hace una segunda petición:
  reutiliza la misma que ya lanzó `fetch-data.js`.
*/
getJobs()
  .then((allJobs) => {
    /**
     * Filtra la lista completa y vuelve a pintar el resultado.
     */
    function applyFilters() {
      // `.filter()` recorre el array y devuelve uno NUEVO solo con los
      // empleos para los que `matchesFilters` devolvió true.
      // Importante: `allJobs` nunca se modifica, siempre partimos de la lista entera.
      const filteredJobs = allJobs.filter(matchesFilters)
      renderJobs(filteredJobs)
    }

    // Los <select> avisan con el evento 'change' (al elegir una opción).
    technologySelect.addEventListener('change', applyFilters)
    locationSelect.addEventListener('change', applyFilters)
    experienceSelect.addEventListener('change', applyFilters)

    // El <input> de texto avisa con 'input': se dispara en cada tecla,
    // así los resultados se van actualizando mientras el usuario escribe.
    // Al borrar el texto vuelve a quedar vacío y se muestran todos otra vez.
    searchInput.addEventListener('input', applyFilters)

    // El formulario no se envía a ningún sitio: filtramos en la propia página.
    // Sin esto, pulsar Enter recargaría la página y se perderían los filtros.
    document.querySelector('#empleos-search-form').addEventListener('submit', (event) => {
      event.preventDefault()
    })
  })
  .catch((error) => {
    console.error('Error al preparar los filtros:', error)
  })
