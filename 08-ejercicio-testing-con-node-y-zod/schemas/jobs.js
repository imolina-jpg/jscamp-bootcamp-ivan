import z from 'zod'

const jobSchema = z.object({
  titulo: z.string({ message: 'El título debe ser un texto' }).min(3).max(100),
  empresa: z.string(),
  ubicacion: z.string(),
  descripcion: z.string().optional(),
  content: z.string().optional(),
  data: z
    .object({
      technology: z.array(z.string()),
      modalidad: z.string().optional(),
      nivel: z.string().optional(),
    })
    .optional(),
})

// safeParse en vez de parse: así no lanza excepción y el middleware decide
// qué responder mirando result.success
export function validateJob(input) {
  return jobSchema.safeParse(input)
}

// partial() hace opcionales los campos de primer nivel, que es justo lo que
// necesita el PATCH: validar solo lo que llega
export function validatePartialJob(input) {
  return jobSchema.partial().safeParse(input)
}
