/* Sexto ejercicio: interfaces */

import type { Job } from './objects.ts'
import type { ApplicationStatus, ExperienceLevel, Technology } from './types.ts'

import {
  filterByExperience,
  filterByMinSalary,
  filterByTechnology,
  searchJobs,
} from './functions.ts'

// Interface para servicios de búsqueda
// Una interface es un contrato: dice que metodos tiene que tener el objeto y
// con que firma. Si searchService no cumpliera alguno, TypeScript nos avisaria.
export interface JobSearchService {
  searchJobs(jobs: Job[], searchTerm: string): Job[]
  filterByExperience(jobs: Job[], level: ExperienceLevel): Job[]
  filterByMinSalary(jobs: Job[], minSalary: number): Job[]
  filterByTechnology(jobs: Job[], tech: Technology): Job[]
}

export const searchService: JobSearchService = {
  searchJobs,
  filterByExperience,
  filterByMinSalary,
  filterByTechnology,
}

// Interface para aplicación a empleo
export interface JobApplication {
  id: string
  jobId: string
  candidateId: string
  status: ApplicationStatus
  appliedDate: Date
  coverLetter?: string
}

// Interface que extiende Job con propiedades adicionales
// Con `extends` heredamos todas las propiedades de Job y solo escribimos las
// nuevas. Es la ventaja de las interfaces: componer contratos sin repetirse.
export interface DetailedJob extends Job {
  benefits: string[]
  requirements: string[]
  applicationDeadline?: Date
}
