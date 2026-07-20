import express from 'express'
import { jobsRouter } from './routes/jobs.js'
import { corsMiddleware } from './middlewares/cors.js'
import { DEFAULTS } from './config.js'

// ============================================================================
// PUNTO DE ENTRADA
// ============================================================================
// Gracias al patrón MVC, este archivo se queda cortísimo: solo configura la
// aplicación y delega. Toda la lógica está repartida en routes/, controllers/
// y models/, cada uno con su responsabilidad.
// ============================================================================

const app = express()

// --- Middlewares ------------------------------------------------------------
// EL ORDEN IMPORTA: Express ejecuta los middlewares en el orden en que se
// registran. Estos tienen que ir ANTES que las rutas, porque preparan la
// petición para que cuando llegue al controlador ya venga lista.

// Sin esto, req.body sería undefined. Express es minimalista y no parsea el
// cuerpo de las peticiones por defecto: no sabe si le llega JSON, un
// formulario o un archivo binario, así que hay que decírselo.
app.use(express.json())

// Permite que un frontend en otro origen (localhost:5173, midu.dev...) pueda
// consumir esta API. Ver middlewares/cors.js.
app.use(corsMiddleware())

// Express manda una cabecera "X-Powered-By: Express" en cada respuesta.
// Quitarla es una buena práctica de seguridad: no hace falta ir anunciando
// con qué está hecho el servidor.
app.disable('x-powered-by')

// --- Rutas ------------------------------------------------------------------
// Todo lo que empiece por /jobs se lo pasamos al router correspondiente.
// Si mañana añadimos usuarios, sería otra línea igual: app.use('/users', ...)
app.use('/jobs', jobsRouter)

// Este middleware va EL ÚLTIMO a propósito: si una petición llega hasta aquí
// es que no ha coincidido con ninguna ruta de arriba.
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// --- Arranque ---------------------------------------------------------------
// En producción (Vercel), la app corre como una función serverless: es la
// plataforma quien la levanta, y llamar a app.listen() daría problemas.
// Por eso solo escuchamos cuando NO estamos en producción.
const PORT = process.env.PORT ?? DEFAULTS.PORT

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Servidor levantado en http://localhost:${PORT}`)
  })
}

// Vercel necesita la app exportada para poder manejar las peticiones.
export default app
