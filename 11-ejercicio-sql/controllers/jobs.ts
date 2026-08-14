import type { Request, Response } from 'express'
import { JobModel } from '../models/job'
import type { JobQuery } from '../types'

// Convierte un query param de texto a número entero.
// Si el cliente manda algo que no es un entero ("abc", "1.5", ""), devolvemos
// undefined y el modelo aplicará su valor por defecto en vez de romperse.
const toInteger = (value?: string): number | undefined => {
  if (value === undefined || value.trim() === '') return undefined

  const parsed = Number(value)

  return Number.isInteger(parsed) ? parsed : undefined
}

export class JobController {
  // GET /jobs
  // Query params tipados
  static async getAll(req: Request<{}, {}, {}, JobQuery>, res: Response): Promise<void> {
    const { tech, modality, level, limit, offset } = req.query
    const jobs = await JobModel.getAll({
      tech,
      modality,
      level,
      limit: toInteger(limit),
      offset: toInteger(offset),
    })
    res.json(jobs)
  }

  // GET /jobs/:id
  // Params tipados
  static async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params
    const job = await JobModel.getById(id)

    if (!job) {
      res.status(404).json({ message: 'Job not found' })
      return
    }

    res.json(job)
  }

  // POST /jobs
  // El body ya viene validado por el middleware
  static async create(req: Request, res: Response): Promise<void> {
    const newJob = await JobModel.create(req.body)
    res.status(201).json(newJob)
  }

  // PATCH /jobs/:id
  static async update(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params
    const updatedJob = await JobModel.update(id, req.body)

    if (!updatedJob) {
      res.status(404).json({ message: 'Job not found' })
      return
    }

    res.json(updatedJob)
  }

  // DELETE /jobs/:id
  static async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params
    const deleted = await JobModel.delete(id)

    if (!deleted) {
      res.status(404).json({ message: 'Job not found' })
      return
    }

    res.status(204).send()
  }
}
