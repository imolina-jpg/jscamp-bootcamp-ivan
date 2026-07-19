// Custom hook del formulario de contacto. Encapsula TODA su lógica: el estado de
// los campos, los errores de validación, si ya se envió, y los handlers.
import { useState } from 'react'

// Valores iniciales del formulario (vacío).
const VALORES_INICIALES = { nombre: '', email: '', mensaje: '' }

export function useContactForm() {
  // values: lo que hay escrito en cada campo (inputs "controlados" por React).
  const [values, setValues] = useState(VALORES_INICIALES)
  // errors: mensajes de error por campo (objeto vacío = todo correcto).
  const [errors, setErrors] = useState({})
  // submitted: true tras enviar con éxito, para mostrar el mensaje de confirmación.
  const [submitted, setSubmitted] = useState(false)

  // handleChange: actualiza en el estado el campo que se está escribiendo.
  // Usamos el "name" del input como clave: [name] es una clave dinámica.
  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  // validate: revisa los campos y devuelve un objeto de errores (vacío si todo ok).
  const validate = (vals) => {
    const nuevosErrores = {}
    if (!vals.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.'
    if (!vals.email.trim()) nuevosErrores.email = 'El email es obligatorio.'
    else if (!vals.email.includes('@')) nuevosErrores.email = 'El email no es válido.'
    if (!vals.mensaje.trim()) nuevosErrores.mensaje = 'El mensaje es obligatorio.'
    return nuevosErrores
  }

  // handleSubmit: al enviar, validamos. Si hay errores, los mostramos; si no,
  // marcamos como enviado y limpiamos el formulario.
  const handleSubmit = (event) => {
    event.preventDefault()
    const nuevosErrores = validate(values)
    setErrors(nuevosErrores)

    // Object.keys(obj).length === 0 → el objeto de errores está vacío (no hay errores).
    if (Object.keys(nuevosErrores).length === 0) {
      setSubmitted(true)
      setValues(VALORES_INICIALES)
    }
  }

  return { values, errors, submitted, handleChange, handleSubmit }
}
