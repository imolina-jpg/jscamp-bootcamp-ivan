// QUINTA PARTE | Lógica del filtrado.
//
// Esta función es JavaScript puro: no sabe nada de React ni de componentes.
// Sacarla a su propio archivo tiene dos ventajas:
//   1. La página Search queda centrada en "qué pintar", no en "cómo filtrar".
//   2. Es fácil de probar y de reutilizar.

// normalize: pasa a minúsculas y quita los acentos, para que buscar "programacion"
// encuentre también "programación". El truco de normalize('NFD') separa la letra
// de su tilde, y el replace borra esas tildes sueltas (rango ̀-ͯ).
const normalize = (text = '') =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

// En data.json el nivel aparece a veces como "mid" y a veces como "mid-level".
// Los unificamos para que el filtro "Mid-level" encuentre los dos.
const normalizeLevel = (level = '') => (level === 'mid-level' ? 'mid' : level)

// filterJobs recibe TODOS los empleos y los filtros, y devuelve un array NUEVO
// con los que coinciden. Nunca modificamos el array original (inmutabilidad):
// .filter() siempre crea uno nuevo, que es justo lo que React necesita.
export function filterJobs(jobs, { text, technology, location, experience }) {
  const searchText = normalize(text)

  return jobs.filter((job) => {
    // Búsqueda por texto libre: miramos título, empresa, ubicación y descripción.
    // Si no hay texto escrito, esta condición es true y no filtra nada.
    const matchesText =
      searchText === '' ||
      normalize(job.titulo).includes(searchText) ||
      normalize(job.empresa).includes(searchText) ||
      normalize(job.ubicacion).includes(searchText) ||
      normalize(job.descripcion).includes(searchText)

    // Cada select: si está vacío ('') no filtra; si tiene valor, debe coincidir.
    const matchesTechnology = technology === '' || job.data.technology === technology
    const matchesLocation = location === '' || job.data.modalidad === location
    const matchesExperience = experience === '' || normalizeLevel(job.data.nivel) === experience

    // Solo pasa el empleo que cumple TODAS las condiciones a la vez.
    return matchesText && matchesTechnology && matchesLocation && matchesExperience
  })
}
