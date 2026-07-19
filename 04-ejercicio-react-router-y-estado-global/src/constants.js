/**
 * Constantes compartidas.
 *
 * Viven aquí, y no dentro de Search.jsx o SearchFormSection.jsx, porque las
 * necesitan los dos: la página para validar el valor de la URL, y el
 * formulario para pintar las opciones del desplegable.
 *
 * Si las dejáramos en uno de los dos y las importara el otro, acabaríamos con
 * imports cruzados difíciles de seguir. Un módulo neutro lo evita.
 */

// Cuántos empleos se muestran por página si el usuario no elige nada.
export const DEFAULT_RESULTS_PER_PAGE = 4

// Opciones del desplegable. Sirve además como lista blanca: cualquier ?limit=
// que no esté aquí se ignora y se usa el valor por defecto.
export const RESULTS_PER_PAGE_OPTIONS = [4, 8, 12]
