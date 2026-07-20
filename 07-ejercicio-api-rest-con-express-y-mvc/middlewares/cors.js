import cors from 'cors'
import { ACCEPTED_ORIGINS } from '../config.js'

// ============================================================================
// MIDDLEWARE DE CORS  (quinto ejercicio)
// ============================================================================
// El navegador, por seguridad, bloquea las peticiones entre orígenes
// distintos. Un "origen" es protocolo + dominio + puerto, así que un frontend
// en http://localhost:5173 y esta API en http://localhost:1234 son orígenes
// diferentes aunque los dos estén en tu ordenador.
//
// Esto NO es un error de Express ni nuestro: es el navegador protegiendo al
// usuario. CORS es el mecanismo para levantar esa restricción a propósito,
// mediante cabeceras que dicen "de estos orígenes sí me fío".
//
// Nota: esto solo afecta al navegador. curl, Postman o Bruno se saltan CORS
// porque no aplican esa política de seguridad.
// ============================================================================

/**
 * Devuelve el middleware de CORS ya configurado.
 *
 * Podríamos hacer simplemente app.use(cors()), que permite CUALQUIER origen
 * ("*"). Funciona, pero es abrir la puerta a todo el mundo. Como el ejercicio
 * nos da una lista concreta de orígenes, los limitamos: es el principio de
 * mínimo privilegio, dar solo los permisos estrictamente necesarios.
 */
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      // Si el origen está en nuestra lista blanca, lo dejamos pasar.
      if (acceptedOrigins.includes(origin)) {
        // El paquete cors usa el estilo callback(error, permitido).
        // null como primer argumento significa "no ha habido ningún error".
        return callback(null, true)
      }

      // Cuando la petición NO viene de un navegador (curl, Postman, o el
      // propio servidor llamándose a sí mismo), origin es undefined.
      // En ese caso no hay nada que proteger, así que la dejamos pasar.
      if (!origin) {
        return callback(null, true)
      }

      // Origen desconocido: respondemos SIN las cabeceras de CORS.
      //
      // Aquí lo intuitivo sería lanzar un error, pero eso hace que Express
      // devuelva un 500 Internal Server Error, y un 500 significa "el
      // servidor se ha roto"... y no se ha roto nada: simplemente no
      // autorizamos ese origen. Al no mandar la cabecera, el navegador
      // bloquea la respuesta él solito, que es exactamente cómo funciona
      // CORS.
      //
      // Conviene tener claro que CORS NO es un sistema de seguridad del
      // servidor: solo lo respetan los navegadores. Cualquiera con curl
      // puede leer esta API igualmente. Para proteger datos de verdad hace
      // falta autenticación, que es otra cosa.
      return callback(null, false)
    },
  })
