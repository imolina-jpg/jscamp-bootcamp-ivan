// Spinner: componente reutilizable para avisar de que algo se está cargando.
// La animación del círculo está en index.css (.spinner + @keyframes spin).
//
// El mensaje es una prop con VALOR POR DEFECTO: si no se lo pasamos, usa
// "Cargando...". Así <Spinner /> a secas ya funciona.
export function Spinner({ mensaje = 'Cargando...' }) {
  return (
    // role="status" avisa a los lectores de pantalla de que aquí hay información
    // que va cambiando, para que la anuncien sin interrumpir al usuario.
    <div className="loading" role="status">
      <div className="spinner" />
      <p>{mensaje}</p>
    </div>
  )
}
