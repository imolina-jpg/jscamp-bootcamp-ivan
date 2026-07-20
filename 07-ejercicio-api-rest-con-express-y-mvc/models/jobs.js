import jobsJSON from '../jobs.json' with { type: 'json' }
import { randomUUID } from 'node:crypto'

// ============================================================================
// MODELO
// ============================================================================
// El modelo es el ÚNICO que sabe de dónde salen los datos. No sabe nada de
// HTTP: aquí no hay req, ni res, ni códigos de estado. Solo entra y sale
// información.
//
// La gracia de esto es que si mañana cambiamos el jobs.json por una base de
// datos SQL de verdad, solo hay que reescribir ESTE archivo. El controlador y
// las rutas se quedan exactamente igual.
// ============================================================================

// Copiamos el array del JSON a una variable nuestra:
// no queremos modificar el módulo importado, que es de solo lectura.
//
// Ojo: los cambios viven solo en memoria. Al reiniciar el servidor, el
// jobs.json original vuelve a mandar. Es normal hasta que veamos bases de datos.
const jobs = [...jobsJSON]

export class JobModel {
  // Métodos estáticos = se llaman sobre la clase (JobModel.getAll()) sin tener
  // que hacer un `new JobModel()`. Como aquí no guardamos estado por instancia,
  // no tiene sentido crear objetos.

  /**
   * Devuelve los jobs aplicando filtros y paginación.
   * Devuelve { data, total }, donde total es cuántos hay ANTES de paginar:
   * así el cliente sabe cuántos resultados existen en total.
   */
  static getAll({ text, title, level, technology, limit, offset } = {}) {
    let resultado = jobs

    // --- Filtro por título ------------------------------------------------
    // includes() y no ===, porque buscamos que el título CONTENGA el texto.
    // toLowerCase() en ambos lados para no distinguir mayúsculas.
    if (title) {
      const busqueda = title.toLowerCase()
      resultado = resultado.filter((job) => job.titulo.toLowerCase().includes(busqueda))
    }

    // --- Búsqueda libre: mira en título Y descripción ----------------------
    // Es el típico buscador general: el usuario escribe "frontend" y le da
    // igual si la palabra aparece en el título o en la descripción.
    if (text) {
      const busqueda = text.toLowerCase()
      resultado = resultado.filter(
        (job) =>
          job.titulo.toLowerCase().includes(busqueda) ||
          job.descripcion.toLowerCase().includes(busqueda)
      )
    }

    // --- Filtro por tecnología ---------------------------------------------
    // job.data.technology es un ARRAY (["react", "node"...]), así que aquí
    // comparamos con === contra cada elemento, no buscamos un substring.
    // El ?. evita que pete si algún job no trae data o technology.
    if (technology) {
      const busqueda = technology.toLowerCase()
      resultado = resultado.filter((job) =>
        job.data?.technology?.some((tech) => tech.toLowerCase() === busqueda)
      )
    }

    // --- Filtro por nivel (junior / senior...) -----------------------------
    if (level) {
      const busqueda = level.toLowerCase()
      resultado = resultado.filter((job) => job.data?.nivel?.toLowerCase() === busqueda)
    }

    // total = cuántos coinciden con los filtros, ANTES de cortar la página.
    const total = resultado.length

    // --- Paginación ---------------------------------------------------------
    // Va la última: primero se filtra y luego se corta el trozo. Si lo
    // hiciéramos al revés, estaríamos paginando la lista sin filtrar.
    const data = resultado.slice(offset, offset + limit)

    return { data, total }
  }

  static getById(id) {
    // find() devuelve undefined si no encuentra nada. Quien llame a esto es
    // quien decide qué hacer con ese undefined (devolver un 404, por ejemplo).
    return jobs.find((job) => job.id === id)
  }

  static create({ titulo, empresa, ubicacion, descripcion, data, content }) {
    const newJob = {
      // El id lo genera SIEMPRE el servidor, nunca el cliente: es la única
      // forma de garantizar que no se repita.
      id: randomUUID(),
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content,
    }

    jobs.push(newJob)
    return newJob
  }

  /**
   * PUT: reemplaza el job entero.
   * Se conserva el id original, porque cambiar el id sería crear otro recurso.
   */
  static update(id, { titulo, empresa, ubicacion, descripcion, data, content }) {
    const index = jobs.findIndex((job) => job.id === id)
    // -1 es lo que devuelve findIndex cuando no encuentra nada.
    if (index === -1) return null

    const updatedJob = { id, titulo, empresa, ubicacion, descripcion, data, content }

    jobs[index] = updatedJob
    return updatedJob
  }

  /**
   * PATCH: actualiza solo los campos que llegan.
   */
  static partialUpdate(id, cambios) {
    const index = jobs.findIndex((job) => job.id === id)
    if (index === -1) return null

    // Aquí está la diferencia con update(): el spread copia primero el job que
    // ya existía y luego pisa SOLO las claves que vengan en `cambios`.
    // Lo que no venga, se queda como estaba.
    // El id va al final para que no lo pueda sobrescribir el cliente.
    const updatedJob = { ...jobs[index], ...cambios, id }

    jobs[index] = updatedJob
    return updatedJob
  }

  static delete(id) {
    const index = jobs.findIndex((job) => job.id === id)
    if (index === -1) return false

    // splice quita 1 elemento a partir de esa posición.
    jobs.splice(index, 1)
    // Devolvemos true/false para que el controlador sepa si existía o no.
    return true
  }
}
