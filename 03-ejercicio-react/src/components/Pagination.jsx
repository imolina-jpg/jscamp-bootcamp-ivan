// CUARTA + SEXTA PARTE | Paginación.
//
// Pagination NO sabe nada de empleos ni de filtros. Solo recibe tres cosas:
//   - currentPage: en qué página estamos
//   - totalPages: cuántas páginas hay en total
//   - onPageChange: un CALLBACK, es decir, una función que nos pasa el padre y
//     que llamamos para avisarle "el usuario quiere ir a esta página".
//
// Este patrón se llama "elevar el estado" (lifting state up): el estado real
// vive en el padre, y el hijo solo informa de lo que ha hecho el usuario.
//
// A onPageChange le damos como valor por defecto una función vacía. Así, si
// alguien usa <Pagination /> sin pasarlo, el componente no revienta con
// "onPageChange is not a function".
export function Pagination({ currentPage = 1, totalPages = 1, onPageChange = () => {} }) {
  // Array.from({ length: n }, (_, i) => i + 1) crea [1, 2, 3, ..., n].
  // El primer parámetro del callback (el elemento) no nos interesa, por eso "_".
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // ¿Estamos en los extremos? Lo usamos para "deshabilitar" las flechas.
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  // buildPageURL: construimos la URL real de cada página CONSERVANDO los demás
  // parámetros (texto y filtros). Así cada enlace es una URL compartible como
  // "/search?text=react&page=3". El href es de verdad (accesibilidad, abrir en
  // pestaña nueva) y el onClick hace la navegación instantánea de la SPA.
  const buildPageURL = (pageNumber) => {
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(pageNumber))
    return `${window.location.pathname}?${params.toString()}`
  }

  // Los <a> navegarían de verdad al hacer clic, así que en todos los handlers
  // llamamos a event.preventDefault() para que se comporten como botones.
  const handlePageClick = (event, page) => {
    event.preventDefault()
    onPageChange(page)
  }

  const handlePrevious = (event) => {
    event.preventDefault()
    if (!isFirstPage) onPageChange(currentPage - 1)
  }

  const handleNext = (event) => {
    event.preventDefault()
    if (!isLastPage) onPageChange(currentPage + 1)
  }

  // Estilos en línea para "apagar" visualmente la flecha cuando no se puede usar.
  // En React, style recibe un OBJETO de JavaScript, no un string.
  const disabledStyle = (isDisabled) => ({
    opacity: isDisabled ? 0.4 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    pointerEvents: isDisabled ? 'none' : 'auto',
  })

  return (
    <nav className="pagination">
      {/* Flecha "anterior": deshabilitada si estamos en la página 1 */}
      <a
        href={buildPageURL(currentPage - 1)}
        style={disabledStyle(isFirstPage)}
        onClick={handlePrevious}
        aria-label="Ir a la página anterior"
        aria-disabled={isFirstPage}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M15 6l-6 6l6 6" />
        </svg>
      </a>

      {/* Un enlace por cada número de página. La página actual lleva la clase
          "is-active" (definida en index.css) para destacarla en otro color. */}
      {pages.map((page) => (
        <a
          key={page}
          data-page={page}
          href={buildPageURL(page)}
          className={currentPage === page ? 'is-active' : ''}
          aria-current={currentPage === page ? 'page' : undefined}
          onClick={(event) => handlePageClick(event, page)}
        >
          {page}
        </a>
      ))}

      {/* Flecha "siguiente": deshabilitada si estamos en la última página */}
      <a
        href={buildPageURL(currentPage + 1)}
        style={disabledStyle(isLastPage)}
        onClick={handleNext}
        aria-label="Ir a la página siguiente"
        aria-disabled={isLastPage}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </a>
    </nav>
  )
}
