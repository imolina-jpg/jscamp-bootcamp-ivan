# Tarea 3: Tu primera app real con Node.js (buenas prácticas)

# Imagen base ligera con Node 22
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# 1) Copiamos SOLO los manifiestos primero.
#    Así, mientras package.json/package-lock.json no cambien, Docker reutiliza
#    la caché de la instalación y no reinstala dependencias en cada build.
COPY package.json package-lock.json ./

# 2) Instalamos dependencias de forma reproducible con el lockfile
RUN npm ci

# 3) Ahora sí, copiamos el resto del código fuente
COPY . .

# Documentamos el puerto interno (no lo publica: eso se hace con -p al ejecutar)
EXPOSE 3000

# Ejecutamos con el usuario sin privilegios que ya trae la imagen de Node
USER node

# Comando de inicio
CMD ["node", "server.js"]
