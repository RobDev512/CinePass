/* =========================================================
   PANTALLA: MIS BOLETOS — script propio (js/mis-boletos.js)
   Depende de js/reserva-datos.js (cargarlo ANTES en el HTML).
   ----------------------------------------------------------
   QUÉ ENTRA:  reservas de prueba sembradas en el módulo
               compartido + la reserva recién confirmada en
               sessionStorage (escrita por js/confirmacion.js).
   QUÉ SALE:   boleto grande actualizado al elegir una tarjeta;
               "Descargar boleto" genera un .txt en el navegador
               (no hay API todavía) y "Compartir" copia un resumen
               al portapapeles. Nada se persiste en servidor.
   CÓMO ENTRAR: confirmacion.html → AQUÍ (tras confirmar) o desde
               el menú "Mis boletos" de cualquier página.
   ========================================================= */
(function () {
    "use strict";

    const datos = window.CinePassReserva;
    const lista = document.getElementById("lista-boletos");
    const mensajeVacio = document.getElementById("lista-vacia");

    // Normaliza la reserva recién confirmada (campos del formulario) al
    // formato de las reservas sembradas; entra por sesión, sale pintada.
    function reservasVisibles() {
        const recientes = [];
        const guardada = datos.leerReservaGuardada();
        if (guardada && guardada.folio) {
            recientes.push({
                folio: guardada.folio,
                cliente: guardada.cliente || "—",
                fecha: guardada.fecha || "",
                hora: guardada.hora || "",
                sala: guardada.sala || "",
                asientos: Array.isArray(guardada.asientos) ? unirse(guardada.asientos) : String(guardada.asientos || ""),
                estado: "nuevo",
                grupo: "activos",
                nuevaSesion: true
            });
        }
        const sembradas = datos.RESERVAS_SEMBRADAS.map(function (r) {
            const copia = Object.assign({}, r);
            copia.grupo = (r.estado === "proximo" || r.estado === "historial") ? r.estado : "activos";
            return copia;
        });
        return recientes.concat(sembradas);
    }

    function unirse(listaAsientos) {
        if (listaAsientos.length === 2) return listaAsientos[0] + " y " + listaAsientos[1];
        if (listaAsientos.length > 2) return listaAsientos.slice(0, -1).join(", ") + " y " + listaAsientos[listaAsientos.length - 1];
        return listaAsientos[0] || "";
    }

    let tabActual = "activos";
    let folioElegido = null;

    // ---------- Lista de tarjetas ----------
    function renderLista() {
        Array.prototype.forEach.call(lista.querySelectorAll(".boleto-tarjeta"), function (n) { n.remove(); });
        const visibles = reservasVisibles().filter(function (r) { return r.grupo === tabActual; });

        if (visibles.length === 0) {
            mensajeVacio.hidden = false;
        } else {
            mensajeVacio.hidden = true;
            if (!visibles.some(function (r) { return r.folio === folioElegido; })) {
                folioElegido = visibles.some(function (r) { return r.nuevaSesion; })
                    ? visibles.filter(function (r) { return r.nuevaSesion; })[0].folio
                    : "CP-2026-1148";
            }
            visibles.forEach(function (reserva) {
                lista.appendChild(tarjeta(reserva));
            });
        }
        renderBoleto();
    }

    function tarjeta(reserva) {
        const elegida = reserva.folio === folioElegido;
        const art = document.createElement("article");
        art.className = "boleto-tarjeta" + (elegida ? " seleccionada" : "");
        art.tabIndex = 0;
        art.setAttribute("role", "tab");
        art.setAttribute("aria-selected", elegida ? "true" : "false");
        art.dataset.folio = reserva.folio;

        const chip = elegida
            ? '<span class="tarjeta-chip"><span class="chip chip-menta">' + datos.ICONOS.check + " Seleccionado</span></span>"
            : '<span class="tarjeta-chip"><span class="chip chip-outline"><span class="punto" aria-hidden="true"></span>Activo</span></span>';
        const nuevo = reserva.estado === "nuevo" ? '<span class="nuevo-label">NUEVO</span>' : "";

        art.innerHTML =
            '<img src="img/poster-sombras.svg" alt="Cartel de la película Sombras de la Noche">' +
            '<div class="tarjeta-info">' +
                '<h3 class="tarjeta-titulo">' + (datos.PELICULAS.sombras.nombre) + "</h3>" +
                nuevo +
                '<div class="tarjeta-filas">' +
                    '<span class="fila"><span class="icono">' + datos.ICONOS.calendario + "</span>" + reserva.fecha + "</span>" +
                    '<span class="fila"><span class="icono">' + datos.ICONOS.reloj + "</span>" + reserva.hora + "</span>" +
                    '<span class="fila"><span class="icono">' + datos.ICONOS.pantalla + "</span>" + reserva.sala + " · " + reserva.asientos + "</span>" +
                    '<span class="fila"><span class="icono">' + datos.ICONOS.boletoSimple + "</span>Folio: " + reserva.folio + "</span>" +
                "</div>" +
                chip +
            "</div>";

        art.addEventListener("click", function () { seleccionar(reserva.folio); });
        art.addEventListener("keydown", function (evento) {
            if (evento.key === "Enter" || evento.key === " ") { evento.preventDefault(); seleccionar(reserva.folio); }
        });
        return art;
    }

    function seleccionar(folio) {
        folioElegido = folio;
        renderLista();
    }

    // ---------- Pestañas (datos de prueba: Activos con contenido) ----------
    const pestanas = Array.from(document.querySelectorAll(".pestana"));
    pestanas.forEach(function (pestana) {
        pestana.addEventListener("click", function () {
            tabActual = pestana.dataset.tab;
            pestanas.forEach(function (otra) {
                const activa = otra === pestana;
                otra.classList.toggle("pestana-activa", activa);
                otra.setAttribute("aria-selected", activa ? "true" : "false");
            });
            document.getElementById("titulo-boleto").setAttribute("aria-label", "Boletos en la pestaña " + pestana.textContent);
            renderLista();
        });
    });

    // ---------- Boleto grande + QR ----------
    function renderBoleto() {
        const reserva = reservasVisibles().find(function (r) { return r.folio === folioElegido; }) || reservasVisibles()[0];
        if (!reserva) return;
        document.getElementById("boleto-fecha").textContent = reserva.fecha;
        document.getElementById("boleto-hora").textContent = reserva.hora;
        document.getElementById("boleto-sala").textContent = reservaOr(reserva.sala);
        document.getElementById("boleto-asientos").textContent = reservaOr(reserva.asientos);
        document.getElementById("boleto-cliente").textContent = reservaOr(reserva.cliente);
        document.getElementById("boleto-folio").textContent = reservaOr(reserva.folio);
        document.getElementById("qr-caja").innerHTML = datos.qrDecorativo(reserva.folio);
    }
    function reservaOr(valor) { return valor || "—"; }

    // ---------- Acciones del boleto (simuladas, sin backend) ----------
    const btnDescargar = document.getElementById("btn-descargar");
    btnDescargar.addEventListener("click", function () {
        const reserva = reservasVisibles().find(function (r) { return r.folio === folioElegido; });
        if (!reserva) return;
        const texto = [
            "CinePass — Boleto digital (demostración con datos de prueba)",
            "Folio: " + reserva.folio,
            "Película: " + datos.PELICULAS.sombras.nombre,
            "Función: " + reserva.fecha + " · " + reserva.hora + " · " + reserva.sala,
            "Asientos: " + reserva.asientos,
            "Cliente: " + reserva.cliente,
            "QR: decorativo (no escaneable). Presenta este código al ingresar."
        ].join("\n");
        const enlace = document.createElement("a");
        enlace.href = URL.createObjectURL(new Blob([texto], { type: "text/plain;charset=utf-8" }));
        enlace.download = "boleto-" + reserva.folio + ".txt";
        enlace.click();
        URL.revokeObjectURL(enlace.href);
    });

    const btnCompartir = document.getElementById("btn-compartir");
    const textoOriginalCompartir = btnCompartir.innerHTML;
    btnCompartir.addEventListener("click", function () {
        const reserva = reservasVisibles().find(function (r) { return r.folio === folioElegido; });
        if (!reserva) return;
        const resumen = "CinePass " + reserva.folio + " — " + datos.PELICULAS.sombras.nombre + ", " + reserva.fecha + " " + reserva.hora + ", " + reserva.sala + ", asientos " + reserva.asientos + ".";
        function feedback() {
            btnCompartir.textContent = "¡Copiado al portapapeles!";
            setTimeout(function () { btnCompartir.innerHTML = textoOriginalCompartir; }, 1800);
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(resumen).then(feedback, function () { feedback(); });
        } else {
            window.prompt("Copia el resumen del boleto:", resumen);
        }
    });

    // Arranque: pestaña Activos con la tarjeta de la captura seleccionada.
    renderLista();
})();
