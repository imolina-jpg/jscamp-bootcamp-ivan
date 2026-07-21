/* Decimo ejercicio: utility types */

import type { Job } from './objects.ts'

// Los "utility types" son tipos que TypeScript trae de serie y que fabrican un
// tipo nuevo a partir de otro. Aqui usamos Partial, Pick y Readonly.

// Partial<Job> = un Job con TODAS sus propiedades opcionales. Perfecto para una
// actualizacion: puedes mandar solo el salario, o solo el titulo, o los dos.
export function updateJob(job: Job, updates: Partial<Job>): Job {
  return { ...job, ...updates }
}

// Pick<Job, ...> = coge solo esas propiedades de Job. Si manana Job cambia el
// tipo de `title`, JobSummary se entera solo: no hay que tocar nada aqui.
export type JobSummary = Pick<Job, 'id' | 'title' | 'company' | 'location'>

export function getJobSummaries(jobs: Job[]): JobSummary[] {
  return jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
  }))
}

// Readonly<Job> = un Job cuyas propiedades no se pueden reasignar.
export type ReadonlyJob = Readonly<Job>

export function displayJob(job: ReadonlyJob): void {
  console.log(`${job.title} - ${job.company}`)
  // La plantilla hacia aqui `job.title = 'Nuevo título'`. Con ReadonlyJob eso
  // es un error de compilacion (y encima era un efecto secundario que no pinta
  // nada en una funcion que solo tiene que mostrar datos), asi que fuera.
}
