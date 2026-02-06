//QueySelector solo recupera un elemento que coincida con el selector
//QuerySelectorAll recupera todos los elementos que coinciden con el selector (una lista)

//OPCIÓN 1

//        const botones = document.querySelectorAll('.button-apply-job');  // Selecciona todos los botones con la clase 'button-apply-job'
//
//        botones.forEach(boton => { // Itera sobre cada botón seleccionado, "por cada boton realiza lo siguiente:"
//         boton.addEventListener('click', () => {
//             boton.textContent = '¡Aplicado!';  // Cambia el texto del botón
//              boton.classList.add('aplicado');   // Agrega una clase para cambiar el estilo
//              boton.disabled = true;              // Deshabilita el botón para evitar múltiples clics
//          });
//        })

//OPCIÓN 2 Recomendada
const MarcoJobsSection = document.querySelector('.MarcoJobs'); // Selecciona el contenedor padre de los trabajos

MarcoJobsSection.addEventListener('click', function(event) {   // Agrega un evento de clic al contenedor, en cualquier lado.
    const element = event.target; // "event.target" Obtiene el elemento que fue clickeado (si pulsas en el titulo te lo devuelve, si pulsas en el boton te devuelve el boton)

    if (element.classList.contains('button-apply-job')) { // Verifica si el elemento clickeado tiene la CLASE 'button-apply-job'
      element.textContent = '¡Aplicado!';  // Cambia el texto del botón
      element.classList.add('aplicado');   // Agrega una clase para cambiar el estilo
      element.disabled = true;              // Deshabilita el botón para evitar múltiples clics
    }

})



//FILTROS


const Filtros = document.querySelector('.Filtros');   // Selecciona el contenedor de los filtros.


Filtros.addEventListener('change', function(event) {   // Agrega un evento de cambio al contenedor de los filtros, en cualquiera de los campos.
const ItemFiltros = event.target;

if(ItemFiltros.id === 'Tecnologia') {  // Verifica si el elemento que cambió es el filtro de tecnología.
  console.log('Tecnología seleccionada:', ItemFiltros.value) // "ItemFiltros.value" Obtiene el valor seleccionado del filtro de tecnología.
}

if(ItemFiltros.id === 'Ubicacion') { // Verifica si el elemento que cambió es el filtro de ubicación.
  console.log('Ubicación seleccionada:', ItemFiltros.value)
}

if(ItemFiltros.id === 'Tipo_de_contrato') { // Verifica si el elemento que cambió es el filtro de tipo de contrato.
  console.log('Tipo de contrato seleccionado:', ItemFiltros.value)
}

if(ItemFiltros.id === 'Nivel_de_experiencia') { // Verifica si el elemento que cambió es el filtro de nivel de experiencia.
  console.log('Nivel de experiencia seleccionado:', ItemFiltros.value)
}

})


//SOCORRO, NO ME FUNCIONA EL FILTRO,

//const Etiquetas = document.querySelectorAll('small'); //Accede a todos los elementos "small"
//    if(Etiquetas===ItemFiltros.value) { // Verifica si el texto de los elementos "small" incluye el valor seleccionado en el filtro.
//         hijos-jobs.classList.add("active"); // Si el texto incluye el valor del filtro, agrega la clase "active" al elemento "li" para mostrarlo.

//    } else{ // Si el texto no incluye el valor del filtro, agrega la clase "hidden" al elemento "li" para ocultarlo.
//        hijos-jobs.classList.add("hidden");
//    }
