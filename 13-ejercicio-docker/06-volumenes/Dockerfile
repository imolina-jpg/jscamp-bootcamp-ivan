# Tarea 6: Volúmenes y bind mounts
#
# Imagen muy simple: solo copia server.js y expone el 3000.
# La persistencia se consigue al ejecutar con -v (Docker Volume o bind mount).
FROM node:22-alpine

WORKDIR /app

COPY server.js .

EXPOSE 3000

# Usamos "node --watch" para tener hot reload: combinado con un bind mount
# de la carpeta del proyecto, al editar server.js el servidor se reinicia solo.
CMD ["node", "--watch", "server.js"]
