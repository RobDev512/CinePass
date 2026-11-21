/* Roadmap: el contenido se genera leyendo ROADMAP.md. */
document.addEventListener("DOMContentLoaded", iniciarRoadmap);

async function iniciarRoadmap() {
    const listado = document.getElementById("etapas-roadmap");
    const aviso = document.getElementById("aviso-roadmap");
    const resumen = document.getElementById("resumen-roadmap");
    let etapas = [];
    let filtro = "todas";
    try {
        const respuesta = await fetch("docs/ROADMAP.md");
        if (!respuesta.ok) throw new Error("No fue posible cargar el Markdown");
        etapas = parsearEtapas(await respuesta.text());
        if (!etapas.length) throw new Error("No hay etapas");
    } catch (error) {
        aviso.textContent = "No se pudo cargar el roadmap. Puedes consultar ROADMAP.md desde GitHub.";
        listado.hidden = true;
        console.error(error);
        return;
    }
    aviso.hidden = true;
    const publicadas = etapas.filter(function (e) { return e.estado === "Publicada"; }).length;
    resumen.textContent = publicadas + " publicadas · " + etapas.length + " etapas";

    function mostrarEtapas() {
        listado.replaceChildren();
        const visibles = etapas.filter(function (e) {
            return filtro === "todas" || e.estado === filtro;
        });
        visibles.forEach(function (etapa) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "etapa-roadmap";
            tarjeta.dataset.estado = etapa.estado;
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
        requestAnimationFrame(dibujarConexiones);
    }

    document.querySelectorAll("[data-filtro-roadmap]").forEach(function (boton) {
        boton.addEventListener("click", function () {
            filtro = boton.dataset.filtroRoadmap;
            document.querySelectorAll("[data-filtro-roadmap]").forEach(function (b) {
                b.classList.toggle("seleccionado", b === boton);
                b.setAttribute("aria-pressed", String(b === boton));
            });
            mostrarEtapas();
        });
    });

    const canvas = document.getElementById("lienzo-roadmap");
    const esquema = document.getElementById("diagrama-roadmap");
    function dibujarConexiones() {
        const contexto = canvas.getContext("2d");
        const tarjetas = Array.from(listado.querySelectorAll(".etapa-roadmap"));
        if (!contexto || tarjetas.length < 2 || window.innerWidth < 801) {
            canvas.width = 1;
            canvas.height = 1;
            return;
        }
        const rect = esquema.getBoundingClientRect();
        const escala = window.devicePixelRatio || 1;
        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
        canvas.width = Math.round(rect.width * escala);
        canvas.height = Math.round(rect.height * escala);
        contexto.scale(escala, escala);
        contexto.lineWidth = 2;
        contexto.strokeStyle = "rgba(106, 240, 202, .55)";
        const puntos = tarjetas.map(function (tarjeta) {
            const r = tarjeta.getBoundingClientRect();
            return { x: r.left - rect.left + r.width / 2, y: r.top - rect.top + 12 };
        });
        for (let i = 1; i < puntos.length; i++) {
            const a = puntos[i - 1];
            const b = puntos[i];
            const centro = (a.y + b.y) / 2;
            contexto.beginPath();
            contexto.moveTo(a.x, a.y);
            contexto.bezierCurveTo(a.x, centro, b.x, centro, b.x, b.y);
            contexto.stroke();
        }
        puntos.forEach(function (p, i) {
            contexto.beginPath();
            contexto.arc(p.x, p.y, 5, 0, Math.PI * 2);
            contexto.fillStyle = i < publicadas ? "#70f0c6" : "#f35a6c";
            contexto.fill();
        });
    }
    window.addEventListener("resize", dibujarConexiones);
    mostrarEtapas();
}

function parsearEtapas(markdown) {
    const secciones = markdown.split(/^## (v\d+\.\d+\.\d+) [—-] (.+)$/gm);
    const etapas = [];
    for (let i = 1; i + 2 < secciones.length; i += 3) {
        const cuerpo = secciones[i + 2];
        const obtener = function (campo) {
            const patron = new RegExp("\\*\\*" + campo + ":\\*\\*\\s*([^\\n]+)");
            const resultado = cuerpo.match(patron);
            return resultado ? resultado[1].trim() : "";
        };
        const tareas = [];
        cuerpo.split("\n").forEach(function (linea) {
            const resultado = linea.match(/^- \[([ xX])\] (.+)$/);
            if (resultado) tareas.push({
                hecha: resultado[1].toLowerCase() === "x",
                texto: resultado[2].replace(/`/g, "")
            });
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
