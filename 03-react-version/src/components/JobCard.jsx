// JobCard: componente "tonto" (presentacional). No tiene lógica propia,
// solo recibe datos por props y los pinta. Así se puede reutilizar para
// cualquier empleo, solo cambia el objeto "job" que le pasamos.
// isRemote, isFeatured e isNew son props booleanas extra (no vienen dentro de "job")
// que usamos para pintar badges de forma condicional.
// Named export: quien importe este archivo siempre lo hará como "{ JobCard }".
export function JobCard({ job, isRemote, isFeatured, isNew }) {
  // Desestructuramos "job" para no tener que escribir job.titulo, job.empresa... cada vez
  const { titulo, empresa, ubicacion, descripcion, data } = job

  return (
    // Cada JobCard es un <li> de la lista <ul className="jobs-listings"> de App.jsx
    <li>
      {/* Clase condicional: si isFeatured es true, añadimos "featured" además de "job-listing-card" */}
      <article className={`job-listing-card${isFeatured ? ' featured' : ''}`}>
        <div>
          <h3>{titulo}</h3>
          {/* data.technology es un array, así que usamos join() para mostrarlo como texto */}
          <small>
            {empresa} · {data.technology.join(', ')} · {ubicacion} · {data.nivel}
          </small>
          {/* "prop && <elemento>" solo renderiza el badge si la prop es true */}
          <div className="badges">
            {isNew && <span className="badge badge-new">🆕 Nuevo</span>}
            {isFeatured && <span className="badge badge-featured">⭐ Destacado</span>}
            {isRemote && <span className="badge badge-remote">🏠 Remoto</span>}
          </div>
          <p>{descripcion}</p>
        </div>
        <button className="button-apply-job">Aplicar</button>
      </article>
    </li>
  )
}
