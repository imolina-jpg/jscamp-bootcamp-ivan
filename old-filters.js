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



//FILTROS primera parte, solo muestra en consola lo que se selecciona en cada filtro. 


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

//FILTROS (beta) segunda parte, agrega o quita clases a los trabajos dependiendo de si cumplen o no con el filtro seleccionado. 

const ItemsJobs = document.querySelectorAll('.jobsItem'); // Selecciona todos los elementos de trabajo.
const etiquetas = document.querySelectorAll('.etiquetas'); // Selecciona todos los elementos con la clase 'etiquetas' dentro de los trabajos.

 ItemsJobs.forEach(Item => { // Itera sobre cada elemento de trabajo, "por cada item realiza lo siguiente:"
  if (ItemFiltros.value === "" ||Item.querySelector('.etiquetas').textContent.includes(ItemFiltros.value) ) {
     console.log('El item cumple con el filtro:', Item); // Verifica si el texto dentro del elemento de trabajo contiene el valor seleccionado del filtro.
     Item.style.display = 'flex'; // Si el item cumple con el filtro, se muestra el elemento de trabajo.
    } else {
    console.log('El item no cumple con el filtro:', Item);
    Item.style.display = 'none'; // Si el item no cumple con el filtro, se oculta el elemento de trabajo.
  } 
 })

})



    //APUNTES:
    //  🔴 Se dispara con cada pulsación de tecla o cambio en el texto
    //searchInput.addEventListener('input', function() {
    // Muestra en la consola el texto actual del buscador mientras escribes
    // console.log(searchInput.value); 
    //});

    // 🔴 Se dispara cuando el cursor sale del campo de texto
    // searchInput.addEventListener('blur', function() {
    //    console.log('Se dispara cuando el campo pierde el foco');
    // });


  // 🔴 Se dispara cuando el formulario se envía, ya sea por un botón de envío o al presionar Enter
  //  const formulario = document.getElementById('formulario')
  //  formulario.addEventListener('submit', function (event) {
  //   event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada
  //    console.log('Formulario enviado') 
  //    })

// 🔴 event. preventDefault() es un método que se utiliza para evitar el comportamiento predeterminado de un evento.
//  event.preventDefault()
//  console.log('Formulario enviado')
// })

// 🔴 Se dispara con cada pulsación de tecla, muestra en la consola la tecla que se presionó. Su contrario es " keyup "
// document.addEventListener('keydown', function (event) {
//  console.log('Tecla presionada:', event.key)
// })