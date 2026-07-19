import { Navigate } from 'react-router'

import { useAuthStore } from '../store/authStore.js'

/**
 * Envoltorio para rutas que exigen sesión iniciada.
 *
 * Se usa así en App.jsx:
 *   <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
 *
 * <Navigate> es la versión declarativa de "redirige": en cuanto React lo
 * renderiza, cambia la URL. Es como useNavigate() pero sin necesitar un efecto.
 *
 * `replace` hace que la redirección SUSTITUYA la entrada en el historial en vez
 * de añadir una nueva. Sin él, el usuario le daría a "atrás" y volvería a la
 * ruta protegida, que le redirigiría otra vez... quedándose atrapado.
 *
 * Aviso importante: esto es seguridad de INTERFAZ, no de verdad. Cualquiera
 * puede saltárselo desde las DevTools. La protección real siempre tiene que
 * estar en el servidor.
 */
export function ProtectedRoute({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  if (!isLoggedIn) return <Navigate to="/login" replace />

  return children
}
