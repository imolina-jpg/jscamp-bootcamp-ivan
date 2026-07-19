// Pagination: recibe la página actual y el total de páginas, y pinta los
// enlaces de navegación. Si no se le pasan props, usa los valores por defecto
// (currentPage = 1, totalPages = 5) gracias a la sintaxis "prop = valor".

// CSS MODULE: importamos las clases locales como un objeto "styles".
// styles.pagination y styles.isActive son los nombres únicos que genera Vite,
// así estos estilos no chocan con los de ningún otro componente.
import styles from './Pagination.module.css'

// onPageChange es un CALLBACK: una función que nos pasa el padre (App) y que
// llamamos aquí para avisarle "oye, el usuario quiere ir a esta página".
// Pagination no cambia nada por sí mismo, solo "informa" al padre.

// Buena práctica (de la lección): le damos a onPageChange un valor por defecto
// que es una función vacía "() => {}". Así, si algún día usamos <Pagination />
// sin pasarle onPageChange, el componente NO se rompe: al llamar onPageChange(page)
// simplemente ejecuta la función vacía en lugar de dar el error
// "onPageChange is not a function".
export function Pagination({ currentPage = 1, totalPages = 5, onPageChange = () => {} }) {
  // Array.from({ length: totalPages }, (_, i) => i + 1) crea [1, 2, ..., totalPages]
  // sin tener que escribir un bucle a mano.
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // buildPageURL: construye la URL de una página CONSERVANDO los demás parámetros
  // (texto, filtros...). Así cada enlace es una URL real y compartible como
  // "/search?text=react&page=3", y al recargar se mantiene el estado.
  // Ponemos esta URL en el href (bueno para accesibilidad y "abrir en pestaña
  // nueva"); el onClick sigue haciendo la navegación instantánea de la SPA.
  const buildPageURL = (pageNumber) => {
    const url = new URL(window.location.href)
    url.searchParams.set('page', String(pageNumber))
    return `${url.pathname}?${url.searchParams.toString()}`
  }

  // Los <a> son enlaces reales, así que por defecto el navegador intentaría
  // "navegar" al hacer click (recargando la página). e.preventDefault() evita
  // eso, para que el click se comporte como un botón dentro de la SPA.
  const handlePrevious = (e) => {
    e.preventDefault()
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (e, page) => {
    e.preventDefault()
    onPageChange(page)
  }

  const styleLinkLeft = {
    opacity: currentPage === 1 ? 0.5 : 1,
    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
  }
  const styleLinkRight = {
    opacity: currentPage === totalPages ? 0.5 : 1,
    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
  }

  return (
    <nav className={styles.pagination}>
      <a
        href={buildPageURL(currentPage - 1)}
        style={styleLinkLeft}
        onClick={handlePrevious}
        aria-label="Ir a la página anterior de los resultados de búsqueda"
        title="Página anterior"
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

      {/* .map() recorre "pages" y devuelve un <a> por cada número.
          "key" es obligatorio: le dice a React cómo identificar cada elemento de la lista. */}
          
      {pages.map((page) => (
        <a
          key={page}
          className={currentPage === page ? styles.isActive : ''}
          href={buildPageURL(page)}
          onClick={(e) => handlePageClick(e, page)}
        >
          {page}
        </a>
      ))}

      <a
        href={buildPageURL(currentPage + 1)}
        style={styleLinkRight}
        onClick={handleNext}
        aria-label="Ir a la página siguiente de los resultados de búsqueda"
        title="Página siguiente"
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
          className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </a>
    </nav>
  )
}
