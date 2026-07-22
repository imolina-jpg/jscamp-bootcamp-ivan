/* Noveno ejercicio: tuplas */

import type { Job } from './objects.ts'

// Una tupla es un array con longitud fija y un tipo por posicion. Ademas
// podemos poner nombre a cada posicion: no cambia nada al ejecutar, pero el
// editor nos recuerda cual es cual cuando pasamos el raton por encima.

// Tupla para coordenadas de ubicación
export type Coordinates = [latitud: number, longitud: number]

// Tupla para rango de salario
export type SalaryRange = [minimo: number, maximo: number]

// Función que devuelve el rango de salarios
export function getSalaryRange(jobs: Job[]): SalaryRange {
  const salaries = jobs
    .map((job) => job.salary)
    // `salary is number` es un type guard: le confirma a TypeScript que despues
    // de este filter ya no queda ningun undefined, asi que salaries es number[]
    // y podemos usarlo sin ningun `any` ni casteo raro.
    .filter((salary): salary is number => salary !== undefined)

  if (salaries.length === 0) {
    return [0, 0]
  }

  const min = Math.min(...salaries)
  const max = Math.max(...salaries)

  return [min, max]
}
