import { Link as RouterLink } from 'react-router'

export function Link({ href, to, children, ...restOfProps }) {
  // Aceptamos `href` y `to` para no tener que cambiar los Link que ya existían.
  const destination = to ?? href

  return (
    <RouterLink to={destination} {...restOfProps}>
      {children}
    </RouterLink>
  )
}
