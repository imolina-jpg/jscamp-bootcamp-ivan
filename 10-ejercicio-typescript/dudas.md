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

### 2. Los tres typos de `narrowing.ts`

La plantilla venía con `'junlor'`, `'mib'` y `'seni0r'`. Mientras todo era `any`
no pasaba nada raro *aparentemente*: el código se ejecutaba, pero ninguna de las
tres comparaciones era cierta nunca, así que `requiredYears` siempre salía 8 y
casi ningún candidato pasaba el filtro. En cuanto tipas `job` como `Job`,
TypeScript señala las tres.

Me ha parecido el mejor ejemplo del módulo de "detectar errores antes de
ejecutar": es un bug que en JavaScript puro no te da ningún error, simplemente
devuelve mal.

### 3. `filterByTechnology` y el `.toLowerCase()`

La plantilla hacía `job.technologies.includes(tech.toLowerCase())`. Al tipar
`tech` como `Technology`, eso deja de compilar: `toLowerCase()` devuelve un
`string` genérico, y `includes()` de un `Technology[]` no acepta un `string`
cualquiera. Lo he quitado porque los literales ya están todos en minúsculas.

**Duda:** ¿se puede considerar que "arreglar" eso es pasarse del enunciado? Yo
lo veo como parte del ejercicio (el README dice que hay que verificar si la
lógica es correcta), pero prefiero apuntarlo.

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

### 5. `node index.ts` no comprueba tipos

En la clase de "Ejecutar TypeScript con Node" se dice, pero no lo tenía asumido:
Node **borra** los tipos y ejecuta, no los revisa. O sea que `node index.ts`
puede salir bien y tener el archivo lleno de errores de tipado.

Lo he verificado aparte con `tsc --noEmit` en modo `strict` (0 errores), pero no
he metido el `tsconfig.json` en la entrega porque el README solo pide
`node index.ts`.

**Duda:** ¿debería la entrega llevar su propio `tsconfig.json` y un script de
`check`? Me da la sensación de que en un proyecto real sí.
