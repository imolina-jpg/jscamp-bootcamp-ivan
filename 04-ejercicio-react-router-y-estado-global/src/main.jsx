import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import './index.css'
import App from './App.jsx'

// BrowserRouter es el "cerebro" del router: lee la URL del navegador y la pone
// a disposición de toda la app (vía contexto de React). Sin este envoltorio,
// ningún componente ni hook de React Router funcionaría dentro de <App />.
//
// Fíjate en lo que YA NO hay aquí: el <AuthProvider>. Al pasar a Zustand, las
// stores viven fuera de React y cualquier componente puede usarlas
// directamente, sin envolver el árbol en nada.
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
