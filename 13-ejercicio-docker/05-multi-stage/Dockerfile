# Tarea 5: Dockerfile multipaso (multi-stage build)
#
# Separamos la compilación (builder) de la ejecución (runner) para que la
# imagen final sea pequeña: solo llevará el bundle de dist/, sin esbuild ni código fuente.

# --- Etapa 1: builder (compila la app) ---
FROM node:22-alpine AS builder
WORKDIR /app
# Copiamos manifiestos e instalamos TODAS las dependencias (incluidas devDependencies como esbuild)
COPY package.json package-lock.json ./
RUN npm ci
# Copiamos el código y generamos el bundle en /app/dist
COPY . .
RUN npm run build

# --- Etapa 2: runner (solo ejecuta el bundle) ---
FROM node:22-alpine AS runner
WORKDIR /app
# Modo producción
ENV NODE_ENV=production
# Copiamos ÚNICAMENTE la carpeta dist/ desde la etapa builder
COPY --from=builder /app/dist ./dist
EXPOSE 3000
# Usuario sin privilegios
USER node
# Arrancamos el bundle compilado
CMD ["node", "dist/server.js"]
