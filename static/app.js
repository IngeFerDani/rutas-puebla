
const API_URL = "/paradas/";

let mapa;
const marcadores = [];
let idEnEdicion = null;


// Cargar la página cuando esté lista
document.addEventListener("DOMContentLoaded", () => {

    // Inicializar el mapa de Puebla
    mapa = L.map("map").setView([19.0414, -98.2063], 13);

    // Agregar OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);

    // Cargar las paradas
    cargarParadas();
    mostrarParadasEnMapa();

    // Eventos del formulario
    document.getElementById("formParada")
        .addEventListener("submit", registrarParada);

    document.getElementById("cancelarEdicion")
        .addEventListener("click", cancelarEdicion);
        document.getElementById("actualizarLista")
    .addEventListener("click", async () => {
        await cargarParadas();
        await mostrarParadasEnMapa();
    });
});


// Obtener y mostrar todas las paradas
async function cargarParadas() {
    const contenedor = document.getElementById("contenedorParadas");

    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las paradas");
        }

        const datos = await respuesta.json();

        contenedor.innerHTML = "";

        if (datos.total === 0) {
            contenedor.innerHTML = "<p>No hay paradas registradas.</p>";
            return;
        }

        datos.paradas.forEach(parada => {
            const tarjeta = document.createElement("div");
            tarjeta.className = "parada";

            const nombre = document.createElement("h3");
            nombre.textContent = parada.nombre;

            const colonia = document.createElement("p");
            colonia.textContent = "Colonia: " + parada.colonia;

            const municipio = document.createElement("p");
            municipio.textContent = "Municipio: " + parada.municipio;

            const rutas = document.createElement("p");
            rutas.textContent = "Rutas: " + parada.rutas.join(", ");
            const estado = document.createElement("p");
            estado.textContent = "Estado: " + (parada.activa ? "Activa" : "Inactiva");

            // Botón para editar
            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            const botonUbicar = document.createElement("button");
botonUbicar.textContent = "Ver en mapa";

botonEditar.addEventListener("click", () => {
    editarParada(parada);
});
          botonUbicar.addEventListener("click", () => {
    ubicarParadaEnMapa(parada.id);
});

            // Botón para eliminar
            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";

            botonEliminar.addEventListener("click", () => {
                eliminarParada(parada.id);
            });

            tarjeta.append(
                nombre,
                colonia,
                municipio,
                rutas,
                estado,
                botonUbicar,
                botonEditar,
                botonEliminar
            );

            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = "<p>Error al cargar las paradas.</p>";
    }
}


// Registrar o actualizar una parada
async function registrarParada(evento) {
    evento.preventDefault();

    const parada = {
        nombre: document.getElementById("nombre").value,
        colonia: document.getElementById("colonia").value,
        municipio: document.getElementById("municipio").value,
        latitud: parseFloat(document.getElementById("latitud").value),
        longitud: parseFloat(document.getElementById("longitud").value),
        rutas: document.getElementById("rutas").value
            .split(",")
            .map(ruta => ruta.trim())
            .filter(ruta => ruta !== ""),
        activa: document.getElementById("activa").value === "true"
    };

    try {
        // Si hay un ID, actualiza; si no, registra
        const editando = idEnEdicion !== null;

        const respuesta = await fetch(
            editando ? API_URL + idEnEdicion : API_URL,
            {
                method: editando ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(parada)
            }
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo guardar la parada");
        }

        alert(editando
            ? "¡Parada actualizada correctamente!"
            : "¡Parada registrada correctamente!"
        );

        cancelarEdicion();

        await cargarParadas();
        await mostrarParadasEnMapa();

    } catch (error) {
        console.error(error);
        alert("Ocurrió un error al guardar la parada.");
    }
}


// Cargar los datos de una parada en el formulario
function editarParada(parada) {
    idEnEdicion = parada.id;

    document.getElementById("nombre").value = parada.nombre;
    document.getElementById("colonia").value = parada.colonia;
    document.getElementById("municipio").value = parada.municipio;
    document.getElementById("latitud").value = parada.latitud;
    document.getElementById("longitud").value = parada.longitud;
    document.getElementById("rutas").value = parada.rutas.join(", ");
    document.getElementById("activa").value = String(parada.activa);

    document.querySelector("#formParada button[type='submit']")
        .textContent = "Guardar cambios";

    document.getElementById("cancelarEdicion").style.display = "inline-block";

    document.getElementById("formParada").scrollIntoView({
        behavior: "smooth"
    });
}


// Cancelar la edición
function cancelarEdicion() {
    idEnEdicion = null;

    document.getElementById("formParada").reset();
    document.getElementById("municipio").value = "Puebla";

    document.querySelector("#formParada button[type='submit']")
        .textContent = "Registrar parada";

    document.getElementById("cancelarEdicion").style.display = "none";
    
}



// Eliminar una parada
async function eliminarParada(id) {
    if (!confirm("¿Estás segura de eliminar esta parada?")) {
        return;
    }

    try {
        const respuesta = await fetch(API_URL + id, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo eliminar la parada");
        }

        alert("Parada eliminada correctamente.");

        await cargarParadas();
        await mostrarParadasEnMapa();

    } catch (error) {
        console.error(error);
        alert("Ocurrió un error al eliminar la parada.");
    }
}


// Mostrar las paradas en el mapa
async function mostrarParadasEnMapa() {
    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener las paradas");
        }

        const datos = await respuesta.json();

        // Eliminar marcadores anteriores
        marcadores.forEach(marcador => mapa.removeLayer(marcador));
        marcadores.length = 0;

        // Agregar los nuevos marcadores
        datos.paradas.forEach(parada => {
            const marcador = L.marker([
                parada.latitud,
                parada.longitud
            ]).addTo(mapa);

            marcador.bindPopup(`
                <strong>${parada.nombre}</strong><br>
                Colonia: ${parada.colonia}<br>
                Municipio: ${parada.municipio}<br>
                Rutas: ${parada.rutas.join(", ")}
            `);

            marcadores.push(marcador);
            marcador.paradaId = parada.id;
            mapa.panTo([
                Number(parada.latitud),
                Number(parada.longitud)
            ]);
        });

    } catch (error) {
        console.error("Error al mostrar las paradas:", error);
    }
}
// Ubicar una parada específica en el mapa
function ubicarParadaEnMapa(id) {

    const indice = marcadores.findIndex((marcador, posicion) => {
        return marcador.paradaId === id;
    });

    if (indice === -1) {
        alert("No se encontró el marcador de esta parada.");
        return;
    }

    const marcador = marcadores[indice];

    mapa.setView(marcador.getLatLng(), 16);

    marcador.openPopup();

    document.querySelector(".mapa").scrollIntoView({
        behavior: "smooth"
    });
}

