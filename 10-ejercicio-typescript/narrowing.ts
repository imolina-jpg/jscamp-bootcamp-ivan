/* Septimo ejercicio: type narrowing */

import type { Candidate, Job } from './objects.ts'

// Validar candidato para un empleo
export function isQualified(candidate: Candidate, job: Job): boolean {
  // La plantilla traia 'junlor', 'mib' y 'seni0r' escritos con erratas. Con
  // `any` nadie se daba cuenta; en cuanto job.experienceLevel es un literal
  // ExperienceLevel, TypeScript canta que esos valores no existen.
  const requiredYears =
    job.experienceLevel === 'junior'
      ? 0
      : job.experienceLevel === 'mid'
        ? 2
        : job.experienceLevel === 'senior'
          ? 5
          : 8

  if (candidate.experienceYears < requiredYears) {
    return false
  }

  // Verificar si tiene al menos una tecnología requerida
  const hasRequiredSkill = job.technologies.some((tech) => candidate.skills.includes(tech))

  return hasRequiredSkill
}

// Función con type guards - formatear salario
// El salario puede no venir, asi que aceptamos `number | undefined` y hacemos
// narrowing: tras el if, TypeScript ya sabe que abajo `salary` es un number.
export function formatSalary(salary: number | undefined): string {
  if (salary === undefined) {
    return 'Salario no especificado'
  }

  return `€${salary.toLocaleString()}`
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
