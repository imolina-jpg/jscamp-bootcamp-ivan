/* Quinto ejercicio: parametros opcionales y valores por defecto */

import type { Job } from './objects.ts'
import type { ExperienceLevel, Technology, WorkMode } from './types.ts'

import {
  searchJobs,
  filterByExperience,
  filterByTechnology,
  filterByMinSalary,
} from './functions.ts'

// Todas las opciones de busqueda llevan `?`: se pueden pasar unas, otras o
// ninguna. `advancedSearch(jobs, {})` es igual de valido que pasarlas todas.
export type SearchOptions = {
  text?: string
  level?: ExperienceLevel
  technology?: Technology
  minSalary?: number
  workMode?: WorkMode
}

// Función de búsqueda avanzada con opcionales
export function advancedSearch(jobs: Job[], options: SearchOptions): Job[] {
  let results = jobs

  // Cada `if` es tambien un type narrowing: dentro del if, TypeScript ya sabe
  // que la opcion no es undefined y nos deja pasarla a la funcion de filtrado.
  if (options.text) {
    results = searchJobs(results, options.text)
  }

  if (options.level) {
    results = filterByExperience(results, options.level)
  }

  if (options.technology) {
    results = filterByTechnology(results, options.technology)
  }

  if (options.minSalary) {
    results = filterByMinSalary(results, options.minSalary)
  }

  if (options.workMode) {
    results = results.filter((job) => job.workMode === options.workMode)
  }

  return results
}

// Función con valores por defecto
// Un parametro con valor por defecto ya es opcional, por eso NO lleva `?`:
// se puede llamar getRecentJobs(jobs) y `days` valdra 30.
export function getRecentJobs(jobs: Job[], days: number = 30): Job[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return jobs.filter((job) => job.postedDate >= cutoffDate)
}
