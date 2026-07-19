// PRIMERA PARTE | Componetización.
//
// Footer: el pie de página. Igual que Header, es estático y sin props.
// Separarlo en su propio archivo hace que App.jsx se lea de un vistazo.
export function Footer() {
  return (
    <footer>
      {/* &copy; es la entidad HTML del símbolo © */}
      <small>&copy; 2025 DevJobs. Todos los derechos reservados.</small>
    </footer>
  )
}
