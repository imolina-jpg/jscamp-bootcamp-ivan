// ================================
// SEED: CREAR TABLAS E INSERTAR DATOS INICIALES
// ================================

import crypto from 'node:crypto'
import fs from 'node:fs'
import { db } from './database'
import type { JobData, JobContent } from '../types'

// En jobs.json los datos vienen "planos" (modality, level y technologies
// al mismo nivel), no anidados como en el tipo Job de la API.
interface JobSeed {
  id: string
  title: string
  company: string
  location: string
  description: string
  modality: JobData['modality']
  level: JobData['level']
  technologies: string[]
  content?: JobContent
}

const jobs: JobSeed[] = JSON.parse(fs.readFileSync('jobs.json', 'utf-8'))

// ================================
// 1. ESQUEMA
// ================================

// IF NOT EXISTS evita que el script falle la segunda vez que lo ejecutamos:
// si la tabla ya está en jobs.db, SQLite simplemente no hace nada.
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    company     TEXT NOT NULL,
    location    TEXT NOT NULL,
    description TEXT NOT NULL,
    -- CHECK es una validación dentro de la propia base de datos:
    -- la BD es la última línea de defensa, no solo el backend.
    modality    TEXT NOT NULL CHECK (modality IN ('remote', 'onsite', 'hybrid')),
    level       TEXT NOT NULL CHECK (level IN ('junior', 'mid', 'senior'))
  );

  -- Un job tiene VARIAS tecnologías, así que no caben en una columna:
  -- se modela con una tabla intermedia (relación muchos a muchos).
  CREATE TABLE IF NOT EXISTS job_technologies (
    job_id     TEXT NOT NULL,
    technology TEXT NOT NULL,
    -- Si se borra el job, sus tecnologías se borran con él (CASCADE).
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS job_content (
    id               TEXT PRIMARY KEY,
    job_id           TEXT NOT NULL,
    description      TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    requirements     TEXT NOT NULL,
    about            TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );
`)

// ================================
// 2. DATOS
// ================================

// Vaciamos antes de insertar para que el seed se pueda repetir sin
// chocar con la clave primaria (los ids vienen fijos desde jobs.json).
// Al borrar de `jobs`, el CASCADE limpia también las tablas hijas.
db.exec('DELETE FROM jobs')

// prepare() compila la consulta una sola vez y deja huecos (?) para los
// valores. Nunca se interpolan datos en el SQL: así se evita SQL Injection.
const insertJob = db.prepare(`
  INSERT INTO jobs (id, title, company, location, description, modality, level)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const insertTechnology = db.prepare(`
  INSERT INTO job_technologies (job_id, technology)
  VALUES (?, ?)
`)

const insertContent = db.prepare(`
  INSERT INTO job_content (id, job_id, description, responsibilities, requirements, about)
  VALUES (?, ?, ?, ?, ?, ?)
`)

// Una transacción agrupa todas las inserciones: o entran todas, o ninguna.
// Así nunca queda la base de datos a medias si algo falla por el camino.
const seed = db.transaction(() => {
  for (const job of jobs) {
    insertJob.run(
      job.id,
      job.title,
      job.company,
      job.location,
      job.description,
      job.modality,
      job.level
    )

    for (const technology of job.technologies) {
      insertTechnology.run(job.id, technology)
    }

    if (job.content) {
      insertContent.run(
        crypto.randomUUID(),
        job.id,
        job.content.description,
        job.content.responsibilities,
        job.content.requirements,
        job.content.about
      )
    }
  }
})

seed()

// ================================
// 3. COMPROBACIÓN
// ================================

const count = (table: string) =>
  (db.prepare(`SELECT COUNT(*) AS total FROM ${table}`).get() as { total: number }).total

console.log('✅ Base de datos inicializada (jobs.db)')
console.log(`   jobs: ${count('jobs')}`)
console.log(`   job_technologies: ${count('job_technologies')}`)
console.log(`   job_content: ${count('job_content')}`)
