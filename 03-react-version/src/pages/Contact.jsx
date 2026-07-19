// Página Contact (/contact): un formulario de contacto con validación básica y
// mensaje de confirmación. Toda la lógica vive en el custom hook useContactForm;
// aquí solo pintamos el formulario y mostramos errores/confirmación.
import { useContactForm } from '../hooks/useContactForm'

export function Contact() {
  const { values, errors, submitted, handleChange, handleSubmit } = useContactForm()

  return (
    <main className="contact">
      <title>Contacto · DevJobs</title>
      <h1>📧 Contacto</h1>
      <p>¿Tienes alguna pregunta? Escríbenos y te responderemos.</p>

      {/* Mensaje de éxito: solo aparece tras enviar correctamente. */}
      {submitted && (
        <p className="form-success">✅ ¡Mensaje enviado! Te responderemos pronto.</p>
      )}

      {/* noValidate desactiva la validación automática del navegador para usar la
          nuestra (la del custom hook) y mostrar mensajes en español. */}
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="contact-nombre">Nombre</label>
          <input
            id="contact-nombre"
            name="nombre"
            type="text"
            value={values.nombre}
            onChange={handleChange}
          />
          {errors.nombre && <span className="form-error">{errors.nombre}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contact-mensaje">Mensaje</label>
          <textarea
            id="contact-mensaje"
            name="mensaje"
            rows="4"
            value={values.mensaje}
            onChange={handleChange}
          />
          {errors.mensaje && <span className="form-error">{errors.mensaje}</span>}
        </div>

        <button type="submit" className="cta-button">Enviar</button>
      </form>
    </main>
  )
}
