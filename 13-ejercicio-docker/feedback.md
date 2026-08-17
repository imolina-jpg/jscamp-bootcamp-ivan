<!-- Aquí irá tu feedback -->

Hola! Excelente trabajo! Muy buen ejercicio final :)
Hicimos solo un cambio mínimo en `package.json` para sincronizar el archivo `server.js` del ejercicio 6 entre la imagen y el host:

El script `06:volumenes:run` del `package.json` solo montaba la carpeta `data/` (te dejo el código que tenias para que tengas de referencia):

```json
"06:volumenes:run": "docker run --rm -p 3000:3000 --name midu-visitas midu-visitas"
```

El problema era que, el Dockerfile usa `node --watch` para recargar cuando cambia `server.js` (hasta ahí vamos bien), pero ese archivo vivía dentro de la imagen y no en el host, así que si editábamos `server.js` en el editor, no se reflejaban los cambios en el contenedor.

Para arreglarlo hay que añadir dos bind mounts:

```json
"06:volumenes:run": "docker run --rm -p 3000:3000 -v \"$(pwd)/06-volumenes/server.js:/app/server.js\" -v \"$(pwd)/06-volumenes/data:/app/data\" --name midu-visitas midu-visitas"
```

Lo que hace es:

- `-v "$(pwd)/06-volumenes/server.js:/app/server.js"`: monta el `server.js` del host sobre el del contenedor. Así, cuando lo editas, `node --watch` lo detecta y reinicia el proceso. Que era lo que estaba faltando.
- `-v "$(pwd)/06-volumenes/data:/app/data"`: monta la carpeta `data/` para que `visitas.txt` persista entre reinicios en el proyecto.

Son dos cosas extra pero te la queríamos compartir antes de finalizar el Bootcamp.
Felicidades por llegar hasta aquí! Fue un placer poder ver el avance y el proceso en tus ejercicios.

Un saludo y a disfrutar del Certificado con la Carta de Recomendación!