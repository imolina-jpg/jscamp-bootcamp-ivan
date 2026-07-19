// Doble exportación a propósito:
// - `export function` (nombrada) para quien quiera importarla normal.
// - `export default` al final, porque React.lazy() SOLO sabe cargar el
//   export por defecto de un módulo.
export function NotFoundPage () {
  return (
    <main>
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
    </main>
  )
}

export default NotFoundPage
