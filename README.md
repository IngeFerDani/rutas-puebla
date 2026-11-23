
# Rutas Puebla

## Descripción
Rutas Puebla es una aplicación web que permite registrar, consultar y eliminar paradas de transporte público en Puebla mediante un mapa interactivo.

## Tecnologías utilizadas
- Python
- FastAPI
- Redis Cloud
- HTML
- CSS
- JavaScript
- Leaflet
- OpenStreetMap

## Características
- Registrar nuevas paradas.
- Consultar las paradas registradas.
- Eliminar paradas.
- Almacenar información en Redis Cloud.
- Visualizar las paradas en un mapa interactivo.
- Centrar el mapa automáticamente en las ubicaciones registradas.

## Requisitos
- Python 3.10 o superior.
- Redis Cloud.
- Visual Studio Code.

## Instalación

1. Clonar o descargar el proyecto.
2. Crear un entorno virtual:

   python -m venv venv

3. Activar el entorno virtual:

   venv\Scripts\activate

4. Instalar las dependencias:

   pip install -r requirements.txt

5. Crear un archivo `.env` en la carpeta principal y configurar la conexión a Redis:

   REDIS_URL=redis://default:CONTRASEÑA@HOST:PUERTO

   Reemplazar los datos de ejemplo por los datos de conexión de Redis Cloud.

## Ejecución

Ejecutar el siguiente comando:

uvicorn app.main:app --reload

Abrir en el navegador:

http://127.0.0.1:8000

## Documentación de la API

FastAPI proporciona la documentación interactiva en:

http://127.0.0.1:8000/docs

## Almacenamiento de datos

La información de las paradas se almacena en Redis Cloud utilizando claves con el formato:

parada:{id}

Cada parada contiene nombre, colonia, municipio, latitud, longitud, rutas, estado y fecha de creación.

## Autor
Proyecto académico - Sprint 1.
