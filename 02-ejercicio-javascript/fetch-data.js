/* Aquí va la lógica para mostrar los resultados de búsqueda */

/*
  DESAFÍO 1 | Mostrar los resultados de búsqueda

  Este archivo tiene dos responsabilidades:
    1. Traer los empleos del archivo `data.json` con `fetch`.
    2. Pintarlos dentro del <ul class="jobs-listings"> del HTML.

  Además exporta esas dos funciones para que `filters.js` pueda reutilizarlas
  cuando el usuario filtre, en vez de duplicar el mismo código dos veces.
*/

// Seleccionamos el <ul> donde se van a insertar los empleos.
// Ojo con el nombre: la clase es "jobs-listings", en plural.
const listContainer = document.querySelector('.jobs-listings')

/*
  Este Set guarda los IDs de los empleos a los que ya hemos aplicado.
  Lo compartimos con apply-button.js para que, aunque se vuelva a pintar la
  lista al filtrar, los botones recuerden su estado "¡Aplicado!".
*/
export const appliedJobs = new Set()

/*
  Guardamos aquí la promesa del fetch la primera vez que se llama a getJobs().
  ¿Por qué? Porque `fetch-data.js` y `filters.js` necesitan los mismos datos.
  Si no guardáramos nada, cada uno haría su propia petición al servidor y
  estaríamos descargando el JSON dos veces sin necesidad.
*/
let jobsPromise = null

/**
 * Devuelve la lista de empleos del archivo data.json.
 * La petición se hace UNA sola vez; las siguientes llamadas reutilizan
 * la promesa que ya guardamos (esto se llama "cachear").
 */
export function getJobs() {
  // Si ya pedimos los datos antes, devolvemos aquella misma promesa.
  if (jobsPromise !== null) return jobsPromise

  jobsPromise = fetch('./data.json') // 1. Pedimos el archivo
    .then((response) => {
      // 2. `fetch` NO lanza error si el servidor responde 404 o 500,
      //    así que lo comprobamos nosotros a mano con `response.ok`.
      if (!response.ok) {
        throw new Error(`No se pudo cargar data.json (estado ${response.status})`)
      }
      return response.json() // 3. Convertimos el cuerpo de la respuesta en un array de objetos
    })

  return jobsPromise
}

/**
 * Pinta en pantalla la lista de empleos que reciba.
 * @param {Array} jobs - array de empleos ya filtrado (o completo)
 */
export function renderJobs(jobs) {
  // Vaciamos el contenedor antes de pintar, si no los empleos se irían
  // acumulando cada vez que el usuario cambia un filtro.
  listContainer.innerHTML = ''

  // Si no hay ningún empleo que coincida, avisamos al usuario.
  // Una lista vacía sin más parece que la página está rota.
  if (jobs.length === 0) {
    listContainer.innerHTML =
      '<li><p>No se han encontrado empleos que coincidan con la búsqueda.</p></li>'
    return // salimos de la función: no hay nada más que pintar
  }

  jobs.forEach((job) => {
    const li = document.createElement('li')

    /*
      Miramos si este empleo ya estaba aplicado ANTES de pintarlo.
      Si está en el Set, el botón nace directamente en estado "¡Aplicado!".
    */
    const isApplied = appliedJobs.has(job.id)

    /*
      El HTML de cada tarjeta nos lo daba el enunciado. Usamos `template literals`
      (las comillas invertidas ` `) para poder insertar variables con ${...}.

      Añadimos data-job-id al <article> para identificar el empleo desde
      apply-button.js aunque el DOM se haya rehecho.

      Si ya estaba aplicado, el botón se renderiza con el texto "¡Aplicado!",
      la clase "is-applied" y el atributo disabled.
    */
    li.innerHTML = `
      <article class="job-listing-card" data-job-id="${job.id}">
        <div>
          <h3>${job.titulo}</h3>
          <small>${job.empresa} | ${job.ubicacion}</small>
          <p>${job.descripcion}</p>
        </div>
        <button class="button-apply-job${isApplied ? ' is-applied' : ''}" ${isApplied ? 'disabled' : ''}>
          ${isApplied ? '¡Aplicado!' : 'Aplicar'}
        </button>
      </article>
    `

    listContainer.appendChild(li) // Metemos el <li> ya construido dentro del <ul>
  })
}

/*
  Al cargar la página mostramos todos los empleos, sin ningún filtro aplicado.
  `.catch()` recoge cualquier error de la cadena de arriba (sin conexión,
  JSON mal formado, archivo que no existe...) para que la página no se quede en blanco.
*/
getJobs()
  .then((jobs) => renderJobs(jobs))
  .catch((error) => {
    console.error('Error al cargar los empleos:', error)
    listContainer.innerHTML = '<li><p>Ha ocurrido un error al cargar los empleos.</p></li>'
  })
