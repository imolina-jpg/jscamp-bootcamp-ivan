# Tarea 4: docker init en acción
#
# Estos archivos (Dockerfile, .dockerignore y compose.yaml) son los que genera
# automáticamente `docker init` al detectar un proyecto Node.js.
# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.0.0

FROM node:${NODE_VERSION}-alpine

# Ejecuta la app en modo producción por defecto
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Instala solo dependencias de producción usando montajes temporales (bind + cache),
# así el package.json/package-lock.json no ensucian la imagen final y se cachea npm.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Ejecuta la aplicación como usuario sin privilegios
USER node

# Copia el resto del código fuente
COPY . .

# Puerto que expone la app
EXPOSE 3000

# Comando de inicio
CMD ["node", "server.js"]
