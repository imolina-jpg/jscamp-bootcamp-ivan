import crypto from 'node:crypto'
import { db } from '../db/database'
import type { CreateJobDTO, Job, JobContent, JobData, JobFilters, UpdateJobDTO } from '../types'

// ================================
// FORMA DE LAS FILAS QUE DEVUELVE SQL
// ================================

// La base de datos devuelve columnas planas; la API espera un objeto anidado
// (data, content...). Por eso hace falta consultar Y MAPEAR.
interface JobRow {
  id: string
  title: string
  company: string
  location: string
  description: string
  modality: JobData['modality']
  level: JobData['level']
  // GROUP_CONCAT junta todas las tecnologías del job en un solo texto:
  // "react,node,javascript". Si el job no tiene ninguna, viene null.
  technologies: string | null
}

interface JobContentRow extends JobRow {
  content_description: string | null
  responsibilities: string | null
  requirements: string | null
  about: string | null
}

// ================================
// MAPEADORES (fila SQL -> objeto de la API)
// ================================

const toJob = (row: JobRow): Job => ({
  id: row.id,
  title: row.title,
  company: row.company,
  location: row.location,
  description: row.description,
  data: {
    technology: row.technologies ? row.technologies.split(',') : [],
    modality: row.modality,
    level: row.level,
  },
})

const toJobWithContent = (row: JobContentRow): Job => {
  const job = toJob(row)

  // El LEFT JOIN deja los campos a null si el job no tiene contenido extra.
  if (row.content_description !== null) {
    job.content = {
      description: row.content_description,
      responsibilities: row.responsibilities!,
      requirements: row.requirements!,
      about: row.about!,
    }
  }

  return job
}

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    // Vamos montando las condiciones y sus valores por separado.
    // Los valores NUNCA se pegan al SQL: van como parámetros (?).
    const conditions: string[] = []
    const values: unknown[] = []

    if (filters?.tech) {
      // EXISTS mira en la tabla intermedia sin romper el GROUP_CONCAT:
      // filtramos por una tecnología pero seguimos devolviéndolas todas.
      conditions.push(`EXISTS (
        SELECT 1 FROM job_technologies t2
        WHERE t2.job_id = j.id AND LOWER(t2.technology) = LOWER(?)
      )`)
      values.push(filters.tech)
    }

    if (filters?.modality) {
      conditions.push('j.modality = ?')
      values.push(filters.modality)
    }

    if (filters?.level) {
      conditions.push('j.level = ?')
      values.push(filters.level)
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // Paginación: clamp para no aceptar valores absurdos ni negativos.
    // Por defecto un page razonable si el cliente no manda nada.
    const DEFAULT_LIMIT = 20
    const MAX_LIMIT = 100
    const limit = Math.min(Math.max(filters?.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT)
    const offset = Math.max(filters?.offset ?? 0, 0)

    // LEFT JOIN (y no JOIN a secas) para que un job sin tecnologías
    // siga apareciendo en el listado.
    // GROUP BY es lo que hace que GROUP_CONCAT agrupe por job y no lo junte todo.
    const jobs = db
      .prepare(
        `SELECT
           j.id, j.title, j.company, j.location, j.description, j.modality, j.level,
           GROUP_CONCAT(t.technology) AS technologies
         FROM jobs j
         LEFT JOIN job_technologies t ON t.job_id = j.id
         ${where}
         GROUP BY j.id
         ORDER BY j.title ASC
         LIMIT ? OFFSET ?`
      )
      .all(...values, limit, offset) as JobRow[]

    return jobs.map(toJob)
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<Job | undefined> {
    const row = db
      .prepare(
        `SELECT
           j.id, j.title, j.company, j.location, j.description, j.modality, j.level,
           GROUP_CONCAT(t.technology) AS technologies,
           c.description AS content_description,
           c.responsibilities, c.requirements, c.about
         FROM jobs j
         LEFT JOIN job_technologies t ON t.job_id = j.id
         LEFT JOIN job_content c ON c.job_id = j.id
         WHERE j.id = ?
         GROUP BY j.id`
      )
      .get(id) as JobContentRow | undefined

    return row ? toJobWithContent(row) : undefined
  }

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...input,
    }

    // Crear un job toca tres tablas: o se insertan las tres o ninguna.
    const insert = db.transaction((job: Job) => {
      db.prepare(
        `INSERT INTO jobs (id, title, company, location, description, modality, level)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(
        job.id,
        job.title,
        job.company,
        job.location,
        job.description,
        job.data.modality,
        job.data.level
      )

      const insertTechnology = db.prepare(
        'INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)'
      )

      for (const technology of job.data.technology) {
        insertTechnology.run(job.id, technology)
      }

      if (job.content) {
        db.prepare(
          `INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).run(
          crypto.randomUUID(),
          job.id,
          job.content.description,
          job.content.responsibilities,
          job.content.requirements,
          job.content.about
        )
      }
    })

    insert(newJob)

    return newJob
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
    // Las tecnologías y el contenido se borran solos gracias al ON DELETE CASCADE.
    const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(id)

    // changes dice cuántas filas se han visto afectadas: 0 = ese id no existía.
    return result.changes > 0
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    const exists = db.prepare('SELECT id FROM jobs WHERE id = ?').get(id)
    if (!exists) return null

    const update = db.transaction((changes: UpdateJobDTO) => {
      // Solo actualizamos las columnas que llegan en el body (PATCH parcial).
      const fields: string[] = []
      const values: unknown[] = []

      const columns = {
        title: changes.title,
        company: changes.company,
        location: changes.location,
        description: changes.description,
        modality: changes.data?.modality,
        level: changes.data?.level,
      }

      for (const [column, value] of Object.entries(columns)) {
        if (value !== undefined) {
          fields.push(`${column} = ?`)
          values.push(value)
        }
      }

      if (fields.length > 0) {
        // El WHERE es obligatorio: sin él, un UPDATE cambia TODAS las filas.
        db.prepare(`UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`).run(...values, id)
      }

      // Las tecnologías son una lista: se reemplaza entera.
      if (changes.data?.technology) {
        db.prepare('DELETE FROM job_technologies WHERE job_id = ?').run(id)

        const insertTechnology = db.prepare(
          'INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)'
        )

        for (const technology of changes.data.technology) {
          insertTechnology.run(id, technology)
        }
      }

      if (changes.content) {
        JobModel.saveContent(id, changes.content)
      }
    })

    update(input)

    return (await JobModel.getById(id)) ?? null
  }

  // Guardar el contenido extra: actualizar si ya existe, insertarlo si no
  private static saveContent(jobId: string, content: JobContent): void {
    const current = db.prepare('SELECT id FROM job_content WHERE job_id = ?').get(jobId) as
      | { id: string }
      | undefined

    if (current) {
      db.prepare(
        `UPDATE job_content
         SET description = ?, responsibilities = ?, requirements = ?, about = ?
         WHERE job_id = ?`
      ).run(
        content.description,
        content.responsibilities,
        content.requirements,
        content.about,
        jobId
      )
      return
    }

    db.prepare(
      `INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      crypto.randomUUID(),
      jobId,
      content.description,
      content.responsibilities,
      content.requirements,
      content.about
    )
  }
}
