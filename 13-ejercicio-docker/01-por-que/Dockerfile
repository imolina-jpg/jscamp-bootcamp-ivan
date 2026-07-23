# Tarea 1: "En mi máquina funciona" con Dockerfile
#
# La imagen base (FROM) es la que define el entorno donde corre la app.
# app.js usa structuredClone y Array.prototype.findLast (APIs modernas de JS):
#   - Con node:22-alpine  -> funciona y muestra "✅ ¡Todo funcionó!"
#   - Con node:16-alpine  -> peta con "ReferenceError: structuredClone is not defined"
# Cambia solo esta línea a node:16-alpine, reconstruye y verás el error.
FROM node:22-alpine

# Carpeta de trabajo dentro del contenedor (evita trabajar en la raíz /)
WORKDIR /app

# Copiamos el único archivo que necesita la app
COPY app.js .

# Comando que se ejecuta al arrancar el contenedor
CMD ["node", "app.js"]
