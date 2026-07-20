import { JobModel } from '../models/jobs.js'
import { DEFAULTS } from '../config.js'

// ============================================================================
// CONTROLADOR
// ============================================================================
// El controlador es el intermediario entre la petición HTTP y el modelo:
//   1. Saca los datos de la petición (req.params, req.query, req.body).
//   2. Se los pasa al modelo.
//   3. Decide qué responder y con qué código de estado.
//
// Aquí SÍ hay req y res, pero NO hay lógica de datos: no se filtra ni se
// busca nada a mano, de eso se encarga el modelo.
// ============================================================================

export class JobController {
  // -------------------------------------------------------------------------
  // GET /jobs  (primer ejercicio)
  // -------------------------------------------------------------------------
  static getAll(req, res) {
    // Express ya nos da los query params parseados en req.query. Con el
    // servidor nativo teníamos que construir un objeto URL a mano.
    const { text, title, technology, level } = req.query

    // MUY IMPORTANTE: los query params siempre llegan como STRING.
    // "5" no es 5, así que hay que convertir antes de usarlos en un slice().
    //
    // El || aplica el valor por defecto tanto si el parámetro no viene
    // (Number(undefined) es NaN) como si viene basura (?limit=hola -> NaN).
    // Los valores por defecto viven en config.js para no dejar números
    // mágicos sueltos por el código.
    const limit = Number(req.query.limit) || DEFAULTS.LIMIT_PAGINATION
    const offset = Number(req.query.offset) || DEFAULTS.LIMIT_OFFSET

    const { data, total } = JobModel.getAll({ text, title, technology, level, limit, offset })

    // Devolvemos también total, limit y offset, no solo el array: así el
    // frontend puede pintar "mostrando 10 de 34" y calcular las páginas.
    // res.json() ya pone el Content-Type y hace el JSON.stringify por nosotros.
    return res.json({ data, total, limit, offset })
  }

  // -------------------------------------------------------------------------
  // GET /jobs/:id  (segundo ejercicio)
  // -------------------------------------------------------------------------
  static getId(req, res) {
    // req.params son los parámetros dinámicos de la ruta (el :id).
    // No confundir con req.query, que son los de después del "?".
    const { id } = req.params

    const job = JobModel.getById(id)

    // Si no existe, 404. Devolver un 200 con el cuerpo vacío sería mentir.
    if (!job) return res.status(404).json({ error: 'Job not found' })

    return res.json(job)
  }

  // -------------------------------------------------------------------------
  // POST /jobs  (tercer ejercicio)
  // -------------------------------------------------------------------------
  static create(req, res) {
    // req.body solo existe si hemos registrado el middleware express.json()
    // en app.js. Sin él, esto sería undefined.
    const { titulo, empresa, ubicacion, descripcion, data, content } = req.body ?? {}

    // Nunca te fíes de lo que manda el cliente: hay que validar.
    // Si falta algo obligatorio, la culpa es de la petición -> 400, no 500.
    if (!titulo || !empresa) {
      return res.status(400).json({ error: 'Los campos "titulo" y "empresa" son obligatorios' })
    }

    const newJob = JobModel.create({ titulo, empresa, ubicacion, descripcion, data, content })

    // 201 Created, no 200: el código de estado también comunica. Le dice al
    // cliente "he creado un recurso nuevo", no solo "todo bien".
    return res.status(201).json(newJob)
  }

  // -------------------------------------------------------------------------
  // PUT /jobs/:id  (cuarto ejercicio)
  // -------------------------------------------------------------------------
  // PUT REEMPLAZA el recurso entero. Por eso exigimos los campos principales:
  // si el cliente no los manda, se perderían.
  static update(req, res) {
    const { id } = req.params
    const { titulo, empresa, ubicacion, descripcion, data, content } = req.body ?? {}

    if (!titulo || !empresa) {
      return res
        .status(400)
        .json({ error: 'PUT reemplaza el job entero: "titulo" y "empresa" son obligatorios' })
    }

    const updatedJob = JobModel.update(id, {
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content,
    })

    if (!updatedJob) return res.status(404).json({ error: 'Job not found' })

    return res.json(updatedJob)
  }

  // -------------------------------------------------------------------------
  // PATCH /jobs/:id  (cuarto ejercicio)
  // -------------------------------------------------------------------------
  // PATCH actualiza SOLO lo que le mandes. Aquí no exigimos campos concretos,
  // pero sí que venga algo: un PATCH con el body vacío no tiene sentido.
  static partialUpdate(req, res) {
    const { id } = req.params
    const cambios = req.body ?? {}

    if (Object.keys(cambios).length === 0) {
      return res.status(400).json({ error: 'No has enviado ningún campo que actualizar' })
    }

    const updatedJob = JobModel.partialUpdate(id, cambios)

    if (!updatedJob) return res.status(404).json({ error: 'Job not found' })

    return res.json(updatedJob)
  }

  // -------------------------------------------------------------------------
  // DELETE /jobs/:id  (cuarto ejercicio)
  // -------------------------------------------------------------------------
  static delete(req, res) {
    const { id } = req.params

    const borrado = JobModel.delete(id)

    if (!borrado) return res.status(404).json({ error: 'Job not found' })

    // 204 No Content: ha ido bien, pero no hay nada que devolver (el recurso
    // ya no existe). Por eso se usa .send() sin cuerpo y no .json().
    return res.status(204).send()
  }
}
