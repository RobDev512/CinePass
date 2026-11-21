/* =========================================================
   CINEPASS - ROADMAP DE VERSIONES
   Fuente de información: docs/ROADMAP.md
   Visualización: tarjetas + ruta de Canvas en margen libre.
   ========================================================= */

document.addEventListener("DOMContentLoaded", iniciarRoadmap);

async function iniciarRoadmap() {
    const listado = document.getElementById("etapas-roadmap");
    const aviso = document.getElementById("aviso-roadmap");
    const resumen = document.getElementById("resumen-roadmap");
    const canvas = document.getElementById("lienzo-roadmap");
    const esquema = document.getElementById("diagrama-roadmap");

    if (!listado || !canvas || !esquema) return;

    let etapas = [];
    let filtro = "todas";
    let cuadroSolicitado = false;

    try {
        const respuesta = await fetch("docs/ROADMAP.md");
        if (!respuesta.ok) throw new Error("No fue posible cargar ROADMAP.md");
        etapas = interpretarRoadmap(await respuesta.text());
        if (!etapas.length) throw new Error("No se encontraron etapas de versión");
    } catch (error) {
        aviso.hidden = false;
        aviso.textContent = "No fue posible cargar el roadmap. Puedes consultar ROADMAP.md desde GitHub.";
        listado.hidden = true;
        console.error(error);
        return;
    }

    aviso.hidden = true;
    const publicadas = etapas.filter(function (etapa) {
        return etapa.estado === "Publicada";
    }).length;
    resumen.textContent = publicadas + " publicadas · " + etapas.length + " etapas";

    function mostrarEtapas() {
        listado.replaceChildren();
        const visibles = etapas.filter(function (etapa) {
            return filtro === "todas" || etapa.estado === filtro;
        });

        visibles.forEach(function (etapa) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "etapa-roadmap";
            tarjeta.dataset.estado = etapa.estado;
            tarjeta.dataset.paso = String(etapas.indexOf(etapa) + 1);

            const fila = document.createElement("div");
            fila.className = "etapa-encabezado";

            const titulo = document.createElement("h2");
            titulo.textContent = etapa.version + " — " + etapa.nombre;

            const estado = document.createElement("span");
            estado.className = "etapa-estado";
            estado.textContent = etapa.estado;
            fila.append(titulo, estado);

            const objetivo = document.createElement("p");
            objetivo.className = "etapa-objetivo";
            objetivo.textContent = etapa.objetivo;

            const responsables = document.createElement("p");
            responsables.className = "etapa-responsables";
            responsables.textContent = "Responsables: " + etapa.responsables;

            const lista = document.createElement("ul");
            lista.className = "etapa-lista";
            etapa.tareas.slice(0, 6).forEach(function (tarea) {
                const elemento = document.createElement("li");
                elemento.textContent = (tarea.hecha ? "✓ " : "○ ") + tarea.texto;
                if (tarea.hecha) elemento.className = "tarea-hecha";
                lista.appendChild(elemento);
            });

            tarjeta.append(fila, objetivo, responsables, lista);
            listado.appendChild(tarjeta);
        });

        solicitarDibujo();
    }

    document.querySelectorAll("[data-filtro-roadmap]").forEach(function (boton) {
        boton.addEventListener("click", function () {
            filtro = boton.dataset.filtroRoadmap;
            document.querySelectorAll("[data-filtro-roadmap]").forEach(function (elemento) {
                const activo = elemento === boton;
                elemento.classList.toggle("seleccionado", activo);
                elemento.setAttribute("aria-pressed", String(activo));
            });
            mostrarEtapas();
        });
    });

    function solicitarDibujo() {
        if (cuadroSolicitado) return;
        cuadroSolicitado = true;
        requestAnimationFrame(function () {
            cuadroSolicitado = false;
            dibujarRuta();
        });
    }

    function dibujarRuta() {
        const contexto = canvas.getContext("2d");
        if (!contexto) return;

        const tarjetas = Array.from(listado.querySelectorAll(".etapa-roadmap"));
        const area = esquema.getBoundingClientRect();
        const escala = window.devicePixelRatio || 1;

        canvas.style.width = area.width + "px";
        canvas.style.height = area.height + "px";
        canvas.width = Math.max(1, Math.round(area.width * escala));
        canvas.height = Math.max(1, Math.round(area.height * escala));
        contexto.setTransform(escala, 0, 0, escala, 0, 0);
        contexto.clearRect(0, 0, area.width, area.height);

        if (!tarjetas.length) return;

        // La línea se dibuja EXCLUSIVAMENTE en el canal izquierdo.
        // Nunca cruza por detrás de una tarjeta.
        const esMovil = window.innerWidth <= 600;
        const xRuta = esMovil ? 22 : 45;
        const radio = esMovil ? 13 : 17;
        const pasos = tarjetas.map(function (tarjeta) {
            const rect = tarjeta.getBoundingClientRect();
            return {
                xTarjeta: rect.left - area.left,
                y: rect.top - area.top + Math.min(47, rect.height / 2),
                numero: tarjeta.dataset.paso.padStart(2, "0"),
                estado: tarjeta.dataset.estado
            };
        });

        // Tramos verticales, conectados por flechas hacia abajo.
        for (let i = 0; i < pasos.length - 1; i++) {
            const primero = pasos[i];
            const siguiente = pasos[i + 1];
            contexto.beginPath();
            contexto.moveTo(xRuta, primero.y + radio + 3);
            contexto.lineTo(xRuta, siguiente.y - radio - 4);
            contexto.lineWidth = 3;
            contexto.strokeStyle = "#4ac9b0";
            contexto.lineCap = "round";
            contexto.stroke();

            const yFlecha = (primero.y + siguiente.y) / 2;
            contexto.beginPath();
            contexto.moveTo(xRuta - 6, yFlecha - 4);
            contexto.lineTo(xRuta, yFlecha + 4);
            contexto.lineTo(xRuta + 6, yFlecha - 4);
            contexto.strokeStyle = "#e8fff8";
            contexto.lineWidth = 2.5;
            contexto.stroke();
        }

        pasos.forEach(function (paso) {
            // Conector horizontal: del nodo hasta el borde de SU tarjeta.
            const extremo = paso.xTarjeta - 9;
            contexto.beginPath();
            contexto.moveTo(xRuta + radio, paso.y);
            contexto.lineTo(extremo, paso.y);
            contexto.lineWidth = 3;
            contexto.strokeStyle = "#4ac9b0";
            contexto.stroke();

            // Punta de flecha justo antes de la tarjeta.
            contexto.beginPath();
            contexto.moveTo(extremo - 7, paso.y - 5);
            contexto.lineTo(extremo, paso.y);
            contexto.lineTo(extremo - 7, paso.y + 5);
            contexto.strokeStyle = "#e7fff7";
            contexto.lineWidth = 2.5;
            contexto.stroke();

            // Número visible del hito dentro de un nodo redondo.
            const completado = paso.estado === "Publicada";
            contexto.beginPath();
            contexto.arc(xRuta, paso.y, radio, 0, Math.PI * 2);
            contexto.fillStyle = completado ? "#174d45" : "#2b2843";
            contexto.fill();
            contexto.strokeStyle = completado ? "#75efd0" : "#ff8994";
            contexto.lineWidth = 2.5;
            contexto.stroke();

            contexto.font = "bold " + (esMovil ? 10 : 12) + "px Arial";
            contexto.textAlign = "center";
            contexto.textBaseline = "middle";
            contexto.fillStyle = "#ffffff";
            contexto.fillText(paso.numero, xRuta, paso.y + 1);
        });
    }

    window.addEventListener("resize", solicitarDibujo);
    mostrarEtapas();
}

function interpretarRoadmap(markdown) {
    const secciones = markdown.split(/^## (v\d+\.\d+\.\d+) [—-] (.+)$/gm);
    const etapas = [];
    for (let i = 1; i + 2 < secciones.length; i += 3) {
        const contenido = secciones[i + 2];
        const obtener = function (campo) {
            const patron = new RegExp("\\*\\*" + campo + ":\\*\\*\\s*([^\\n]+)");
            const encontrado = contenido.match(patron);
            return encontrado ? encontrado[1].trim() : "";
        };
        const tareas = [];
        contenido.split("\n").forEach(function (linea) {
            const tarea = linea.match(/^- \[([ xX])\] (.+)$/);
            if (tarea) {
                tareas.push({
                    hecha: tarea[1].toLowerCase() === "x",
                    texto: tarea[2].replace(/`/g, "")
                });
            }
        });
        etapas.push({
            version: secciones[i],
            nombre: secciones[i + 1],
            estado: obtener("Estado"),
            responsables: obtener("Responsables"),
            objetivo: obtener("Objetivo"),
            tareas: tareas
        });
    }
    return etapas;
}
