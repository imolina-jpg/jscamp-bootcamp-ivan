<!-- Aquí puedes poner tus dudas del ejercicio -->

### 1. He tenido que tocar la app del módulo anterior

Los tests que pide el enunciado no se podían escribir contra mi app tal y como
estaba. Son tres cambios en `04-ejercicio-react-router-y-estado-global`:

- **`Home.jsx`: `type="text"` -> `type="search"`.** Es literalmente lo que se ve
  en la clase: `getByRole('searchbox')` falla porque un `type="text"` tiene rol
  `textbox`. Con `type="search"` el rol se asigna solo. Lo he cambiado también
  en el buscador de la página `/search`, por coherencia.
- **`Pagination.jsx`: `aria-label` en las flechas.** Los enlaces de anterior y
  siguiente solo llevan un SVG dentro, así que se quedaban sin nombre accesible
  y no había forma de pillarlos con `getByRole('link', { name: 'Siguiente' })`.
- **`Detail.jsx`: el botón de aplicar era inerte.** Ponía "Aplicar ahora" y no
  tenía `onClick`, así que nunca podía cambiar a "Aplicado". Le he puesto el
  mismo `useState` que ya usaba `JobCard.jsx`.

Los tres van en la línea de lo que se explica en clase: si el test no encuentra
el elemento, muchas veces el problema no es el selector sino el HTML.

**Duda:** ¿era esto lo esperado, o se daba por hecho que la app ya venía así?

**Respuesta:**
Si! Totalmente. Si getByRole('searchbox') no encuentra la parte de la aplicación que queremos testear, la app no es accesible, y eso no se arregla con un selector más flojo. Los tres cambios que hiciste son exactamente eso:
- type="search"
- aria-label en flechas con SVG
- Botón "Aplicar" funcional

En resumen, lo hiciste perfecto! No hay que bajar el nivel de los test, hay que mejorar el nivel de la aplicación

### 2. Con "React" no se podía probar la paginación

El enunciado dice "hacer una búsqueda que devuelva más de x resultados". Mi app
pagina de 4 en 4 y la API devuelve exactamente 4 resultados para "React" y 1
para "JavaScript", o sea que en los dos casos sale una sola página y no hay nada
que paginar.

Al final el test de paginación entra directo a `/search` sin filtros, que trae
los 34 empleos y da 9 páginas.

### 3. El estado "Aplicado" no sobrevive a nada

Es `useState` local, tanto en la tarjeta como en el detalle. Si navegas o
recargas, vuelve a "Aplicar". Los tests lo comprueban en la misma vista, sin
recargar, porque de otra forma fallarían.

**Duda:** ¿debería haberlo subido a Zustand y persistirlo, o para este ejercicio
vale con el estado local? Lo he dejado como estaba porque el módulo anterior ya
estaba entregado así.

**Respuesta:**
No hace falta. Si haces la modificación el ejercicio se iría del foco de los test E2E, mejor dejarlo así y testear el cambio de estado en la misma vista.

### 4. Dos fallos que me salieron y por qué

Los apunto porque me costó entenderlos:

- **El `h1` del detalle daba "strict mode violation"**: el logo del header
  también es un `h1`, así que había dos. Lo he arreglado buscando por nombre
  (el título del empleo) en vez de solo por nivel.
- **El filtro de "Remoto" fallaba a veces**: al cambiar el filtro la lista se
  vacía y se vuelve a pintar, y si leo las tarjetas justo en ese hueco me
  encuentro cero. Con `expect.poll` reintenta hasta que la lista está pintada.
  Es el típico test que pasa en local y falla un día sí y otro también.

### 5. La parte de Stagehand

No la he hecho. El README dice que es opcional y necesita una `OPENAI_API_KEY`
o montar Ollama en local. He visto las clases de Stagehand y la de agentes para
entender el concepto, pero no he escrito código.
