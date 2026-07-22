## Aquí puedes poner tus dudas sobre el ejercicio

### 1. Faltaba el `package.json` (el ejercicio no arrancaba)

El `cli.js` de partida usa `import`, pero la carpeta no traía `package.json`.
Al ejecutar `node cli.js` daba:

```
SyntaxError: Cannot use import statement outside a module
```

Lo he resuelto creando un `package.json` con `"type": "module"`, que es justo lo
que explica la clase C03 ("Ficheros y sistema de módulos"). La otra opción era
renombrar el archivo a `cli.mjs`, pero el README pide expresamente ejecutar
`node cli.js`, así que el `package.json` me pareció el camino correcto.

**Respuesta:**
Excelente! Es lo correcto

### 2. El flag de permisos ya no se llama `--experimental-permission`

La clase C08 enseña `node --experimental-permission index.js`. En Node 24 (la
versión que tengo instalada) ese flag ya se ha estabilizado y se llama
simplemente **`--permission`**, que es además lo que pide el README del
ejercicio.

Comandos que uso para probarlo:

```bash
node --permission cli.js                    # ❌ bloqueado -> mensaje de error
node --permission --allow-fs-read=. cli.js  # ✅ funciona
```

**Duda que me queda:** `process.permission` solo existe cuando arrancas con
`--permission`. Si ejecutas el CLI normal, es `undefined` y no hay nada que
comprobar. Lo he resuelto con un `if (process.permission)` antes de preguntar,
pero no sé si se espera que el CLI *obligue* siempre a usar el modo permisos.

**Respuesta:**
Una cosa que podes hacer un Optional chaining (?.):

```js
if(process.permission?.has('fs.read', folder)) {
  console.error(`
No tienes permisos de lectura para la carpeta ${folder}
Para acceder debes ejecutar node --permission --allow-fs-read=. cli.js 
`)
console.exit(1)
}
```

Y luego seguir con tu flujo normal

**Mi apunte sobre la respuesta:** he aplicado el optional chaining, pero le he
añadido `?? true`:

```js
const puedeLeer = process.permission?.has('fs.read', folder) ?? true
```

Sin el `?? true`, cuando ejecuto `node cli.js .` (sin `--permission`),
`process.permission` es `undefined`, el `?.` corta y devuelve `undefined`, que
es *falsy*. Así que entraba en el `if (!puedeLeer)` y el CLI abortaba siempre,
aunque Node tuviera acceso total. Con `?? true` digo "si no hay nada que
comprobar, damos por hecho que sí puede", y los tres casos funcionan:

```bash
node cli.js .                               # ✅ lista
node --permission cli.js .                  # ❌ mensaje de error (correcto)
node --permission --allow-fs-read=. cli.js  # ✅ lista
```

(En el ejemplo de la respuesta también faltaba el `!` en la condición y
`console.exit` es `process.exit`, pero se entiende la idea.)

### 3. Cómo hacer que los flags funcionen en cualquier orden

Era el punto que más me costó. La clave está en no leer `process.argv` por
índice (`argv[2]`, `argv[3]`...), porque eso obliga a un orden fijo. En vez de
eso separo los argumentos en dos grupos: los que empiezan por `--` son flags, y
el que no, es la ruta. Así da igual dónde escriba cada cosa.

**Respuesta**:
Excelente! Si, es un poco la idea. Vi que lo hiciste con un `Set`, está perfecto!