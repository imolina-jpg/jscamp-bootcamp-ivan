import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    // La app del módulo anterior. Con esto en los tests basta con page.goto('/')
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  // En clase se deja solo Chromium para empezar; los otros dos navegadores
  // multiplican el tiempo y de momento no me aportan nada
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Levanta Vite solo si no lo tengo ya abierto en otra terminal
  webServer: {
    command: 'npm run dev',
    cwd: '../04-ejercicio-react-router-y-estado-global',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
