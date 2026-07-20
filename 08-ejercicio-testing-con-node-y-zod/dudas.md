<!-- Aquí puedes poner tus dudas del ejercicio -->

### 1. Cómo evitar que el servidor se levante solo al importar la app

El `app.js` que venía ya traía el `listen()` condicionado:

```js
if (!process.env.NODE_ENV) {
  app.listen(PORT, ...)
}
```

El problema es que `node --test` no define `NODE_ENV`, así que al importar la
app el servidor arrancaba en el 5432 por su cuenta, y encima el proceso se
quedaba colgado sin terminar los tests.

Los `import` se hoistean, o sea que poner `process.env.NODE_ENV = 'test'` arriba
del archivo no sirve de nada: la app ya se ha ejecutado antes. Lo he resuelto
cargándola con `import()` dinámico, que sí ocurre en orden:

```js
process.env.NODE_ENV = 'test'
const { default: app } = await import('./app.js')
```

**Duda:** ¿es preferible esto o meter `cross-env NODE_ENV=test` en el script de
npm? Lo segundo obliga a instalar una dependencia solo para eso, y el enunciado
insiste en no meter dependencias externas, por eso he tirado por el import
dinámico.

### 2. Un bug real que ha salido gracias a los tests

Justo lo que decía la clase que pasaría. En `models/job.js` el filtro por texto
estaba así:

```js
const normalizeTech = () => text.toLowerCase()

const matchText = text
  ? job.titulo.toLowerCase().includes(normalizeTech)   // <- pasa la FUNCIÓN
  || job.descripcion.toLowerCase().includes(normalizeTech)
  : true
```

`includes(normalizeTech)` recibía la función sin llamar, así que comparaba
contra el texto de la propia función y no encontraba nada nunca. Lo he cambiado
a una constante ya normalizada.

De paso he puesto `(job.descripcion ?? '')` porque `descripcion` es opcional en
el schema: en cuanto creas un job por POST sin descripción, cualquier búsqueda
por texto reventaba con un 500.

### 3. Los tests que mutan datos y el orden de ejecución

El enunciado pide que los tests sean independientes y que no dependan del orden,
pero los datos están en memoria y el DELETE borra de verdad.

Si el test de DELETE usara el ID que sugiere el README (`f62d8a34...`), sería el
mismo que usa el de PATCH y el resultado dependería de cuál corriera antes. Para
evitarlo, en el test de DELETE creo un job con un POST y borro ese. Así no piso
los datos del JSON y el test se puede ejecutar solo.

**Duda:** ¿se esperaba que usara literalmente los IDs del enunciado aunque
acoplara los tests entre sí?

### 4. Validación en el PUT

El enunciado dice que `validateJob` se usa en POST **y** en PUT, pero en las
rutas que venían el PUT no tenía middleware. Se lo he añadido.

Tiene sentido: si el PUT reemplaza el recurso entero, tiene que llegar completo
y válido, igual que en una creación. El PATCH se queda con `validatePartialJob`.
