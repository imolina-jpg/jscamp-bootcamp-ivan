// CUSTOM HOOK del formulario de búsqueda. Encapsula la lógica: ids únicos y handlers.
// Recibe los callbacks del padre:
//   - onSearch: se llama al cambiar un SELECT (filtra al instante)
//   - onTextFilter: se llama al escribir en el BUSCADOR (con debounce)
//   - onReset: se llama al pulsar "Limpiar"
import { useId, useRef } from 'react'

export function useSearchForm({ onSearch, onTextFilter, onReset }) {
  const ids = {
    search: useId(),
    technology: useId(),
    location: useId(),
    experience: useId(),
  }

  // useRef es una "caja" que React mantiene ENTRE RENDERS sin provocar re-renders
  // al cambiar. Perfecta para guardar el id del temporizador del debounce: antes
  // usábamos una variable global de módulo (fea y compartida entre instancias);
  // con useRef cada instancia del formulario tiene su propio timeout. El valor
  // vive en timeoutId.current.
  const timeoutId = useRef(null)

  // handleChange (SELECTS): al cambiar un select, filtramos YA. event.target es el
  // select; event.target.form es el <form> que lo contiene, de donde leemos todos
  // los selects con FormData.
  const handleChange = (event) => {
    const formData = new FormData(event.target.form)
    const filters = {
      technology: formData.get(ids.technology),
      location: formData.get(ids.location),
      experienceLevel: formData.get(ids.experience),
    }
    onSearch(filters)
  }

  // handleTextChange (BUSCADOR) con DEBOUNCE: en vez de avisar en cada tecla,
  // programamos el aviso para dentro de 500ms. Si el usuario sigue escribiendo,
  // cancelamos el temporizador anterior (clearTimeout) y arrancamos otro. Solo
  // cuando para de teclear 500ms se ejecuta onTextFilter → una única petición.
  const handleTextChange = (event) => {
    const text = event.target.value
    // Cancelamos el temporizador anterior (si lo hay) y programamos otro,
    // guardando su id en timeoutId.current.
    if (timeoutId.current) clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      onTextFilter(text)
    }, 500)
  }

  // handleReset: vacía el formulario (.reset()) y avisa al padre para borrar filtros.
  const handleReset = (event) => {
    event.target.form.reset()
    onReset()
  }

  return { ids, handleChange, handleTextChange, handleReset }
}
