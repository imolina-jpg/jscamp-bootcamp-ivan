// Página Home (/): página de bienvenida (landing). Ahora tiene un buscador que,
// al enviarlo, NAVEGA a /search llevando el texto en la URL como query string
// (ej. /search?text=react). Usamos navigateTo del custom hook useRouter para
// navegar sin recargar (SPA).
import { useRouter } from '../hooks/useRouter'

export function Home() {
  const { navigateTo } = useRouter()

  const handleSearch = (event) => {
    event.preventDefault()
    // Leemos el valor del input por su atributo name con FormData.
    const formData = new FormData(event.target)
    const searchTerm = formData.get('search')

    // Construimos la URL de destino. encodeURIComponent hace seguro el texto en
    // la URL (convierte espacios y caracteres raros, ej. "node js" → "node%20js").
    let targetUrl = '/search'
    if (searchTerm) {
      targetUrl += `?text=${encodeURIComponent(searchTerm)}`
    }

    navigateTo(targetUrl)
  }

  return (
    <main className="home">
      {/* Título de la pestaña para esta página (React 19 lo lleva al <head>). */}
      <title>DevJobs · Encuentra tu próximo trabajo</title>

      <section className="hero">
        <h1>DevJobs</h1>
        <p>Encuentra el trabajo de tus sueños en desarrollo.</p>

        {/* Buscador de la portada: al enviarlo saltamos a /search con el texto. */}
        <form className="home-search" onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            placeholder="¿Qué trabajo buscas?"
            aria-label="Buscar trabajos"
          />
          <button type="submit" className="cta-button">Buscar trabajos</button>
        </form>
      </section>

      <section className="features">
        <div className="feature">
          <h3>🚀 Oportunidades</h3>
          <p>Cientos de ofertas actualizadas cada día.</p>
        </div>
        <div className="feature">
          <h3>💼 Empresas top</h3>
          <p>Trabaja con las mejores empresas tecnológicas.</p>
        </div>
        <div className="feature">
          <h3>🌍 Remoto</h3>
          <p>Encuentra trabajos remotos desde cualquier lugar.</p>
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <h2>1,500+</h2>
          <p>Ofertas de trabajo</p>
        </div>
        <div className="stat">
          <h2>300+</h2>
          <p>Empresas</p>
        </div>
        <div className="stat">
          <h2>50+</h2>
          <p>Tecnologías</p>
        </div>
      </section>
    </main>
  )
}
