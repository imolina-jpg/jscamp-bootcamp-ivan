# Tarea 7 (opcional): Docker con IA local (Flask + Docker Model Runner)

# Imagen base ligera de Python
FROM python:3.12-slim

WORKDIR /app

# Copiamos primero requirements.txt para aprovechar la caché al instalar.
# --no-cache-dir evita que pip guarde caché de descargas -> imagen más pequeña.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el código de la app
COPY app.py .

# Puerto donde escucha Flask
EXPOSE 5000

# Comando de inicio
CMD ["python", "app.py"]
