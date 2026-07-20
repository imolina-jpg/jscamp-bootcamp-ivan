# Aquí puedes dejar tus dudas

## Primera parte

- Al migrar `useRouter` a `useNavigate`, la app entró en un bucle infinito de
  renders ("Maximum update depth exceeded"). El motivo: `navigateTo` era una
  función nueva en cada render y `Search.jsx` la tenía como dependencia de un
  `useEffect`. Se arregló envolviéndola en `useCallback`. **Duda:** ¿es mejor
  devolver directamente el `navigate` de React Router en vez de envolverlo,
  o merece la pena mantener el envoltorio por si algún día cambiamos de router?

- En unas lecciones importan de `react-router-dom` y en otras de `react-router`
  a secas, y me hice un lío. Al final lo he dejado en `react-router` porque es
  así como me funcionaba con la versión que tengo instalada, pero no sé si
  `react-router-dom` ya no se usa o es que da igual cuál de los dos pongas.

## Segunda parte

- El README pide la ruta `/job/:id` y el archivo `Detail.jsx`, pero en las clases
  se usa `/jobs/:id` y `JobDetail.jsx`. Hemos seguido el README por ser lo
  evaluable. ¿Es correcto?

- Para enlazar la tarjeta al detalle sin romper el botón "Aplicar", hemos
  enlazado solo el bloque de texto, porque meter un `<button>` dentro de un
  `<a>` es HTML inválido. Coincide con la "Solución 3 (híbrida)" que propone
  la lección 6. **Duda:** si se quiere que TODA la tarjeta sea clicable,
  ¿la forma correcta es el truco del "stretched link" con `position: absolute`?

- En la lección 5 dicen que ya viene un `detail.module.css` con los estilos
  hechos, pero yo no lo encuentro por ningún lado. Al final me los he escrito
  yo enteros en `src/pages/Detail.module.css` y me llevó un buen rato. ¿Ese
  archivo tenía que estar ahí y se me ha pasado bajarlo de algún sitio?

- No hemos podido hacer la comparación "pixel por pixel" que pide la lección 7:
  el proyecto de Stitch solo deja ver miniaturas al 17% y no permite ampliar
  cada pantalla. Sí hemos corregido con lo que se distingue: el título de la
  última sección es "Acerca de la empresa" (no "Sobre la empresa") y el diseño
  repite el botón de aplicar al final del contenido.

## Tercera parte

- Con `useSearchParams`, el input de texto lo hemos dejado sin controlar
  (`defaultValue`) porque con el debounce de 500 ms daba saltos raros al
  escribir. Los selects sí van controlados. ¿Hay una forma limpia de tenerlo
  controlado y con debounce a la vez?

- **Ejercicio 3 de la lección 8 (bug de `append`), hecho y comprobado.** Al
  cambiar `set` por `append` y tocar el filtro tres veces, la URL queda
  `?technology=react&technology=python&technology=java`. Lo llamativo es que
  no solo ensucia la URL: `searchParams.get()` devuelve **el primer** valor,
  así que el select se queda mostrando "react" y los resultados siguen siendo
  los de react aunque el usuario haya elegido "java". La interfaz miente.
  Con `set` se queda en `?technology=java` y todo cuadra.

- **Ejercicio 1 de la lección 8 (filtro nuevo).** El enunciado propone añadir
  un filtro `seniority` con valores junior/mid/senior. Ese filtro **ya existe**
  en el proyecto: es el select "Nivel de experiencia", que manda `level` a la
  API con esos mismos valores, se inicializa desde la URL y se actualiza junto
  a los demás. Cumple los tres requisitos del ejercicio tal cual está.
  **Duda:** ¿se esperaba añadir un filtro distinto además de ese?

- **Ejercicio 2 de la lección 8:** no había nada que convertir. Todos los
  `useState` del proyecto se inicializan con literales (`false`, `null`, `[]`).
  Los que sí leían de la URL desaparecieron al pasar los filtros a
  `useSearchParams`.

## Cuarta parte

- Verificado con Coverage: en `/` solo se descargan `index.js` y `Home.js`.
  Al navegar a `/search` aparece `Search.js`. **Duda:** ¿merece la pena
  precargar la página siguiente al pasar el ratón por encima del enlace
  (prefetch), o eso ya es sobreoptimizar para un proyecto así?

## Quinta parte

- `NavLink` añade solo `aria-current="page"`. ¿Es suficiente para accesibilidad
  o conviene además desactivar el enlace de la página actual?

## Sexta parte

- **Hueco reconocido (lección 12).** La clase pide montar el prop drilling a
  propósito: estado `isLoggedIn` en `App.jsx`, bajarlo por props a `Header` y
  al detalle, trocear la página de detalle en subcomponentes y observar con
  React DevTools cómo se re-renderiza media app al iniciar sesión. **Ese paso
  no se hizo**: se saltó directamente a Context y de ahí a Zustand.
  Lo permanente de la clase sí está (botón de iniciar/cerrar sesión y botón de
  aplicar deshabilitado sin sesión, con los textos de la lección), pero la
  experiencia de "sufrir" el problema se perdió. Rehacerlo ahora obligaría a
  revertir Zustand, así que se deja documentado. **Duda:** ¿merece la pena
  reproducirlo en una rama aparte solo para verlo con las DevTools?

- Me saltaba un error de ESLint (`react-refresh/only-export-components`) por
  tener el Provider y el hook `useAuth` en el mismo archivo. Lo arreglé
  separándolos en dos, `useAuth.js` y `authContext.jsx`, y así ya no se queja.
  Pero no sé si eso es lo que se suele hacer normalmente o si la gente
  directamente quita esa regla y ya está.

- El estado de sesión y los favoritos se pierden al recargar la página, porque
  Zustand guarda en memoria. Sabemos que existe el middleware `persist` para
  guardarlo en localStorage. **Duda:** para este ejercicio, ¿se espera que lo
  añadamos, o es justo lo contrario de lo que enseña la lección 23 (limpiar
  favoritos al cerrar sesión)?

- `ProtectedRoute` solo protege la interfaz: cualquiera puede saltárselo desde
  las DevTools. Entendemos que la protección real va en el backend, que veremos
  en el módulo de Node. ¿Correcto?
