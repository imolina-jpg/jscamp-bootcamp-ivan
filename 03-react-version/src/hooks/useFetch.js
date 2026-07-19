// Custom hook para PEDIR DATOS a una API. Encapsula el patrón típico de fetch:
// tres estados (data, loading, error) y la llamada dentro de useEffect.
// Así cualquier componente puede pedir datos con una sola línea: useFetch(url).
import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)   // los datos recibidos (null hasta que llegan)
  const [total, setTotal] = useState(0)    // cuántos resultados hay EN TOTAL en la API
  const [loading, setLoading] = useState(true) // true mientras se está pidiendo
  const [error, setError] = useState(null)  // guarda el error si algo falla

  useEffect(() => {
    // OJO: fetch es asíncrono. Definimos una función async DENTRO del efecto
    // (useEffect no puede ser async directamente) y la llamamos al final.
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(url)          // 1. pedimos a la API
        // response.ok es false si la API responde con error (404, 500...). fetch
        // NO lanza error solo, así que lo lanzamos nosotros para caer en el catch.
        if (!response.ok) throw new Error(`Error ${response.status} al pedir datos`)
        const json = await response.json()         // 2. convertimos la respuesta a objeto
        setData(json.data)                         // 3. guardamos el array "data"
        setTotal(json.total ?? 0)                  // 4. y el total (para la paginación)
      } catch (err) {
        // Si la red falla o la respuesta es inválida, guardamos el error.
        setError(err)
      } finally {
        // Pase lo que pase (éxito o error), dejamos de "cargar".
        setLoading(false)
      }
    }
    fetchData()
    // Dependencia [url]: si la URL cambia, se vuelve a pedir. Clave para cuando
    // metamos los filtros en la URL (próximas lecciones).
  }, [url])

  return { data, total, loading, error }
}
