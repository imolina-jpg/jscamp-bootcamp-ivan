import { createServer } from 'node:http'
import { randomUUID } from 'node:crypto'
import { json } from 'node:stream/consumers'

// ============================================================================
// API de usuarios con Node.js puro (sin Express)
// ============================================================================
// Endpoints:
//   GET  /users    -> lista de usuarios (con filtros opcionales por query params)
//   POST /users    -> crea un usuario nuevo
//   GET  /health   -> health check (estado + uptime del servidor)
//   *              -> 404 Ruta no encontrada
//
// Todo con módulos nativos. Express, más adelante, no hace "magia": hace
// exactamente esto por debajo.
// ============================================================================

// process.loadEnvFile() lee el archivo .env y mete sus valores en process.env.
// Es nativo de Node (v20.12+), así que NO hace falta instalar dotenv.
// Ojo: si no existe el archivo .env, esta línea lanza un error y el servidor
// no arranca. Por eso el repo incluye un .env con PORT=3000.
process.loadEnvFile()

// El puerto NUNCA debe estar hardcodeado: en producción (Vercel, Railway...)
// es el proveedor quien nos asigna uno y nos lo pasa por process.env.PORT.
// El 3000 es solo el valor por defecto para desarrollo.
const port = process.env.PORT || 3000

// ---------------------------------------------------------------------------
// "Base de datos" en memoria
// ---------------------------------------------------------------------------
// Es un simple array. Al reiniciar el servidor se pierde todo lo creado con
// POST: es normal, hasta que en otro módulo aprendamos bases de datos reales.
const users = [
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    name: 'Miguel',
    age: 28,
  },
  {
    id: 'f6e5d4c3-b2a1-4f5e-6d7c-8b9a0e1f2a3b',
    name: 'Mateo',
    age: 34,
  },
  {
    id: '9a8b7c6d-5e4f-4a3b-2c1d-0e9f8a7b6c5d',
    name: 'Pablo',
    age: 22,
  },
  {
    id: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f',
    name: 'Lucía',
    age: 31,
  },
  {
    id: '7b8c9d0e-1f2a-4b3c-4d5e-6f7a8b9c0d1e',
    name: 'Ana',
    age: 26,
  },
  {
    id: '5d6e7f8a-9b0c-4d1e-2f3a-4b5c6d7e8f9a',
    name: 'Juan',
    age: 29,
  },
  {
    id: '2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d',
    name: 'Sofía',
    age: 25,
  },
  {
    id: '8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c',
    name: 'Carlos',
    age: 37,
  },
  {
    id: '4c5d6e7f-8a9b-4c0d-1e2f-3a4b5c6d7e8f',
    name: 'Elena',
    age: 23,
  },
  {
    id: '0e1f2a3b-4c5d-4e6f-7a8b-9c0d1e2f3a4b',
    name: 'Diego',
    age: 30,
  },
]

// ---------------------------------------------------------------------------
// Helper para responder siempre igual
// ---------------------------------------------------------------------------
// Sin esto acabaríamos repitiendo statusCode + setHeader + JSON.stringify en
// cada endpoint. Esta función es, básicamente, el res.json() de Express.
//
// El charset=utf-8 es importante: sin él, nombres como "Lucía" o "Sofía" se
// verían con caracteres raros en el cliente.
function sendJSON(res, statusCode, data) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  return res.end(JSON.stringify(data))
}

const server = createServer(async (req, res) => {
  // req.url llega COMPLETA, incluyendo la query string: "/users?limit=2".
  // Si comparásemos req.url === '/users' directamente, cualquier filtro
  // devolvería un 404. Por eso separamos las dos partes con el constructor URL:
  //   pathname     -> "/users"    (para decidir la ruta)
  //   searchParams -> "?limit=2"  (para los filtros)
  //
  // URL necesita una base para funcionar con rutas relativas; se la damos
  // construyéndola con la cabecera host de la propia petición.
  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`)
  const { method } = req

  // -------------------------------------------------------------------------
  // GET /health  (tercer ejercicio)
  // -------------------------------------------------------------------------
  // Ruta de "health check": no la consume un usuario, la consumen sistemas de
  // monitorización para saber si el servidor sigue vivo. Debe ser rápida.
  if (pathname === '/health' && method === 'GET') {
    return sendJSON(res, 200, {
      status: 'ok',
      // process.uptime() = segundos que lleva ejecutándose este proceso.
      // Si de pronto vuelve a ser bajo, el servidor se ha reiniciado solo.
      uptime: process.uptime(),
    })
  }

  // -------------------------------------------------------------------------
  // GET /users  (primer ejercicio + quinto: los filtros)
  // -------------------------------------------------------------------------
  if (pathname === '/users' && method === 'GET') {
    // Partimos de la lista completa y la vamos filtrando por pasos.
    let resultado = users

    // --- Filtro por nombre: ?name=miguel ---------------------------------
    // searchParams.get() devuelve null si el parámetro no viene, así que
    // solo aplicamos el filtro cuando realmente hay algo.
    const name = searchParams.get('name')
    if (name) {
      // Pasamos ambos lados a minúsculas para que la búsqueda no distinga
      // mayúsculas: "miguel" tiene que encontrar a "Miguel".
      // includes() y no ===, porque buscamos que CONTENGA el texto.
      const busqueda = name.toLowerCase()
      resultado = resultado.filter((user) => user.name.toLowerCase().includes(busqueda))
    }

    // --- Filtro por edad: ?minAge=25&maxAge=30 ---------------------------
    // OJO, esto es clave: los query params SIEMPRE llegan como string.
    // "25" no es 25. Si comparásemos user.age >= "25" tendríamos bugs raros,
    // así que convertimos con Number() y comprobamos que no salga NaN
    // (por si alguien escribe ?minAge=hola).
    const minAge = Number(searchParams.get('minAge'))
    if (searchParams.has('minAge') && !Number.isNaN(minAge)) {
      // >= porque el README dice "inclusive"
      resultado = resultado.filter((user) => user.age >= minAge)
    }

    const maxAge = Number(searchParams.get('maxAge'))
    if (searchParams.has('maxAge') && !Number.isNaN(maxAge)) {
      resultado = resultado.filter((user) => user.age <= maxAge)
    }

    // --- Paginación: ?limit=3&offset=2 -----------------------------------
    // Va SIEMPRE la última: primero se filtra y luego se corta la página.
    // Si cortásemos antes, paginaríamos sobre la lista sin filtrar.
    //
    // Cada parámetro tiene su valor por defecto para que funcionen sueltos:
    //   offset sin limit -> desde ahí hasta el final (limit = Infinity)
    //   limit sin offset -> desde el principio (offset = 0)
    // Si no viene ninguno de los dos, no tocamos nada.
    if (searchParams.has('limit') || searchParams.has('offset')) {
      const limit = Number(searchParams.get('limit') ?? Infinity)
      const offset = Number(searchParams.get('offset') ?? 0)

      const desde = Number.isNaN(offset) ? 0 : offset
      const cuantos = Number.isNaN(limit) ? Infinity : limit

      resultado = resultado.slice(desde, desde + cuantos)
    }

    return sendJSON(res, 200, resultado)
  }

  // -------------------------------------------------------------------------
  // POST /users  (segundo ejercicio)
  // -------------------------------------------------------------------------
  if (pathname === '/users' && method === 'POST') {
    let body

    try {
      // El body de una petición NO llega como objeto: llega como un stream,
      // o sea, en trozos de bytes que van cayendo poco a poco.
      // json() de node:stream/consumers espera a que lleguen todos los trozos
      // y los convierte a objeto de una sola vez. Es nativo de Node.
      body = await json(req)
    } catch {
      // Si el cliente manda algo que no es JSON válido, json() lanza error.
      // La culpa es del cliente, no del servidor -> 400, no 500.
      return sendJSON(res, 400, { error: 'El body debe ser un JSON válido' })
    }

    const { name, age } = body

    // Nunca te fíes de lo que manda el cliente: hay que validar.
    if (!name || typeof name !== 'string') {
      return sendJSON(res, 400, { error: 'El campo "name" es obligatorio y debe ser texto' })
    }

    if (typeof age !== 'number' || Number.isNaN(age)) {
      return sendJSON(res, 400, { error: 'El campo "age" es obligatorio y debe ser un número' })
    }

    const newUser = {
      // El id lo genera SIEMPRE el servidor, nunca el cliente: es la única
      // forma de garantizar que no se repita. randomUUID() es nativo, no hace
      // falta instalar la librería uuid.
      id: randomUUID(),
      name,
      age,
    }

    users.push(newUser)

    // 201 Created, no 200. El código de estado también comunica: le dice al
    // cliente "se ha creado un recurso nuevo", no solo "todo bien".
    return sendJSON(res, 201, newUser)
  }

  // -------------------------------------------------------------------------
  // 405 Method Not Allowed
  // -------------------------------------------------------------------------
  // Caso intermedio entre "existe" y "no existe": la ruta SÍ existe, pero no
  // acepta ese verbo (por ejemplo, DELETE /users). Decir 404 aquí sería
  // mentir, porque la URL es correcta.
  if (pathname === '/users' || pathname === '/health') {
    return sendJSON(res, 405, { error: `El método ${method} no está permitido en ${pathname}` })
  }

  // -------------------------------------------------------------------------
  // 404 Ruta no encontrada  (cuarto ejercicio)
  // -------------------------------------------------------------------------
  // Si la petición llega hasta aquí es que no ha coincidido con nada.
  // Devolvemos el error en JSON, igual que el resto de respuestas, para que la
  // API sea predecible: quien la consume siempre recibe JSON.
  return sendJSON(res, 404, { error: 'Ruta no encontrada' })
})

server.listen(port, () => {
  const address = server.address()
  console.log(`Servidor escuchando en http://localhost:${address.port}`)
})
