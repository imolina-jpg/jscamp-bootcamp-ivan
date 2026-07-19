# Aquí puedes dejar tus dudas

## Primera parte

- Al migrar `useRouter` a `useNavigate`, la app entró en un bucle infinito de
  renders ("Maximum update depth exceeded"). El motivo: `navigateTo` era una
  función nueva en cada render y `Search.jsx` la tenía como dependencia de un
  `useEffect`. Se arregló envolviéndola en `useCallback`. **Duda:** ¿es mejor
  devolver directamente el `navigate` de React Router en vez de envolverlo,
  o merece la pena mantener el envoltorio por si algún día cambiamos de router?

- Las lecciones importan de `react-router-dom` en algunos ejemplos y de
  `react-router` en otros. Con la versión actual (v7+) todo sale de
  `react-router`. ¿`react-router-dom` está oficialmente deprecado?

## Segunda parte

- El README pide la ruta `/job/:id` y el archivo `Detail.jsx`, pero en las clases
  se usa `/jobs/:id` y `JobDetail.jsx`. Hemos seguido el README por ser lo
  evaluable. ¿Es correcto?

- Para enlazar la tarjeta al detalle sin romper el botón "Aplicar", hemos
  enlazado solo el bloque de texto, porque meter un `<button>` dentro de un
  `<a>` es HTML inválido. Coincide con la "Solución 3 (híbrida)" que propone
  la lección 6. **Duda:** si se quiere que TODA la tarjeta sea clicable,
  ¿la forma correcta es el truco del "stretched link" con `position: absolute`?

- La lección 5 da por hecho que el andamio trae un `detail.module.css` "con
  todos los estilos preparados", pero en el ejercicio no viene. Los hemos
  escrito desde cero en `src/pages/Detail.module.css`. **Duda:** ¿era ese
  archivo parte del material y se nos ha pasado descargarlo?

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

- **Ejercicio 1 de la lección 8 (filtro nuevo).** El `seniority` que propone el
  enunciado ya existía en el proyecto (nuestro "Nivel de experiencia" → `level`),
  así que añadimos uno nuevo de verdad: **resultados por página** (`?limit=`),
  que la API ya soportaba. Incluye lista blanca de valores, para que un
  `?limit=9999` escrito a mano caiga al valor por defecto. **Duda:** ¿es
  correcto tratar `limit` como un filtro más en la URL, o los ajustes de
  visualización deberían ir aparte (por ejemplo en localStorage)?

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

- ESLint daba error al poner el Provider y el hook `useAuth` en el mismo
  archivo (`react-refresh/only-export-components`). Lo resolvimos separando el
  contexto y el hook en `useAuth.js` y dejando solo el componente en
  `authContext.jsx`. **Duda:** ¿es esa la convención habitual o la gente
  simplemente desactiva la regla?

- El estado de sesión y los favoritos se pierden al recargar la página, porque
  Zustand guarda en memoria. Sabemos que existe el middleware `persist` para
  guardarlo en localStorage. **Duda:** para este ejercicio, ¿se espera que lo
  añadamos, o es justo lo contrario de lo que enseña la lección 23 (limpiar
  favoritos al cerrar sesión)?

- `ProtectedRoute` solo protege la interfaz: cualquiera puede saltárselo desde
  las DevTools. Entendemos que la protección real va en el backend, que veremos
  en el módulo de Node. ¿Correcto?
