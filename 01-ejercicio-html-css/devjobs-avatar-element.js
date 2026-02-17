//las clases son una estructura que nos permiten definir objetos que van a tener diferentes métodos y propiedades.

class DevJobsAvatar extends HTMLElement { //podra heredar las propiedades y metodos que hemos visto hata ahora de los elementos HTML, así no empezamos de cero.
    constructor() {
        super(); //llama al constructor de HTMLElement
        this.attachShadow({ mode: 'open' }); //esto es para crear un shadow DOM, que es una forma de encapsular el contenido del elemento personalizado para que no afecte al resto de la página. El modo 'open' permite acceder al shadow DOM desde fuera del elemento personalizado.
    }

render() { //el método render es un método que se llama cada vez que se quiere actualizar el contenido del elemento personalizado.
//aqui definimos el contenido HTML que queremos que tenga nuestro nuevo elemento personalizado. En este caso, es una imagen con la clase "avatar".    

    this.innerHTML = `  
        <img
        src="https://avatars.githubusercontent.com/u/60507236?v=4"
        alt="Avatar de DevJobs"
        class="avatar"
        style="width: 40px; height: 40px; border-radius: 50%;"
        />
    `
}

    connectedCallback() { //el método connectedCallback se llama cada vez que el elemento personalizado se conecta al DOM (Document Object Model). Es decir, cuando se agrega a la página web.
        this.render(); //cuando el elemento se conecta al DOM, se llama al método render para mostrar el contenido definido en el método render.
    }
}
    
customElements.define('devjobs-avatar', DevJobsAvatar); //registra el nuevo elemento personalizado con el nombre 'devjobs-avatar' y la clase DevJobsAvatar

//Ya podriamos usar el elemento <devjobs-avatar> en nuestro HTML para mostrar un avatar personalizado. 