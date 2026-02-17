const MarcoJobsSection = document.querySelector('.MarcoJobs'); // Selecciona el contenedor padre de los trabajos

MarcoJobsSection.addEventListener('click', function(event) {   // Agrega un evento de clic al contenedor, en cualquier lado.
    const element = event.target; // "event.target" Obtiene el elemento que fue clickeado (si pulsas en el titulo te lo devuelve, si pulsas en el boton te devuelve el boton)

    if (element.classList.contains('button-apply-job')) { // Verifica si el elemento clickeado tiene la CLASE 'button-apply-job'
      element.textContent = '¡Aplicado!';  // Cambia el texto del botón
      element.classList.add('aplicado');   // Agrega una clase para cambiar el estilo
      element.disabled = true;              // Deshabilita el botón para evitar múltiples clics
    }

})