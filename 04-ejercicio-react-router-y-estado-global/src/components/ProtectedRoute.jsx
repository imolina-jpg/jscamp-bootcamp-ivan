import { Navigate } from 'react-router'

import { useAuthStore } from '../store/authStore.js'

// Esto solo protege la interfaz. La protección de verdad va en el servidor.
// El `replace` es para que al dar a "atrás" no se quede en un bucle.
export function ProtectedRoute({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  if (!isLoggedIn) return <Navigate to="/login" replace />

  return children
}
