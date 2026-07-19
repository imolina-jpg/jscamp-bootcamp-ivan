/* Aquí va la lógica para dar funcionalidad al botón de "Aplicar" */

/*
  DESAFÍO 2 | Dar funcionalidad al botón de "Aplicar"

  Al hacer clic en "Aplicar" el botón debe:
    - cambiar su texto a "¡Aplicado!"
    - ponerse verde
    - quedar deshabilitado

  EL PROBLEMA: los botones no existen cuando se carga la página. Los crea
  `fetch-data.js` DESPUÉS, cuando llega la respuesta del fetch. Si hiciéramos
  `document.querySelectorAll('.button-apply-job')` aquí, encontraríamos 0 botones.

  LA SOLUCIÓN: "delegación de eventos". En vez de poner un listener en cada
  botón, ponemos UNO SOLO en el <ul> (que sí existe desde el principio) y
  comprobamos, cuando llega el clic, si lo que se ha pulsado es un botón.
  Ventaja extra: funciona también con los botones que se crean al filtrar.
*/

const listContainer = document.querySelector('.jobs-listings')

listContainer.addEventListener('click', (event) => {
  /*
    `event.target` es el elemento CONCRETO donde se hizo clic.
    Puede ser el título, la descripción, la tarjeta... o el botón.
  */
  const clickedElement = event.target

  // Si lo pulsado no es un botón de aplicar, no hacemos nada y salimos.
  if (!clickedElement.classList.contains('button-apply-job')) return

  clickedElement.textContent = '¡Aplicado!' // Cambiamos el texto
  clickedElement.classList.add('is-applied') // Esta clase ya está en styles.css y lo pone verde
  clickedElement.disabled = true // Lo deshabilitamos para que no se pueda volver a pulsar
})
