// @ts-check
import { test, expect } from '@playwright/test'

// La tarjeta de empleo no tiene un rol propio que la identifique, así que tiro
// de la clase. Es la misma que usamos en clase.
const JOB_CARD = '.job-listing-card'

// Busca desde el home: relleno el buscador y le doy a Buscar, como haría yo
async function buscar(page, texto) {
  await page.goto('/')
  await page.getByRole('searchbox').fill(texto)
  await page.getByRole('button', { name: 'Buscar' }).click()
  await expect(page.locator(JOB_CARD).first()).toBeVisible()
}

test.describe('Navegación básica', () => {
  test('la página principal carga y muestra el buscador', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('searchbox')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Buscar' })).toBeVisible()
  })
})

test.describe('Búsqueda de empleos', () => {
  test('buscar "React" devuelve resultados', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('searchbox').fill('React')
    await page.getByRole('button', { name: 'Buscar' }).click()

    // El texto de búsqueda acaba en la URL, la app se apoya en ella
    await expect(page).toHaveURL(/text=React/)

    const tarjetas = page.locator(JOB_CARD)
    await expect(tarjetas.first()).toBeVisible()
    expect(await tarjetas.count()).toBeGreaterThan(0)
  })
})

test.describe('Flujo completo de aplicación', () => {
  test('buscar, entrar al detalle, iniciar sesión y aplicar', async ({ page }) => {
    await buscar(page, 'JavaScript')

    // El enlace de la tarjeta tiene aria-label "Ver detalles de...", que manda
    // sobre el texto visible a la hora de buscarlo por rol
    const primerResultado = page.locator(JOB_CARD).first()
    const titulo = await primerResultado.getByRole('heading', { level: 3 }).textContent()

    await primerResultado.getByRole('link').click()

    // Ya en el detalle: la ruta es /job/:id y el título pasa a ser un h1
    await expect(page).toHaveURL(/\/job\//)
    await expect(page.getByRole('heading', { level: 1, name: titulo ?? '' })).toBeVisible()

    // Sin sesión el botón de aplicar está deshabilitado
    await expect(page.getByRole('button', { name: 'Inicia sesión para aplicar' })).toBeDisabled()

    await page.getByRole('button', { name: 'Iniciar sesión' }).click()

    const botonAplicar = page.getByRole('button', { name: 'Aplicar' })
    await expect(botonAplicar).toBeEnabled()
    await botonAplicar.click()

    await expect(page.getByRole('button', { name: 'Aplicado' })).toBeVisible()
  })
})

test.describe('Filtros', () => {
  test('filtrar por ubicación remota deja solo empleos remotos', async ({ page }) => {
    await page.goto('/search')
    await expect(page.locator(JOB_CARD).first()).toBeVisible()

    await page.getByLabel('Filtrar por ubicación').selectOption('remoto')
    await expect(page).toHaveURL(/type=remoto/)

    // La modalidad no se pinta como texto en la tarjeta, viene en un data-*.
    // Con poll porque al filtrar la lista se vacía y se vuelve a pintar: si lo
    // leo a la primera me pilla el hueco y no hay tarjetas.
    await expect
      .poll(async () =>
        page.locator(JOB_CARD).evaluateAll((nodos) => nodos.map((nodo) => nodo.dataset.modalidad))
      )
      .toEqual(expect.arrayContaining(['remoto']))

    const modalidades = await page
      .locator(JOB_CARD)
      .evaluateAll((nodos) => nodos.map((nodo) => nodo.dataset.modalidad))
    expect(modalidades.every((modalidad) => modalidad === 'remoto')).toBe(true)
  })

  test('filtrar por nivel senior deja solo empleos senior', async ({ page }) => {
    await page.goto('/search')
    await expect(page.locator(JOB_CARD).first()).toBeVisible()

    await page.getByLabel('Filtrar por nivel de experiencia').selectOption('senior')
    await expect(page).toHaveURL(/level=senior/)

    await expect
      .poll(async () =>
        page.locator(JOB_CARD).evaluateAll((nodos) => nodos.map((nodo) => nodo.dataset.nivel))
      )
      .toEqual(expect.arrayContaining(['senior']))

    const niveles = await page
      .locator(JOB_CARD)
      .evaluateAll((nodos) => nodos.map((nodo) => nodo.dataset.nivel))
    expect(niveles.every((nivel) => nivel === 'senior')).toBe(true)
  })
})

test.describe('Paginación', () => {
  // Sin filtros hay 34 empleos y la app pagina de 4 en 4, así que hay páginas
  // de sobra. Con "React" solo saldría una y no habría nada que paginar.
  test('aparece la paginación cuando hay más resultados de los que caben', async ({ page }) => {
    await page.goto('/search')
    await expect(page.locator(JOB_CARD).first()).toBeVisible()

    const paginacion = page.getByRole('navigation', { name: 'Paginación de resultados' })
    await expect(paginacion).toBeVisible()
    await expect(paginacion.getByRole('link', { name: '2' })).toBeVisible()
  })

  test('al pulsar Siguiente cambian los resultados', async ({ page }) => {
    await page.goto('/search')
    await expect(page.locator(JOB_CARD).first()).toBeVisible()

    const primerTituloPagina1 = await page
      .locator(JOB_CARD)
      .first()
      .getByRole('heading', { level: 3 })
      .textContent()

    await page.getByRole('link', { name: 'Siguiente' }).click()

    await expect(page).toHaveURL(/page=2/)
    await expect(page.locator(JOB_CARD).first()).toBeVisible()

    const primerTituloPagina2 = await page
      .locator(JOB_CARD)
      .first()
      .getByRole('heading', { level: 3 })
      .textContent()

    expect(primerTituloPagina2).not.toBe(primerTituloPagina1)
  })
})

test.describe('Detalle de empleo', () => {
  test('se muestra el detalle del empleo', async ({ page }) => {
    await buscar(page, 'React')

    const primerResultado = page.locator(JOB_CARD).first()
    const titulo = await primerResultado.getByRole('heading', { level: 3 }).textContent()

    await primerResultado.getByRole('link').click()

    await expect(page).toHaveURL(/\/job\//)
    // Por el nombre y no solo por level 1: el logo del header también es un h1
    await expect(page.getByRole('heading', { level: 1, name: titulo ?? '' })).toBeVisible()
    // Las secciones del detalle vienen en markdown desde la API
    await expect(page.getByRole('heading', { name: 'Descripción del puesto' })).toBeVisible()
  })

  test('se puede aplicar al empleo desde el detalle', async ({ page }) => {
    await buscar(page, 'React')
    await page.locator(JOB_CARD).first().getByRole('link').click()

    await page.getByRole('button', { name: 'Iniciar sesión' }).click()

    const botonAplicar = page.getByRole('button', { name: 'Aplicar' })
    await expect(botonAplicar).toBeVisible()
    await botonAplicar.click()

    await expect(page.getByRole('button', { name: 'Aplicado' })).toBeVisible()
  })
})
