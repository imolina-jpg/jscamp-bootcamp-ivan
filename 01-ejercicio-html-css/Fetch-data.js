//Puedes import otros archivos js para organizar mejor tu código, en este caso se ha separado por módulos, pero también se puede usar un solo archivo js para todo el proyecto, esto es solo una recomendación para mantener el código más limpio y organizado.

const container = document.querySelector('.jobs-listing'); // 1. Selecciona el contenedor donde se mostrarán los trabajos

fetch('./data.json') // 2. Realiza una solicitud para obtener los datos del archivo "data.json"
  .then((response) => {return response.json()}) //  3.Convierte la respuesta en formato JSON

  .then((jobs) => { //  4. Recibe los datos de los trabajos y los procesa

   jobs.forEach(job => { //  5. Itera sobre cada trabajo en el array de trabajos  
      const li = document.createElement('li') //   6. Crea un nuevo elemento de lista (li) para cada trabajo y le asigna la clase 'jobsItem' y los atributos de datos correspondientes.
      li.className = 'jobsItem'

      li.dataset.tecnologia = job.data.tecnologia
      li.dataset.ubicacion = job.data.ubicacion
      li.dataset.contrato = job.data.contrato
      li.dataset.nivel = job.data.nivel

// 7. Agrega el contenido HTML del trabajo utilizando los datos obtenidos del archivo JSON, luego usamos ${} para insertar los valores dinámicamente (son los que están en el json)

li.innerHTML = ` 
         <div>
            <h3>${job.titulo}</h3>
            <small>${job.data.tecnologia} | ${job.data.ubicacion} | ${job.data.contrato} | ${job.data.nivel}</small>
            <p>${job.descripcion}</p>
          </div> 
         <button class="button-apply-job">Aplicar</button>`
        
    container.appendChild(li) // 8. Agrega el elemento de lista al contenedor de trabajos en el HTML [1].         
  })
  
}) 

  
  .catch((error) => {
    console.error('Error al cargar los datos:', error);
  });