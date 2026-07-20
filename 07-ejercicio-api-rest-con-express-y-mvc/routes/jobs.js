import { Router } from 'express'
import { JobController } from '../controllers/jobs.js'

// ============================================================================
// RUTAS
// ============================================================================
// Las rutas son solo el "mapa": conectan un método HTTP + una URL con el
// método del controlador que le toca. Aquí no hay lógica de ningún tipo, y
// justamente por eso este archivo se lee de un vistazo y te dice todo lo que
// la API sabe hacer.
//
// Ojo: las rutas son relativas. En app.js montamos este router con
// app.use('/jobs', jobsRouter), así que aquí '/' ya significa '/jobs'.
// ============================================================================

export const jobsRouter = Router()

// Obtener todos los jobs (con filtros y paginación)  -> GET    /jobs
jobsRouter.get('/', JobController.getAll)

// Obtener un job por id                              -> GET    /jobs/:id
jobsRouter.get('/:id', JobController.getId)

// Crear un job                                       -> POST   /jobs
jobsRouter.post('/', JobController.create)

// Actualizar un job entero                           -> PUT    /jobs/:id
jobsRouter.put('/:id', JobController.update)

// Actualizar parcialmente un job                     -> PATCH  /jobs/:id
jobsRouter.patch('/:id', JobController.partialUpdate)

// Eliminar un job                                    -> DELETE /jobs/:id
jobsRouter.delete('/:id', JobController.delete)
