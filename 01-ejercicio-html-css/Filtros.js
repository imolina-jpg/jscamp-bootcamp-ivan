const Filtros = document.querySelector('.Filtros');   // Selecciona el contenedor de los filtros.
const selectedValue = Filtros.value; // Obtiene el valor seleccionado del filtro.

Filtros.addEventListener('change', function(event) {   // Agrega un evento de cambio al contenedor de los filtros, en cualquiera de los campos.
  const jobs = document.querySelectorAll('.jobsItem'); // Selecciona todos los elementos con la clase 'jobsItem', que representan cada oferta de trabajo.
  const selectedValue = event.target.value; // Obtiene el valor seleccionado del filtro actualizado.

jobs.forEach(job => {
  const tecnologia = job.dataset.tecnologia; // Obtiene el valor del atributo "data-tecnologia" del elemento de trabajo.
  const modalidad = job.dataset.ubicacion; // Obtiene el valor del atributo "data-ubicacion" del elemento de trabajo.
  const contrato = job.dataset.contrato;
  const nivel = job.dataset.nivel;

  if (selectedValue === '' ||  selectedValue === tecnologia || selectedValue === modalidad || selectedValue === contrato || selectedValue === nivel) {
    // Verifica si el valor seleccionado está vacío o coincide con la tecnología, modalidad, contrato o nivel del trabajo.
    job.classList.remove('is-hidden'); // Muestra el trabajo si el filtro está vacío o coincide con la modalidad del trabajo.
  } else {
    job.classList.add('is-hidden'); // Oculta el trabajo si no coincide con el filtro.
  }

  });
});