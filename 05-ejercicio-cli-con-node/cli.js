import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

// ============================================================================
// CLI: un "ls" propio hecho con Node.js
// ============================================================================
// Lista los archivos y carpetas de un directorio mostrando icono, nombre y
// tamaño. Además permite ordenar (--asc / --desc), filtrar (--files /
// --folders) y avisa si no tenemos permisos de lectura.
//
// Todo se hace con módulos NATIVOS de Node (node:fs/promises y node:path).
// Cero dependencias externas: es justo lo que enseña este módulo.
// ============================================================================

// ---------------------------------------------------------------------------
// 1. LEER LOS ARGUMENTOS DE LA TERMINAL (process.argv)
// ---------------------------------------------------------------------------
// process.argv es un array con TODO lo que se escribió en la terminal:
//   posición 0 -> ruta del ejecutable de node
//   posición 1 -> ruta de este mismo archivo (cli.js)
//   posición 2 en adelante -> lo que ha escrito el usuario
// Por eso hacemos .slice(2): nos quedamos solo con "lo nuestro".
const args = process.argv.slice(2)

// El README pide que los flags funcionen EN CUALQUIER POSICIÓN:
//   node cli.js --files --asc   ===   node cli.js --asc --files
// Si leyéramos por índice (args[0], args[1]...) esto se rompería.
// La solución: separar los argumentos en dos grupos según empiecen por "--".
//
// Con un Set las comprobaciones quedan más limpias: flags.has('--asc')
const flags = new Set(args.filter((arg) => arg.startsWith('--')))

// Lo que NO es un flag es la ruta que el usuario quiere listar.
// Si no escribió ninguna, usamos '.' (la carpeta actual).
const folder = args.find((arg) => !arg.startsWith('--')) ?? '.'

// ---------------------------------------------------------------------------
// 2. COMPROBAR PERMISOS (cuarto ejercicio del README)
// ---------------------------------------------------------------------------
// Node.js, por defecto, puede leer CUALQUIER archivo del sistema. Eso es un
// riesgo de seguridad. Desde Node 20 existe un sistema de permisos que se
// activa con el flag --permission al ejecutar:
//
//   node --permission cli.js                    -> BLOQUEADO (no puede leer)
//   node --permission --allow-fs-read=. cli.js  -> permitido solo leer "."
//
// process.permission solo EXISTE si arrancamos con --permission. Si el usuario
// ejecuta el CLI normal (sin ese flag), process.permission es undefined y no
// hay nada que comprobar: Node tiene acceso total.
if (process.permission) {
  // .has('fs.read', ruta) nos dice si tenemos permiso ANTES de intentar leer.
  // Preguntar primero nos permite dar un error claro en vez de dejar que el
  // programa "explote" con un error críptico del sistema.
  const puedeLeer = process.permission.has('fs.read', folder)

  if (!puedeLeer) {
    console.error(`❌ No tienes permisos de lectura sobre "${folder}".`)
    console.error('')
    console.error('   Node.js está en modo restringido (--permission).')
    console.error('   Para permitir la lectura de esa carpeta, ejecuta:')
    console.error('')
    console.error(`   node --permission --allow-fs-read=${folder} cli.js ${folder}`)
    console.error('')
    // process.exit(1) termina el programa con código de error. Por convención
    // en la terminal: 0 = todo bien, cualquier otro número = algo falló.
    process.exit(1)
  }
}

// ---------------------------------------------------------------------------
// 3. LEER EL CONTENIDO DEL DIRECTORIO (primer ejercicio del README)
// ---------------------------------------------------------------------------
// readdir devuelve solo los NOMBRES ('index.js', 'src'...), sin más info.
// Va dentro de try/catch porque puede fallar por muchos motivos: la carpeta
// no existe, es un archivo, o el sistema de permisos la bloquea.
let nombres
try {
  nombres = await readdir(folder)
} catch (error) {
  // ERR_ACCESS_DENIED es el error concreto del sistema de permisos de Node.
  // Lo capturamos aquí también como red de seguridad, por si la comprobación
  // de arriba no lo cazó (por ejemplo, con rutas relativas raras).
  if (error.code === 'ERR_ACCESS_DENIED') {
    console.error(`❌ No tienes permisos de lectura sobre "${folder}".`)
    console.error(`   Ejecuta: node --permission --allow-fs-read=${folder} cli.js ${folder}`)
  } else if (error.code === 'ENOENT') {
    // ENOENT = "Error NO ENTry": la ruta no existe.
    console.error(`❌ La carpeta "${folder}" no existe.`)
  } else if (error.code === 'ENOTDIR') {
    console.error(`❌ "${folder}" no es una carpeta, es un archivo.`)
  } else {
    console.error(`❌ No se pudo leer el directorio "${folder}": ${error.message}`)
  }
  process.exit(1)
}

// Con el nombre no sabemos si es carpeta ni cuánto pesa. Para eso está stat(),
// que nos da los metadatos de cada entrada.
//
// Como stat() es asíncrono, .map() nos devuelve un array de PROMESAS. Con
// Promise.all las lanzamos TODAS a la vez y esperamos a que acaben, en lugar
// de ir una por una. Esto es la ventaja del modelo asíncrono de Node.
const entradas = await Promise.all(
  nombres.map(async (nombre) => {
    // join() une los trozos de ruta usando el separador correcto del sistema
    // operativo (\ en Windows, / en Linux/Mac). Nunca concatenar rutas a mano.
    const rutaCompleta = join(folder, nombre)
    const stats = await stat(rutaCompleta)

    return {
      nombre,
      esCarpeta: stats.isDirectory(),
      // Guardamos el tamaño en bytes; lo formatearemos justo antes de pintar.
      bytes: stats.size,
    }
  })
)

// ---------------------------------------------------------------------------
// 4. FILTRAR (tercer ejercicio del README)
// ---------------------------------------------------------------------------
// --files   -> solo archivos
// --folders -> solo carpetas
// sin flag  -> todo
//
// Empezamos con la lista completa y la vamos transformando por pasos.
// Usamos `let` porque la variable va a ir apuntando a arrays nuevos
// (filter y toSorted no modifican el original, devuelven uno nuevo).
let resultado = entradas

if (flags.has('--files')) {
  resultado = resultado.filter((entrada) => !entrada.esCarpeta)
} else if (flags.has('--folders')) {
  resultado = resultado.filter((entrada) => entrada.esCarpeta)
}

// ---------------------------------------------------------------------------
// 5. ORDENAR (segundo ejercicio del README)
// ---------------------------------------------------------------------------
// --asc  -> A → Z
// --desc -> Z → A
// sin flag -> el orden original que devolvió readdir
//
// Usamos localeCompare en vez de > o < porque compara texto respetando el
// idioma: así "árbol" se ordena junto a "arbol" y no al final del alfabeto.
//
// toSorted() (Node 20+) es como sort() pero devuelve un array NUEVO en vez de
// modificar el original. Más seguro y más fácil de razonar.
if (flags.has('--asc')) {
  resultado = resultado.toSorted((a, b) => a.nombre.localeCompare(b.nombre))
} else if (flags.has('--desc')) {
  resultado = resultado.toSorted((a, b) => b.nombre.localeCompare(a.nombre))
}

// ---------------------------------------------------------------------------
// 6. PINTAR EL RESULTADO
// ---------------------------------------------------------------------------

/**
 * Convierte bytes en algo legible para humanos.
 * 2731 bytes -> "2.67 KB"   (mucho mejor que soltar el número pelado)
 */
function formatSize(bytes) {
  if (bytes === 0) return '0 B'

  const k = 1024
  const unidades = ['B', 'KB', 'MB', 'GB', 'TB']

  // El logaritmo nos dice cuántas veces "cabe" 1024 en el número, o sea, qué
  // unidad toca: 0 -> B, 1 -> KB, 2 -> MB...
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  // parseFloat elimina los ceros sobrantes: "2.60" queda como 2.6
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${unidades[i]}`
}

if (resultado.length === 0) {
  console.log('(no hay nada que mostrar con esos filtros)')
} else {
  // Calculamos el ancho de la columna del nombre según el nombre MÁS LARGO
  // que vayamos a pintar.
  //
  // Un ancho fijo (padEnd(20), por ejemplo) parece más simple, pero se rompe
  // en cuanto un nombre lo supera: padEnd no recorta, así que ese nombre
  // empuja su tamaño hacia la derecha y la columna deja de estar alineada.
  // Calculándolo aquí, la tabla cuadra siempre.
  const anchoNombre = Math.max(...resultado.map((entrada) => entrada.nombre.length))

  for (const entrada of resultado) {
    const icono = entrada.esCarpeta ? '📁' : '📄'

    // El README pide que las carpetas muestren "-" en vez de un tamaño: el
    // tamaño que da stat() de un directorio no es la suma de su contenido,
    // así que mostrarlo sería engañoso.
    const tamano = entrada.esCarpeta ? '-' : formatSize(entrada.bytes)

    // padEnd rellena por la derecha y padStart por la izquierda. Así las
    // columnas quedan alineadas y la salida se lee de un vistazo.
    console.log(`${icono} ${entrada.nombre.padEnd(anchoNombre)} ${tamano.padStart(10)}`)
  }
}
