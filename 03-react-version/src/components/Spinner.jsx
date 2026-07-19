// Spinner: pequeño componente reutilizable para mostrar "cargando". Junta el
// mensaje y el círculo animado (la animación está en index.css: .spinner + @keyframes).
// Recibe un mensaje opcional por prop (valor por defecto "Cargando...").
export function Spinner({ mensaje = 'Cargando...' }) {
  return (
    <div className="loading">
      <p>{mensaje}</p>
      <div className="spinner" />
    </div>
  )
}
