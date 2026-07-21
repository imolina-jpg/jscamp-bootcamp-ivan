// ================================
// CONEXIÓN A LA BASE DE DATOS
// ================================

import Database from 'better-sqlite3'

// SQLite guarda TODA la base de datos en un único archivo.
// Si usáramos ':memory:' los datos se perderían al reiniciar el servidor;
// con un archivo real (jobs.db) la información persiste entre ejecuciones.
export const db = new Database('jobs.db')

// Un PRAGMA es un ajuste de configuración propio de SQLite.

// WAL (Write-Ahead Logging): las escrituras van a un archivo aparte,
// así una escritura no bloquea las lecturas. Mejor para una API.
db.pragma('journal_mode = WAL')

// SQLite NO comprueba las claves foráneas si no se lo pedimos.
// Con esto activado, un job_id que no exista en `jobs` será rechazado
// y los ON DELETE CASCADE funcionan de verdad.
db.pragma('foreign_keys = ON')
