//QueySelector solo recupera un elemento que coincida con el selector
//QuerySelectorAll recupera todos los elementos que coinciden con el selector (una lista)

const botones = document.querySelectorAll('.button-apply-job');  // Selecciona todos los botones con la clase 'button-apply-job'

botones.forEach(boton => { // Itera sobre cada botón seleccionado, "por cada boton realiza lo siguiente:"
    boton.addEventListener('click', () => {
        boton.textContent = '¡Aplicado!';  // Cambia el texto del botón
        boton.classList.add('aplicado');   // Agrega una clase para cambiar el estilo
        boton.disabled = true;              // Deshabilita el botón para evitar múltiples clics
    });
})