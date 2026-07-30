<!-- Aquí puedes poner tus dudas sobre el ejercicio -->

### 1. Los datos usan tecnologías que el enunciado no lista

El README dice que `Technology` es `'react' | 'node' | 'python' | ...` y ahí no
están ni `'css'` ni `'tailwind'`. Pero los datos de `arrays.ts` sí las usan:
el primer empleo tiene `'tailwind'` y la candidata Ana García tiene `'css'`.

Con el tipo tal cual lo pide el enunciado, `arrays.ts` no compila. He optado por
**añadir las dos al union** y dejarlo comentado en `types.ts`, en vez de tocar
los datos de ejemplo.

**Duda:** ¿era esto a propósito, para que nos diéramos cuenta de que el tipo y
los datos no cuadraban? ¿O lo suyo era cambiar los datos?

**Respuesta:**
Perfecto! La idea es siempre que los types coincidan con los valores que estamos manejando en el código.
Habían varias opciones, lo que hiciste estuvo genial :)

Este problema pasa muchas veces cuando modificamos código existente, y gracias a TypeScript nos damos cuenta de esos cambios que sí podrían afectar a nuestro código.

### 2. Los tres typos de `narrowing.ts`

La plantilla venía con `'junlor'`, `'mib'` y `'seni0r'`. Mientras todo era `any`
no pasaba nada raro *aparentemente*: el código se ejecutaba, pero ninguna de las
tres comparaciones era cierta nunca, así que `requiredYears` siempre salía 8 y
casi ningún candidato pasaba el filtro. En cuanto tipas `job` como `Job`,
TypeScript señala las tres.

Me ha parecido el mejor ejemplo del módulo de "detectar errores antes de
ejecutar": es un bug que en JavaScript puro no te da ningún error, simplemente
devuelve mal.

**Respuesta:**
Excelente! Son cosas que nos da TypeScript que nos puede salvar muchos dolores de cabeza. Por eso es importante tipar y no dejar todo como `any` (algo que VSCode interpreta en la mayoría de casos cuando usamos JavaScript).
Este código en JavaScript se hubiese roto, pero con TS no porque nos alertó antes.

### 3. `filterByTechnology` y el `.toLowerCase()`

La plantilla hacía `job.technologies.includes(tech.toLowerCase())`. Al tipar
`tech` como `Technology`, eso deja de compilar: `toLowerCase()` devuelve un
`string` genérico, y `includes()` de un `Technology[]` no acepta un `string`
cualquiera. Lo he quitado porque los literales ya están todos en minúsculas.

**Duda:** ¿se puede considerar que "arreglar" eso es pasarse del enunciado? Yo
lo veo como parte del ejercicio (el README dice que hay que verificar si la
lógica es correcta), pero prefiero apuntarlo.

**Respuesta:**
Es parte del ejercicio, al final lo que hacemos es resolver problemas, y si hay algún error que afecta el proceso del desarrollo del ejercicio, entonces es buena práctica arreglarlo.

### 4. El `filter` no estrecha el tipo solo

En `tuples.ts` me esperaba que después de
`jobs.filter(job => job.salary !== undefined)` TypeScript ya supiera que no
quedan `undefined`. Pues no: `filter` normal devuelve el mismo tipo que entra.
He tenido que usar un type guard:

```ts
.filter((salary): salary is number => salary !== undefined)
```

**Duda:** ¿es esta la forma habitual en el día a día, o se suele tirar de
`as number[]` y ya? Lo he hecho así porque el enunciado pedía evitar `any`.

**Respuesta:**
Es una buena pregunta, TypeScript es inteligente pero a veces no lo es tanto. Este caso es muy común, y así como este hay otros también.
TS nos ayuda a mejorar nuestro código y nuestra lógica de negocio (sobre todo validando cosas), pero hay veces que por más que la lógica de negocio sea clara, TypeScript no interpreta todo.

La solución que implementaste está bien, otra puede ser:

```ts
jobs.flatMap((job) => 
  job.salary ?? []
)
```

Esto es un poco más complejo y no significa que lo que hayas hecho está mal, es más, me gusta más tu solución.
La explicación del código que te di es la siguiente:

Si tenemos un array con arrays y/o otros valores:
`[3,4,2,[], [], [3], [10]]`

Lo que hace flatMap es aplanar los valores, es decir, sacar el valor que hay en los subarrays hacia el primer nivel:

`[3,4,2,?,?,3,10]`

Puse con `?` los arrays vacíos, y ahí está la magia, si aplanamos un array vacío, al no haber nada, se elimina, y quedaría así:

`[3,4,2,3,10]`

TypeScript interpreta que esto no va a tener valores nulos o undefined, por eso va a interpretar que el array es `number[]`.

Espero se haya entendido, cualquier cosa me avisas si?

### 5. `node index.ts` no comprueba tipos

En la clase de "Ejecutar TypeScript con Node" se dice, pero no lo tenía asumido:
Node **borra** los tipos y ejecuta, no los revisa. O sea que `node index.ts`
puede salir bien y tener el archivo lleno de errores de tipado.

Lo he verificado aparte con `tsc --noEmit` en modo `strict` (0 errores), pero no
he metido el `tsconfig.json` en la entrega porque el README solo pide
`node index.ts`.

**Duda:** ¿debería la entrega llevar su propio `tsconfig.json` y un script de
`check`? Me da la sensación de que en un proyecto real sí.

**Respuesta:**
En un proyecto real si, este que hicimos fue para que se interiorizaran con TypeScript y pudieran avanzar después de aquí.
A la hora de corregir, al entrar en cada ejercicio íbamos a poder ver los errores desde el propio editor de código.