// EXTRA | Custom hook para PEDIR DATOS a una API.
//
// El patrón de "pedir datos" siempre es igual: tres estados (data, loading,
// error) y la llamada dentro de un useEffect. En vez de repetir eso en cada
// componente, lo encapsulamos aquí y pedir datos pasa a ser una línea:
//    const { data, total, loading, error } = useFetch(url)
import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [data, setData] = useState([]) // los empleos recibidos
  const [total, setTotal] = useState(0) // cuántos hay EN TOTAL en la API (para paginar)
  const [loading, setLoading] = useState(true) // true mientras se está pidiendo
  const [error, setError] = useState(null) // guarda el error si algo falla

  useEffect(() => {
    // AbortController sirve para CANCELAR una petición a medias. Hace falta
    // porque si el usuario escribe rápido salen varias peticiones y podrían
    // llegar desordenadas: la respuesta vieja pisaría a la nueva (race condition).
    const controller = new AbortController()

    // useEffect no puede ser async directamente, así que definimos la función
    // async dentro y la llamamos al final.
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(url, { signal: controller.signal })

        // fetch NO lanza error con un 404 o un 500: solo falla si se cae la red.
        // Por eso comprobamos response.ok y lanzamos el error nosotros mismos.
        if (!response.ok) throw new Error(`Error ${response.status} al pedir los empleos`)

        const json = await response.json()

        setData(json.data) // el array de empleos
        setTotal(json.total ?? 0) // ?? = "si es null o undefined, usa 0"
      } catch (err) {
        // Si el error viene de nuestra propia cancelación, lo ignoramos:
        // no es un fallo real, es que ya hay otra petición más nueva en marcha.
        if (err.name !== 'AbortError') setError(err)
      } finally {
        // Pase lo que pase (éxito o error), dejamos de "cargar"... salvo si esta
        // petición fue cancelada: en ese caso ya hay otra en marcha y apagar el
        // "cargando" aquí haría parpadear la pantalla.
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchData()

    // Limpieza del efecto: si la url cambia (o el componente se desmonta),
    // cancelamos la petición anterior antes de lanzar la nueva.
    return () => controller.abort()
  }, [url]) // se vuelve a ejecutar cada vez que cambia la url

  return { data, total, loading, error }
}
