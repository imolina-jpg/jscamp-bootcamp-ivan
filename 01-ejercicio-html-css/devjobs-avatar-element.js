//las clases son una estructura que nos permiten definir objetos que van a tener diferentes métodos y propiedades.

class DevJobsAvatar extends HTMLElement { //podra heredar las propiedades y metodos que hemos visto hata ahora de los elementos HTML, así no empezamos de cero.
    constructor() {
        super(); //llama al constructor de HTMLElement
        this.attachShadow({ mode: 'open' }); //esto es para crear un shadow DOM, que es una forma de encapsular el contenido del elemento personalizado para que no afecte al resto de la página. El modo 'open' permite acceder al shadow DOM desde fuera del elemento personalizado.
    }




createUrl(service, username) {  //este método es para crear la URL de la imagen del avatar a partir del servicio y el nombre de usuario.
  return `https://unavatar.io/${service}/${username}`
}

//el método render es un método que se llama cada vez que se quiere actualizar el contenido del elemento personalizado.
//aqui definimos el contenido HTML que queremos que tenga nuestro nuevo elemento personalizado. En este caso, es una imagen con la clase "avatar".    
//con Shadow DOM: Los estilos dentro del componente no afectan al resto de la página. Cada instancia del componente tiene su propio árbol DOM encapsulado

render() {

    const service = this.getAttribute('service') ?? 'github' //esto es para obtener el valor del atributo "service" que se le puede pasar al elemento personalizado. Si no se le pasa ningún valor (null o undefined), se le asigna el valor por defecto 'github' usando ?? de esta manera. 
    const username = this.getAttribute('username') ?? 'midudev' //esto es para obtener el valor del atributo "username" que se le puede pasar al elemento personalizado. 
    const size = this.getAttribute('size') ?? '40' 
    const url = this.createUrl(service, username) //esto es para crear la URL de la imagen del avatar a partir del servicio y el nombre de usuario usando el método createUrl que hemos definido ANTES.


    this.shadowRoot.innerHTML = `  
    <style>
        img {
            width: ${size}px;
            height: ${size}px;
            border-radius: 9999px;
        }
    </style>

    <img 
        src="${url}"
        alt="Avatar de ${username}"
        class="avatar"
    />
    `
}

//src="${url}". aqui se asigna la URL de la imagen del avatar que hemos creado con el método createUrl.   
//alt="Avatar de ${username}". aqui se asigna el texto alternativo de la imagen del avatar, que es "Avatar de " seguido del nombre de usuario que se le ha pasado al elemento personalizado.

    connectedCallback() { //el método connectedCallback se llama cada vez que el elemento personalizado se conecta al DOM (Document Object Model). Es decir, cuando se agrega a la página web.
        this.render(); //cuando el elemento se conecta al DOM, se llama al método render para mostrar el contenido definido en el método render.
    }
}
    
customElements.define('devjobs-avatar', DevJobsAvatar); //registra el nuevo elemento personalizado con el nombre 'devjobs-avatar' y la clase DevJobsAvatar

//Ya podriamos usar el elemento <devjobs-avatar> en nuestro HTML para mostrar un avatar personalizado. 