<!-- Aquí puedes dejar las dudas que tengas sobre el ejercicio -->

### 1. Faltaba el `.env` (el servidor no arrancaba)

El código base llama a `process.loadEnvFile()`, pero la carpeta no traía ningún
`.env`. Sin él, `npm start` peta antes de levantar nada:

```
Error: ENOENT: no such file or directory, open '.env'
```

He creado un `.env` con `PORT=3000` y también un `.env.example` para dejarlo
documentado.

**Duda:** normalmente el `.env` va en el `.gitignore` porque suele tener
secretos. Aquí lo he subido al repo a propósito, porque solo contiene el puerto
(no hay nada sensible) y si no, el ejercicio no arrancaría al clonarlo. ¿Es lo
correcto en este caso o preferís que lo ignore y deje solo el `.env.example`?

### 2. `await json(req)` sí existe, pero hay que importarlo

El README lo menciona como si estuviera disponible sin más, y al principio pensé
que tenía que implementarlo a mano leyendo el stream a trozos. Viendo la clase
C15 encontré que viene del módulo nativo:

```js
import { json } from 'node:stream/consumers'
```

Es lo que uso. Merece la pena saber qué hace por debajo: el body de una petición
no llega como objeto, llega como un **stream** (trozos de bytes que van
cayendo), y `json()` espera a que lleguen todos y los convierte de golpe.

### 3. El array `users` estaba declarado después de `server.listen()`

En el código base, el `const users = [...]` estaba al final del archivo, después
de arrancar el servidor. Técnicamente funciona (el handler solo se ejecuta
cuando llega una petición, y para entonces el módulo ya se ha cargado entero),
pero se lee fatal. Lo he movido arriba, antes del `createServer`.

### 4. Cosas que he añadido por mi cuenta

- **405 Method Not Allowed**: si la ruta existe pero el método no está permitido
  (ej. `DELETE /users`), devolver 404 sería mentir, porque la URL sí es válida.
  Lo aprendí en la clase C14.
- **Validación del body en el POST**: si `name` o `age` no vienen o son del tipo
  equivocado, devuelvo 400. La clase C15 insiste en no fiarse del cliente.
- **Helper `sendJSON()`**: para no repetir `statusCode` + `setHeader` +
  `JSON.stringify` en cada endpoint. Es lo que la clase C12 recomienda, y
  básicamente es el `res.json()` de Express hecho a mano.

### 5. Ojo con `offset` sin `limit`

Si haces `?offset=8` sin poner `limit`, un `.slice(offset, offset + limit)`
directo daría `.slice(8, NaN)` → array vacío. Le he puesto valor por defecto a
cada uno (`offset = 0`, `limit = Infinity`) para que funcionen también sueltos.
