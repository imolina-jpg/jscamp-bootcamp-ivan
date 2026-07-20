// ============================================================================
// Configuración centralizada
// ============================================================================
// La idea de tener este archivo es no dejar "números mágicos" sueltos por el
// código. Si mañana queremos que la API devuelva 20 resultados por página en
// vez de 10, se cambia AQUÍ y ya está, sin tocar los controladores.
// ============================================================================

export const DEFAULTS = {
  // Cuántos jobs devuelve /jobs si el cliente no pide un limit concreto.
  LIMIT_PAGINATION: 10,
  // Desde qué posición empieza a contar si no se pide un offset.
  LIMIT_OFFSET: 0,
  // Puerto por defecto. En producción lo manda la plataforma por process.env.
  PORT: 1234,
}

// Orígenes desde los que se permite consumir esta API (ver middlewares/cors.js).
// Un "origen" es protocolo + dominio + puerto: http://localhost:3000 y
// http://localhost:5173 son orígenes DISTINTOS aunque los dos sean localhost.
export const ACCEPTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:1234',
  'https://midu.dev',
  'http://jscamp.dev',
  'http://localhost:5173',
]
