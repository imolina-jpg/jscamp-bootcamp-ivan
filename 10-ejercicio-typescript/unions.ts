/* Octavo ejercicio: union types y type narrowing avanzado */

import type { Job } from './objects.ts'

import { searchJobs } from './functions.ts'

// Esto es un "discriminated union": las dos formas comparten la propiedad
// `success`, y su valor (true o false) es lo que le dice a TypeScript en cual
// de las dos estamos. Por eso el caso de error no tiene `jobs` ni `count`.
export type SearchResult =
  | { success: true; jobs: Job[]; count: number }
  | { success: false; error: string }

// Función que devuelve SearchResult
export function safeSearch(jobs: Job[], searchTerm: string): SearchResult {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return {
      success: false,
      error: 'El término de búsqueda no puede estar vacío',
    }
  }

  const results = searchJobs(jobs, searchTerm)

  return {
    success: true,
    jobs: results,
    count: results.length,
  }
}

// Función para mostrar resultados usando type narrowing
export function displaySearchResults(result: SearchResult): void {
  // La plantilla comprobaba `result.succes` (sin la segunda s). En JavaScript
  // eso es siempre undefined y siempre entraria por el else; TypeScript lo pilla
  // porque esa propiedad no existe en ninguna de las dos ramas del union.
  if (result.success) {
    // Aqui dentro TypeScript ya sabe que estamos en el caso de exito, asi que
    // nos deja usar count y jobs sin comprobar nada mas.
    console.log(`Encontrados ${result.count} empleos:`)
    result.jobs.forEach((job) => {
      console.log(`- ${job.title} en ${job.company}`)
    })
  } else {
    console.error(`Error: ${result.error}`)
  }
}
