<!-- Aquí puedes poner tus dudas del ejercicio -->

### 1. Rechazar un origen en CORS: ¿error o simplemente no mandar la cabecera?

Mi primera versión del middleware hacía `callback(new Error('No permitido por CORS'))`
cuando el origen no estaba en la lista. Al probarlo vi que eso hace que Express
devuelva un **500 Internal Server Error**, y eso no me cuadraba: el servidor no
se ha roto, simplemente no autoriza ese origen.

Al final lo he dejado con `callback(null, false)`, que responde normal pero
**sin** la cabecera `Access-Control-Allow-Origin`. El navegador ve que falta y
bloquea la respuesta él solo, que es justo como funciona CORS.

Comprobado con curl:

```bash
curl -I -H "Origin: http://localhost:5173" localhost:1234/jobs
# HTTP/1.1 200 OK
# Access-Control-Allow-Origin: http://localhost:5173

curl -I -H "Origin: http://evil.com" localhost:1234/jobs
# HTTP/1.1 200 OK   (sin cabecera -> el navegador lo bloquea)
```

**Duda:** ¿preferís que devuelva un 403 explícito en vez de dejar que lo bloquee
el navegador? También me ha quedado claro que CORS **no** es seguridad real del
servidor: con curl se salta entero, porque solo lo respetan los navegadores.

### 2. `total` en la respuesta: ¿antes o después de paginar?

En `GET /jobs` devuelvo `{ data, total, limit, offset }`. He hecho que `total`
sea el número de jobs que coinciden con los filtros **antes** de aplicar el
`slice()` de la paginación, no la longitud de `data`.

Lo razoné así: si `total` fuera igual a `data.length`, el dato no serviría de
nada. Así el frontend puede pintar "mostrando 10 de 34" y calcular cuántas
páginas hay. Si no era eso lo que se pedía, se cambia en una línea del modelo.

### 3. Diferencia real entre PUT y PATCH

Sobre el papel lo tenía claro, pero al probarlo se ve mucho mejor:

```bash
# PUT: reemplaza el job ENTERO. Los campos que no mando se pierden.
curl -X PUT .../jobs/ID -d '{"titulo":"SRE","empresa":"CloudTech"}'
# -> descripcion, data y content desaparecen

# PATCH: solo toca lo que le mando, lo demás se queda igual.
curl -X PATCH .../jobs/ID -d '{"ubicacion":"Barcelona"}'
# -> titulo y empresa se conservan
```

En el modelo la diferencia es literalmente el spread: `partialUpdate` hace
`{ ...jobs[index], ...cambios }` y `update` construye el objeto desde cero.

En los dos casos pongo el `id` al final para que el cliente no pueda
sobrescribirlo mandándolo en el body.

### 4. Detalles que me encontré por el camino

- **El README menciona `models/job.js`** (singular) en la estructura final,
  pero el archivo que venía en el repo es `models/jobs.js` (plural). He dejado
  el que ya existía.
- **`node_modules` no estaba ignorado**: he añadido un `.gitignore`. Sin él se
  habrían subido al repo los 69 paquetes que instala `npm install`.
- **Puerto 1234 y no 3000**: el `app.js` base traía `const PORT = 3000`
  hardcodeado, pero el `config.js` que pide el enunciado dice `PORT: 1234`, y
  los ejemplos de curl del README también usan 1234. He hecho caso al enunciado
  y lo he sacado a `config.js`.
- **Sobre el deploy en Vercel** (clase C30): llegué a dejar `app.js` exportando
  la app y con el `app.listen()` condicionado a `NODE_ENV`, tal y como enseña
  esa clase. Lo he quitado porque el enunciado de este ejercicio no pide
  desplegar nada, y condicionar el arranque significaba que el servidor no
  levantaba si alguien ejecutaba con `NODE_ENV=production`. Prefiero que el
  ejercicio haga exactamente lo que se pide y nada más.
