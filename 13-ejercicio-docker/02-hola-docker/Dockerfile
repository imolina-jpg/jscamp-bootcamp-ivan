# Tarea 2: Hola Docker
#
# El ejemplo más pequeño posible: partimos de Alpine (pesa muy poco)
# y al arrancar el contenedor imprimimos un mensaje por consola.
FROM alpine

# CMD define el comando de inicio. Como solo cambiamos el CMD entre builds,
# Docker reutiliza la caché de la capa "FROM alpine" (verás CACHED en el build).
CMD ["echo", "Hola desde mi primera imagen"]
