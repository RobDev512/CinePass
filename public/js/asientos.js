/* =========================================================
   PANTALLA: SELECCIÓN DE ASIENTOS — script propio (js/asientos.js)
   Depende de js/reserva-datos.js (cargarlo ANTES en el HTML).
   ----------------------------------------------------------
   QUÉ ENTRA:  ?pelicula=&funcion= desde detalle.html (o los
               datos sembrados del módulo) y el mapa de prueba
               (filas A-F, ocupados sembrados, precio $90).
   QUÉ SALE:   confirmacion.html?pelicula=...&funcion=...&
               asientos=CSV al pulsar "Continuar: confirmar";
               D5 y D6 (los de la captura) vienen preseleccionados.
   CÓMO ENTRAR: detalle.html (paso 1) → AQUÍ → confirmacion.html.
   ========================================================= */
(function () {
    "use strict";

    const datos = window.CinePassReserva;
    const config = datos.ASIENTOS;
    const estado = datos.estadoFlujo();
    const mapa = document.getElementById("mapa-asientos");

    // Contexto de la función elegida en el paso anterior.
    document.getElementById("contexto-funcion").textContent =
        estado.funcion.sala + " · " + estado.funcion.fecha + " · " + estado.funcion.hora + " — " + estado.pelicula.nombre;

    // Selección activa (preselección de prueba D5 y D6).
    const seleccion = new Set(estado.asientos.filter(function (a) { return !datos.asientoOcupado(a, estado.funcion.id); }));

    function codigoDe(fila, numero) { return fila + numero; }

    function renderMapa() {
        mapa.querySelectorAll(".fila-asientos, .cargando").forEach(function (n) { n.remove(); });
        config.filas.forEach(function (fila) {
            const filaEl = document.createElement("div");
            filaEl.className = "fila-asientos";
            const etiqueta = document.createElement("span");
            etiqueta.className = "fila-numero";
            etiqueta.textContent = fila;
            filaEl.appendChild(etiqueta);

            config.columnas.forEach(function (numero) {
                const codigo = codigoDe(fila, numero);
                const boton = document.createElement("button");
                boton.type = "button";
                boton.className = "butaca";
                const ocupado = datos.asientoOcupado(codigo, estado.funcion.id);
                if (ocupado) {
                    boton.classList.add("ocupada");
                    boton.setAttribute("aria-disabled", "true");
                    boton.title = "Ocupado (dato de prueba)";
                } else {
                    const codigoBase = codigo;
                    boton.addEventListener("click", function () { toggle(codigoBase); });
                }
                if (seleccion.has(codigo)) boton.classList.add("seleccionada");
                boton.setAttribute("aria-label", "Asiento " + codigo + (ocupado ? ", ocupado" : ", disponible"));
                filaEl.appendChild(boton);

                if (numero === config.pasilloEn) {
                    const corte = document.createElement("span");
                    corte.className = "corte-pasillo";
                    corte.setAttribute("aria-hidden", "true");
                    filaEl.appendChild(corte);
                }
            });
            mapa.appendChild(filaEl);
        });
    }

    function toggle(codigo) {
        if (seleccion.has(codigo)) {
            seleccion.delete(codigo);
        } else {
            if (seleccion.size >= config.maxSelecion) {
                alert("Puedes seleccionar hasta " + config.maxSelecion + " asientos por reservación.");
                return;
            }
            seleccion.add(codigo);
        }
        renderMapa();
        pintarResumen();
    }

    function pintarResumen() {
        const lista = Array.from(seleccion).sort();
        document.getElementById("sel-lista").textContent = lista.length
            ? (lista.length === 2 ? lista.join(" y ") : lista.join(", "))
            : "—";
        const cantidad = lista.length;
        document.getElementById("sel-cantidad").textContent =
            cantidad + (cantidad === 1 ? " boleto" : " boletos") + " × $" + config.precioBoleto;
        document.getElementById("sel-total").textContent = datos.mxn(cantidad * config.precioBoleto);

        const continuar = document.getElementById("enlace-continuar");
        continuar.href = datos.armarEnlace("confirmacion.html", {
            pelicula: "sombras",
            funcion: estado.funcion.id,
            asientos: lista.join(",")
        });
        const volver = document.getElementById("enlace-volver");
        volver.href = datos.armarEnlace("detalle.html", { pelicula: "sombras" });
    }

    renderMapa();
    pintarResumen();
})();
