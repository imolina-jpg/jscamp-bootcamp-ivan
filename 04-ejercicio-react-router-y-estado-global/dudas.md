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
  `<a>` es HTML inválido. **Duda:** si se quiere que TODA la tarjeta sea
  clicable, ¿la forma correcta es el truco del "stretched link" con
  `position: absolute` sobre el enlace?

## Tercera parte

- Con `useSearchParams`, el input de texto lo hemos dejado sin controlar
  (`defaultValue`) porque con el debounce de 500 ms daba saltos raros al
  escribir. Los selects sí van controlados. ¿Hay una forma limpia de tenerlo
  controlado y con debounce a la vez?

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
