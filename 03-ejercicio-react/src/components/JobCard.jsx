// TERCERA PARTE | Uso de Props.
//
// JobCard: la tarjeta de UN empleo. Es un componente presentacional: no sabe de
// dónde vienen los datos ni cómo se filtran, solo recibe un objeto "job" por
// PROPS y lo pinta. Por eso se puede reutilizar para cualquier empleo.
import { useState } from 'react'

export function JobCard({ job }) {
  // DESESTRUCTURACIÓN: sacamos las propiedades de "job" a variables sueltas
  // para no escribir job.titulo, job.empresa... una y otra vez.
  const { titulo, empresa, ubicacion, descripcion, data } = job

  // ESTADO LOCAL de la tarjeta: ¿el usuario ya ha pulsado "Aplicar"?
  // Cada JobCard tiene su propio "applied" independiente del resto: el estado
  // vive dentro de cada instancia del componente.
  const [applied, setApplied] = useState(false)

  // Clase condicional: si ya aplicó, añadimos "is-applied" (verde, ver index.css).
  // Usamos template literals (`...`) para concatenar clases.
  const buttonClasses = `button-apply-job${applied ? ' is-applied' : ''}`
  const buttonText = applied ? 'Aplicado ✓' : 'Aplicar'

  // La API devuelve data.technology como ARRAY (["react", "node"]), mientras que
  // el data.json local lo tenía como texto. Array.isArray comprueba cuál de los
  // dos nos ha llegado y join(', ') convierte el array en "react, node".
  // Así el componente funciona con las dos fuentes de datos.
  const technologies = Array.isArray(data.technology)
    ? data.technology.join(', ')
    : data.technology

  return (
    <article
      className="job-listing-card"
      // Los atributos data-* son atributos HTML válidos y personalizados.
      // Los dejamos porque describen el empleo y facilitan depurar en el navegador.
      data-modalidad={data.modalidad}
      data-nivel={data.nivel}
      data-technology={technologies}
    >
      <div>
        <h3>{titulo}</h3>
        <small>
          {empresa} | {ubicacion} | {technologies}
        </small>
        <p>{descripcion}</p>
      </div>

      {/* onClick recibe una FUNCIÓN, no su resultado. Por eso escribimos
          () => setApplied(true) y no setApplied(true) directamente (eso se
          ejecutaría en cada render y provocaría un bucle infinito). */}
      <button className={buttonClasses} onClick={() => setApplied(true)}>
        {buttonText}
      </button>
    </article>
  )
}
