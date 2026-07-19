// Link: nuestro propio "enlace" para navegar dentro de la SPA.
//
// Un <a href="/search"> normal recargaría toda la página (perdiendo el estado de
// React y volviendo a descargar todo). Este Link evita esa recarga con
// event.preventDefault() y delega el cambio de ruta en navigateTo() de useRouter.
//
// Ojo: seguimos pintando un <a> real con su href. Eso es importante para la
// accesibilidad y para que funcione "abrir en pestaña nueva" o el clic derecho.
import { useRouter } from '../hooks/useRouter'

// Props:
//   - href: a dónde vamos
//   - children: el contenido del enlace (texto, iconos, lo que sea)
//   - ...props: cualquier otro atributo (className, title...) que reenviamos al <a>
export function Link({ href, children, ...props }) {
  const { navigateTo } = useRouter()

  const handleClick = (event) => {
    event.preventDefault() // cancelamos la navegación normal del navegador
    navigateTo(href) // y navegamos "a la manera SPA"
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
