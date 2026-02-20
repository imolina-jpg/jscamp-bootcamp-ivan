const container = document.querySelector('.jobs-listing'); // 1. Selecciona el contenedor donde se mostrarán los trabajos en el HTML [1].
const Search = document.querySelector("#BuscadorEmpleo"); // 2. Selecciona el campo de búsqueda en el HTML [1].

let allJobs = []; // 3. Declara una variable para almacenar todos los trabajos obtenidos del JSON.

function renderJobs(jobsList) { // 4. Crea una función que reciba una lista de trabajos y los renderice en el contenedor del HTML.
    container.innerHTML = ''; // 5. Limpia el contenedor antes de renderizar los trabajos para evitar duplicados.
    jobsList.forEach(job => { // 6. Itera sobre cada trabajo en la lista de trabajos.
        const li = document.createElement('li'); // 7. Crea un elemento de lista para cada trabajo.
        li.className = 'jobsItem'; // Agrega una clase al elemento de lista para aplicar estilos CSS y luego, rellena el contenido del elemento de lista con la información del trabajo
li.innerHTML = `
            <div class="job-info">
                <h3>${job.titulo}</h3>
                <div class="job-meta">
                    <span>${job.data?.tecnologia || ''}</span> | 
                    <span>${job.data?.ubicacion || ''}</span> | 
                    <span>${job.data?.contrato || ''}</span>
                </div>
                <p class="job-description">${job.descripcion}</p>
            </div>
            <button class="button-apply-job">Aplicar</button>
        `;
        container.appendChild(li);
    });
}

fetch('./data.json') // 8. Utiliza la función fetch para obtener los datos del archivo JSON que contiene la información de los trabajos.
    .then(response => response.json())
    .then(data => {
        allJobs = data; // Guardamos una copia de los datos
        renderJobs(allJobs); // Mostramos todos al principio
    })


Search.addEventListener("input", (e) => { // 9. Agrega un event listener al campo de búsqueda para escuchar el evento "input", que se dispara cada vez que el usuario escribe algo en el campo de búsqueda.
    const term = e.target.value.toLowerCase(); // 10. Obtiene el valor ingresado por el usuario en el campo de búsqueda y lo convierte a minúsculas para facilitar la comparación.

    const filtered = allJobs.filter(job => {   // 11. Filtra la lista de trabajos utilizando el método filter, que crea una nueva lista con los trabajos que cumplen con la condición especificada en la función de callback.
        const matchTitulo = job.titulo.toLowerCase().includes(term);  // 12. Verifica si el título del trabajo incluye el término de búsqueda ingresado por el usuario, también convertido a minúsculas para la comparación.
        const dataValues = job.data ? Object.values(job.data) : []; // 13. Obtiene los valores del objeto "data" del trabajo, si existe, y los convierte en un array. Si el objeto "data" no existe, se asigna un array vacío para evitar errores.
        const matchData = dataValues.some(valor =>  // 14. Verifica si alguno de los valores del objeto "data" incluye el término de búsqueda ingresado por el usuario, también convertido a minúsculas para la comparación. Utiliza el método some para comprobar si al menos uno de los valores cumple con la condición.
            valor.toLowerCase().includes(term)
        );   return matchTitulo || matchData;  // 15. Devuelve true si el título del trabajo o alguno de los valores del objeto "data" incluye el término de búsqueda, lo que significa que el trabajo cumple con la condición de filtrado y se incluirá en la lista filtrada.
    });

    renderJobs(filtered); // 16. Llama a la función renderJobs con la lista de trabajos filtrada para actualizar la visualización en el HTML y mostrar solo los trabajos que coinciden con el término de búsqueda ingresado por el usuario.
});
