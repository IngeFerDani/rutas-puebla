
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.routes import router
from app.database import probar_conexion


app = FastAPI(
    title="Rutas Puebla",
    description="API CRUD de paradas de transporte público en Puebla usando Redis Cloud",
    version="1.0.0"
)


# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Servir archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")


# Página principal
@app.get("/")
def inicio():
    return FileResponse("static/index.html")


# Estado de la aplicación
@app.get("/estado")
def estado():
    conexion = probar_conexion()

    return {
        "proyecto": "Rutas Puebla",
        "redis_conectado": conexion,
        "documentacion": "/docs"
    }


# Incorporar las rutas del CRUD
app.include_router(router)
