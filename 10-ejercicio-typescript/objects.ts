/* Segundo ejercicio: objetos */

// Usamos `import type` porque solo traemos tipos, no codigo que se ejecute.
// Asi TypeScript los borra al compilar y no queda ningun import en el JS final.
import type { ExperienceLevel, WorkMode, Technology } from './types.ts'

// Un `type` de objeto es un contrato: describe que propiedades tiene que tener
// el objeto y de que tipo es cada una. El `?` marca las propiedades opcionales
// (pueden faltar, pero si vienen tienen que respetar su tipo).
export type Job = {
  id: string
  title: string
  company: string
  location: string
  description: string
  salary?: number // opcional: hay ofertas que no publican salario
  technologies: Technology[]
  experienceLevel: ExperienceLevel
  workMode: WorkMode
  isActive: boolean
  postedDate: Date
}

export type Company = {
  id: string
  name: string
  description: string
  website?: string
  employees: number
  foundedYear: number
}

export type Candidate = {
  id: string
  name: string
  email: string
  phone?: string
  skills: Technology[]
  experienceYears: number
  resume?: string
}
