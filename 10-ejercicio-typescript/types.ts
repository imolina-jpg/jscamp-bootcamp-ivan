/* Primer ejercicio: tipos primitivos y literales */

// Un "literal type" no dice "esto es un string", dice "esto es EXACTAMENTE
// uno de estos textos". Al juntarlos con | creamos una union de literales:
// TypeScript solo aceptara esos valores y ademas nos dara autocompletado.
export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead'

export type WorkMode = 'remoto' | 'presencial' | 'hibrido'

export type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected'

export type Technology =
  | 'react'
  | 'node'
  | 'python'
  | 'java'
  | 'javascript'
  | 'typescript'
  | 'flutter'
  | 'android'
  | 'ios'
  | 'swift'
  | 'kotlin'
  | 'dart'
  | 'go'
  | 'rust'
  | 'php'
  | 'ruby'
  | 'c#'
  // 'css' y 'tailwind' no estan en la lista del enunciado, pero si aparecen en
  // los datos de arrays.ts. Si no las anadimos aqui, esos datos no encajarian
  // con el tipo: es justo lo que hace TypeScript, avisarnos de la incoherencia.
  | 'css'
  | 'tailwind'
