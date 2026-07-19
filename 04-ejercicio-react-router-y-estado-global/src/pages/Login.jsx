import { Navigate, useNavigate } from 'react-router'

import { useAuthStore } from '../store/authStore.js'

export function LoginPage() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  // Si ya has iniciado sesión, esta página no tiene sentido: te mandamos
  // a tu perfil directamente.
  if (isLoggedIn) return <Navigate to="/profile" replace />

  const handleSubmit = (event) => {
    event.preventDefault()
    login()
    // Tras entrar, llevamos al usuario a su perfil.
    navigate('/profile', { replace: true })
  }

  return (
    <main className="page">
      <title>Iniciar sesión - DevJobs</title>

      <h1 style={{ display: 'block', marginBottom: '0.5rem' }}>Iniciar sesión</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Este login es de mentira: no valida nada, solo simula la sesión para
        practicar el estado global.
      </p>

      <form onSubmit={handleSubmit} style={{ maxWidth: '24rem' }}>
        <button type="submit" className="button-apply-job">
          Entrar
        </button>
      </form>
    </main>
  )
}

export default LoginPage
