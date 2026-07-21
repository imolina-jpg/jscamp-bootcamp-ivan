/* Cuarto ejercicio: funciones tipadas */

import type { Job } from './objects.ts'
import type { ExperienceLevel, Technology } from './types.ts'

// La regla de oro del modulo: tipa los parametros y deja que TypeScript infiera
// el resto. Aun asi aqui escribimos tambien el retorno (`: Job[]`) para dejar
// el contrato bien claro: entra una lista de empleos y sale otra lista filtrada.
export function filterByExperience(jobs: Job[], level: ExperienceLevel): Job[] {
  return jobs.filter((job) => job.experienceLevel === level)
}

// Función para filtrar por tecnología
export function filterByTechnology(jobs: Job[], tech: Technology): Job[] {
  // El .toLowerCase() de la plantilla sobraba: al tipar `tech` como Technology
  // solo pueden llegar valores ya en minusculas, y ademas toLowerCase() devuelve
  // un string generico que includes() ya no aceptaria.
  return jobs.filter((job) => job.technologies.includes(tech))
}

// Función para filtrar por salario mínimo
export function filterByMinSalary(jobs: Job[], minSalary: number): Job[] {
  // `salary` es opcional, por eso hay que descartar undefined antes de comparar.
  return jobs.filter((job) => job.salary !== undefined && job.salary >= minSalary)
}

// Función para buscar por texto
export function searchJobs(jobs: Job[], searchTerm: string): Job[] {
  const term = searchTerm.toLowerCase()
  return jobs.filter(
    (job) => job.title.toLowerCase().includes(term) || job.description.toLowerCase().includes(term)
  )
}
