// ================================
// TIPOS PARA LA API EXPRESS
// ================================

// ================================
// ENTIDADES
// ================================

export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  data: JobData
  content?: JobContent
}

export interface JobData {
  technology: string[]
  modality: 'remote' | 'onsite' | 'hybrid'
  level: 'junior' | 'mid' | 'senior'
}

export interface JobContent {
  description: string
  responsibilities: string
  requirements: string
  about: string
}

// ================================
// DTOs
// ================================

// Para crear - sin id
export type CreateJobDTO = Omit<Job, 'id'>

// Para actualizar - todo opcional
export type UpdateJobDTO = Partial<CreateJobDTO>

// ================================
// FILTROS
// ================================

// Lo que el modelo espera recibir: la paginación ya convertida a números.
export interface JobFilters {
  tech?: string
  modality?: JobData['modality']
  level?: JobData['level']
  limit?: number
  offset?: number
}

// Lo que llega DE VERDAD en req.query: en una URL todo es texto.
// "?limit=20" no es el número 20, es la cadena "20", así que el controlador
// tiene que convertirlo antes de pasárselo al modelo.
export interface JobQuery {
  tech?: string
  modality?: JobData['modality']
  level?: JobData['level']
  limit?: string
  offset?: string
}

// ================================
// RESPUESTAS DE API
// ================================

export interface ApiError {
  message: string
  errors?: unknown[]
}
