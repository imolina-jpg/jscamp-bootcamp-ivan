// Link: nuestro propio enlace para navegar SIN recargar la página (SPA).
// Un <a> normal recargaría toda la web. Este Link lo evita: cancela la recarga
// con preventDefault() y delega el cambio de ruta en navigateTo() del custom
// hook useRouter (que actualiza la URL y avisa a la app). Así la lógica de
// navegar vive en un solo sitio (el hook) y aquí solo la usamos.
// Recibe "children" (contenido del enlace) y "...props" (className, etc.), que
// reenviamos al <a> con el spread {...props}.
import { useRouter } from '../hooks/useRouter'

// Mejora (ejercicio): el Link detecta si su href es la ruta ACTUAL y, si lo es,
// se añade solo una clase (por defecto "active"). Así podemos resaltar en el menú
// el enlace de la página en la que estamos.
//   - exact=true  → activo solo si la ruta es EXACTAMENTE igual (currentPath === href)
//   - exact=false → activo si la ruta EMPIEZA por href (útil para secciones)
export function Link({
  href,
  children,
  className = '',
  activeClassName = 'active',
  exact = true,
  ...props
}) {
  const { currentPath, navigateTo } = useRouter()

  const isActive = exact ? currentPath === href : currentPath.startsWith(href)
  // Unimos la clase que nos pasen con "active" solo cuando el enlace está activo.
  const finalClassName = isActive ? `${className} ${activeClassName}`.trim() : className

  const handleClick = (event) => {
    event.preventDefault()
    navigateTo(href)
  }

  return (
    <a href={href} className={finalClassName} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
