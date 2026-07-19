import { Link as RouterLink } from 'react-router'

/**
 * Nuestro <Link> ahora es una "envoltura" (wrapper) sobre el <Link> de React Router.
 *
 * La idea importante: NO hemos ido por toda la app cambiando <Link href="..."> por
 * <Link to="...">. Hemos cambiado el componente POR DENTRO, así que Header.jsx y
 * cualquier otro sitio que ya lo usaba siguen funcionando sin tocarlos.
 *
 * A esto se le llama "abstraer la dependencia": la app depende de NUESTRO Link,
 * no de React Router. Si mañana cambiamos de librería de rutas, solo tocamos
 * este archivo.
 *
 * Toda la fontanería que teníamos antes (preventDefault, pushState, disparar un
 * evento popstate a mano) ya la hace React Router por nosotros.
 */
export function Link({ href, to, children, ...restOfProps }) {
  // React Router llama `to` a lo que nosotros llamábamos `href`.
  // Aceptamos los dos nombres para no romper el código que ya existía.
  const destination = to ?? href

  return (
    <RouterLink to={destination} {...restOfProps}>
      {children}
    </RouterLink>
  )
}
