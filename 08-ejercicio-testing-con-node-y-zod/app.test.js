import assert from 'node:assert/strict'
import test, { after, before, describe } from 'node:test'

// app.js solo hace listen() si NODE_ENV está vacío. Los import se hoistean, así
// que lo cargo con import() dinámico para poder marcar el entorno antes y ser yo
// quien levante el servidor en el before()
// process.env.NODE_ENV = 'test'
// const { default: app } = await import('./app.js')
/* MADEVAL: Buena solución, pero en la práctica lo mejor es manejar estas cosas desde `package.json` agregando las variables de entorno en el propio script. Por ejemplo, si ves el script de `test` y `test:watch`, verás que agregamos la variable de entorno ahí. Son dos scripts que se van a ejecutar siempre en modo desarrollo así que simplificamos el import que teníamos de esta manera (Y queda agnóstico al código) */
import app from './app.js'

// Puerto distinto al de desarrollo para no chocar con el servidor que tenga abierto
const PORT = 5678
const baseURL = `http://localhost:${PORT}/jobs`

// IDs que existen en jobs.json
/* MADEVAL: Excelente! En este caso usaremos valores estáticos, pero lo mejor es siempre obtener valores en tiempo real por si ejecutamos tests con diferentes fuentes */
const ID_ANALISTA = 'd35b2c89-5d60-4f26-b19a-6cfb2f1a0f57'
const ID_MOVILES = 'e31f9a92-61d7-4b7a-b3a2-91e8c1f40b2d'
const ID_DEVOPS = 'f62d8a34-923a-4ac2-9b0b-14e0ac2f5405'
const ID_INEXISTENTE = '00000000-0000-0000-0000-000000000000'

let server

// app.listen es asíncrono, así que envuelvo en promesa para que los tests no
// arranquen antes de tiempo
before(async () => {
  await new Promise((resolve, reject) => {
    server = app.listen(PORT, (error) => {
      if (error) return reject(error)
      resolve()
    })
  })
})

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) return reject(error)
      resolve()
    })
  })
})

/* MADEVAL: En muchos tests repetimos el mismo fetch con el strictEqual y la transformación a JSON, así que lo podemos pasar a una función  */
const handleGetResponseAndCheckStatus = async ({ path, status = 200 }) => {
  const LOCAL_BASE_URL = `http://localhost:${PORT}`

  /* Damos la posibilidad al usuario de mandar el path con `/` o sin el */
  const normalizePath = path.startsWith('/') ? path : `/${path}`

  const res = await fetch(`${LOCAL_BASE_URL}${normalizePath}`)
  assert.strictEqual(res.status, 200)

  return await res.json()
}


describe('GET /jobs', () => {
  test('debe responder con 200 y un array de trabajos', async () => {
    const json = await handleGetResponseAndCheckStatus({ path: '/jobs' })
    
    // La API no devuelve el array pelado, lo mete dentro de data
    assert.ok(Array.isArray(json.data), 'La respuesta debe traer un array en json.data')
  })
  
  test('debe filtrar trabajos por tecnología', async () => {
    /* MADEVAL: Podemos pasar como variable la tecnología que vamos a usar para testear, por si mañana queremos probar con otro caso. Es más, hasta podemos tener un array de `techs` y con un Math.random() usar de manera aleatoria para darle más opciones al test */
    const TECH = 'react'
    const json = await handleGetResponseAndCheckStatus({ path: `/jobs?technology=${TECH}` })

    assert.ok(json.data.length > 0, 'Debería haber al menos un trabajo con react')

    const todosLlevanReact = json.data.every((job) => job.data.technology.includes(TECH))
    assert.ok(todosLlevanReact, `Todos los trabajos devueltos deben incluir ${TECH}`)
  })

  test('debe respetar el límite de resultados', async () => {
    /* MADEVAL: Mismo caso que el test anterior */
    const LIMIT = 2
    const json = await handleGetResponseAndCheckStatus({ path: `/jobs?limit=${LIMIT}` })

    assert.strictEqual(json.limit, LIMIT)
    assert.strictEqual(json.data.length, LIMIT)
  })

  test('debe aplicar el offset correctamente', async () => {
    const OFFSET = 2
    const json = await handleGetResponseAndCheckStatus({ path: `/jobs?offset=${OFFSET}` })

    /*
    MADEVAL: Esto se puede mejorar haciendo:
    - Un fetch a todos los `jobs`
    - Guardar en una variable el segundo de la lista (offset)
    - Hacer la petición que hicimos en este test
    - Igualar el segundo que de todos los jobs con el primero de la petición con offset
    
    Con esto no dependemos de un ID hardcodeado
    */

    // Saltando el primero, el que abre la lista es el segundo del JSON
    assert.strictEqual(json.data[0].id, ID_ANALISTA)
  })
})

describe('POST /jobs', () => {
  const nuevoJob = {
    titulo: 'Desarrollador Frontend',
    empresa: 'JSCamp',
    ubicacion: 'Remoto',
    descripcion: 'Trabajo de prueba creado desde los tests',
    data: {
      technology: ['react', 'javascript'],
      modalidad: 'remoto',
      nivel: 'junior',
    },
  }

  /* MADEVAL: Tenemos un handler que es para métodos GET, lo que podemos hacer es tener un nuevo handler para métodos POST y los que siguen. Que una función abarque todo también es una opción pero para no complejizar, prefiero separar en responsabilidades */
  const postJob = (body) =>
    fetch(baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

  test('el nuevo trabajo se añade correctamente con buen formato', async () => {
    const response = await postJob(nuevoJob)
    assert.strictEqual(response.status, 201)

    const json = await response.json()
    assert.ok(json.id, 'El trabajo creado debe traer un id generado')
    assert.strictEqual(json.titulo, nuevoJob.titulo)
    assert.strictEqual(json.empresa, nuevoJob.empresa)
    assert.strictEqual(json.ubicacion, nuevoJob.ubicacion)
  })

  test('devuelve 400 si el título tiene menos de 3 caracteres', async () => {
    const response = await postJob({ ...nuevoJob, titulo: 'JS' })
    assert.strictEqual(response.status, 400)
  })

  test('devuelve 400 si el título tiene más de 100 caracteres', async () => {
    const response = await postJob({ ...nuevoJob, titulo: 'a'.repeat(101) })
    assert.strictEqual(response.status, 400)
  })

  test('devuelve 400 si falta el título', async () => {
    const { titulo, ...sinTitulo } = nuevoJob
    const response = await postJob(sinTitulo)
    assert.strictEqual(response.status, 400)
  })

  test('devuelve 400 si el título no es un string', async () => {
    const response = await postJob({ ...nuevoJob, titulo: 1234 })
    assert.strictEqual(response.status, 400)
  })

  test('devuelve 201 si falta la descripción, porque es opcional', async () => {
    const { descripcion, ...sinDescripcion } = nuevoJob
    const response = await postJob(sinDescripcion)
    assert.strictEqual(response.status, 201)
  })
})

describe('GET /jobs/:id', () => {
  test('debe devolver el trabajo con el ID especificado', async () => {
    const response = await fetch(`${baseURL}/${ID_ANALISTA}`)
    assert.strictEqual(response.status, 200)

    const json = await response.json()
    assert.strictEqual(json.id, ID_ANALISTA)
  })

  test('debe enviar 404 cuando el ID no existe', async () => {
    const response = await fetch(`${baseURL}/${ID_INEXISTENTE}`)
    assert.strictEqual(response.status, 404)

    const json = await response.json()
    assert.ok(json.error, 'La respuesta debe traer un campo error')
  })
})

describe('PUT /jobs/:id', () => {
  const jobActualizado = {
    titulo: 'Desarrollador de Aplicaciones Móviles Senior',
    empresa: 'Mobile First',
    ubicacion: 'Valencia',
    descripcion: 'Puesto reemplazado por completo desde el test de PUT',
    data: {
      technology: ['swift', 'kotlin'],
      modalidad: 'híbrido',
      nivel: 'senior',
    },
  }

  const putJob = (id, body) =>
    fetch(`${baseURL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

  test('debe recibir 204 y actualizar el trabajo', async () => {
    const response = await putJob(ID_MOVILES, jobActualizado)
    assert.strictEqual(response.status, 204)

    // Compruebo el cambio pidiendo el recurso otra vez
    const comprobacion = await fetch(`${baseURL}/${ID_MOVILES}`)
    const json = await comprobacion.json()

    assert.strictEqual(json.titulo, jobActualizado.titulo)
    assert.strictEqual(json.empresa, jobActualizado.empresa)
    assert.strictEqual(json.ubicacion, jobActualizado.ubicacion)
    // El PUT reemplaza todo menos el id
    assert.strictEqual(json.id, ID_MOVILES)
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    const response = await putJob(ID_INEXISTENTE, jobActualizado)
    assert.strictEqual(response.status, 404)
  })
})

describe('PATCH /jobs/:id', () => {
  const cambios = {
    titulo: 'Ingeniero de DevOps Senior',
    ubicacion: 'Bilbao',
  }

  const patchJob = (id, body) =>
    fetch(`${baseURL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

  test('debe recibir 204 y actualizar solo los campos enviados', async () => {
    // Guardo el estado previo para comprobar después qué NO ha cambiado
    const antes = await (await fetch(`${baseURL}/${ID_DEVOPS}`)).json()

    const response = await patchJob(ID_DEVOPS, cambios)
    assert.strictEqual(response.status, 204)

    const despues = await (await fetch(`${baseURL}/${ID_DEVOPS}`)).json()

    assert.strictEqual(despues.titulo, cambios.titulo)
    assert.strictEqual(despues.ubicacion, cambios.ubicacion)
    // Lo que no mandé se queda como estaba
    assert.strictEqual(despues.empresa, antes.empresa)
    assert.strictEqual(despues.descripcion, antes.descripcion)
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    const response = await patchJob(ID_INEXISTENTE, cambios)
    assert.strictEqual(response.status, 404)
  })
})

describe('DELETE /jobs/:id', () => {
  const deleteJob = (id) => fetch(`${baseURL}/${id}`, { method: 'DELETE' })

  test('debe recibir 204 y eliminar el trabajo', async () => {
    // Creo uno a propósito para borrarlo, así no dependo de que otro test
    // haya tocado antes los datos del JSON
    const creado = await (
      await fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: 'Trabajo temporal para borrar',
          empresa: 'JSCamp',
          ubicacion: 'Remoto',
        }),
      })
    ).json()

    const response = await deleteJob(creado.id)
    assert.strictEqual(response.status, 204)

    const comprobacion = await fetch(`${baseURL}/${creado.id}`)
    assert.strictEqual(comprobacion.status, 404)
  })

  test('debe devolver 404 cuando el ID no existe', async () => {
    const response = await deleteJob(ID_INEXISTENTE)
    assert.strictEqual(response.status, 404)
  })
})
