/* =========================================================
   CINEPASS - MÓDULO COMPARTIDO DE DATOS DE PRUEBA DEL FLUJO
   Archivo: js/reserva-datos.js (cargar PRIMERO en las 4 páginas)
   ----------------------------------------------------------
   QUÉ ENTRA:  parámetros de URL que dejan las pantallas
               anteriores (?pelicula, ?funcion, ?asientos) y la
               reserva guardada en sessionStorage durante la
               navegación (clave "cinepass_reserva_actual").
   QUÉ SALE:   window.CinePassReserva: catálogo de películas de
               prueba, funciones sembradas (la de la referencia:
               Sáb 21 Nov 2026 · 7:30 p. m. · Sala 3), mapa de
               asientos de prueba, reservas sembradas para
               Mis boletos (folios CP-2026-1148 y CP-2026-1097),
               utilidades de lectura/guardado y QR decorativo.
   CÓMO SE USA (cómo se llega a las pantallas que lo cargan):
               Inicio → Cartelera → tarjeta "Sombras del Faro" →
               detalle.html (paso 1) → asientos.html (paso 2) →
               confirmacion.html (paso 3) → mis-boletos.html.
   NOTA:       no hay API REST todavía (ROADMAP v0.6.0); todos
               los valores son DATOS DE PRUEBA y los cambios se
               pierden al cerrar la pestaña.
   ========================================================= */
(function () {
    "use strict";

    /* ---------- Catálogo de películas de prueba ----------
       Las fichas que usan las pantallas del flujo; "sombras" es
       la película de las capturas de diseño del equipo. */
    const PELICULAS = {
        sombras: {
            id: "sombras",
            nombre: "Sombras de la Noche",          // como se ve en la captura
            nombreTarjeta: "Sombras del Faro",      // título de la tarjeta en Cartelera
            clasificacion: "B15",
            duracion: 105,
            genero: "Misterio",
            generosConfirmacion: "Misterio / Suspenso",
            sinopsis: "Un pueblo costero, un faro y un oscuro secreto del pasado que sale a la luz.",
            cartel: "img/poster-sombras.svg"
        },
        orbita9: { nombre: "Órbita 9", clasificacion: "B", duracion: 120, genero: "Ciencia ficción", sinopsis: "Una estación en el borde del sistema solar recibe una señal que nadie debería haber escuchado.", precioBoleto: 90 },
        aventurapixel: { nombre: "Aventura Pixel", clasificacion: "A", duracion: 95, genero: "Animación", sinopsis: "Un héroe de píxeles debe reiniciar un mundo que se queda sin colores.", precioBoleto: 90 },
        rutasalvaje: { nombre: "Ruta Salvaje", clasificacion: "B", duracion: 112, genero: "Aventura", sinopsis: "Dos hermanas cruzan la selva siguiendo un mapa que cambia cada noche.", precioBoleto: 90 },
        ultimatoma: { nombre: "La Última Toma", clasificacion: "B", duracion: 108, genero: "Drama", sinopsis: "Un director busca la escena que nunca logró filmar.", precioBoleto: 90 },
        codigoEclipse: { nombre: "Código Eclipse", clasificacion: "B15", duracion: 118, genero: "Acción", sinopsis: "Cada segundo cuenta cuando el reloj del mundo se detiene.", precioBoleto: 90 }
    };
    PELICULAS.sombras.precioBoleto = 90;

    /* ---------- Funciones de prueba de "Sombras de la Noche" ----------
       f-sab21-1930-s3 es la función de las capturas (mis boletos
       muestra además como segunda reserva la función Vie 20). */
    const FUNCIONES = {
        "f-sab21-1930-s3": { id: "f-sab21-1930-s3", fecha: "Sáb 21 Nov 2026", hora: "7:30 p. m.", sala: "Sala 3" },
        "f-vie20-1710-s3": { id: "f-vie20-1710-s3", fecha: "Vie 20 Nov 2026", hora: "5:10 p. m.", sala: "Sala 3" },
        "f-dom22-1820-s1": { id: "f-dom22-1820-s1", fecha: "Dom 22 Nov 2026", hora: "6:20 p. m.", sala: "Sala 1" },
        "f-dom22-2015-s5": { id: "f-dom22-2015-s5", fecha: "Dom 22 Nov 2026", hora: "8:15 p. m.", sala: "Sala 5" }
    };

    /* ---------- Mapa de asientos de prueba (asientos.html) ----------
       Ocupados sembrados; D5/D6 (los de la captura) quedan libres
       y se preseleccionan para que la ruta ciega coincida con ella. */
    const ASIENTOS = {
        filas: ["A", "B", "C", "D", "E", "F"],
        columnas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        pasilloEn: 5,
        precioBoleto: 90,
        maxSelecion: 10,
        sembrarSeleccion: ["D5", "D6"],
        ocupados: ["A1", "A2", "B8", "C3", "C9", "D1", "E2", "E7", "F4", "F10"]
    };

    /* ---------- Reservas sembradas para mis-boletos.html ----------
       Coinciden con la captura del equipo (folio, fecha, hora, sala,
       asientos y cliente). El QR es decorativo, no escaneable. */
    const RESERVAS_SEMBRADAS = [
        { folio: "CP-2026-1148", cliente: "Ana Sofía Ramírez", fecha: "Sáb 21 Nov 2026", hora: "7:30 p. m.", sala: "Sala 3", asientos: "D5 y D6", estado: "nuevo" },
        { folio: "CP-2026-1097", cliente: "Carlos Medina", fecha: "Vie 20 Nov 2026", hora: "5:10 p. m.", sala: "Sala 3", asientos: "B7 y B8", estado: "activo" }
    ];

    /* ---------- Pasos compartidos del stepper ---------- */
    const PASOS = [
        { ruta: "detalle.html", etiqueta: "Película" },
        { ruta: "asientos.html", etiqueta: "Asientos" },
        { ruta: "confirmacion.html", etiqueta: "Confirmación" }
    ];

    /* ---------- Utilidades (qué entra → qué sale) ---------- */
    function leerParametros() {
        return new URLSearchParams(window.location.search);
    }

    function armarEnlace(ruta, parametros) {
        const url = new URL(ruta, window.location.href);
        Object.keys(parametros).forEach(function (clave) {
            if (parametros[clave] !== null && parametros[clave] !== undefined && parametros[clave] !== "") {
                url.searchParams.set(clave, parametros[clave]);
            }
        });
        return url.pathname.split("/").pop() + url.search;
    }

    function guardarReserva(reserva) {
        try {
            sessionStorage.setItem("cinepass_reserva_actual", JSON.stringify(reserva));
        } catch (error) {
            console.info("El navegador no permite sessionStorage; la reserva no sobrevivirá a la recarga.", error.message);
        }
    }

    function leerReservaGuardada() {
        try {
            return JSON.parse(sessionStorage.getItem("cinepass_reserva_actual") || "null");
        } catch (error) {
            return null;
        }
    }

    function nuevoFolioPrueba() {
        return "CP-2026-" + (1201 + Math.floor(Math.random() * 99));
    }

    /* Estado viajero: parámetros de la URL; si no hay, datos de
       prueba sembrados para que cualquier pantalla funcione sola. */
    function estadoFlujo() {
        const q = leerParametros();
        const reserva = leerReservaGuardada() || {};
        const pelicula = PELICULAS[q.get("pelicula")] || PELICULAS[reserva.peliculaId] || PELICULAS.sombras;
        const funcion = FUNCIONES[q.get("funcion")] || FUNCIONES[reserva.funcionId] || FUNCIONES["f-sab21-1930-s3"];
        let asientos = q.get("asientos") || (reserva.asientos ? String(reserva.asientos).replace(/ y /g, ",") : null) || ASIENTOS.sembrarSeleccion.join(",");
        return {
            pelicula: pelicula,
            funcion: funcion,
            asientos: String(asientos).split(",").map(function (a) { return a.trim(); }).filter(Boolean),
            cantidad: null,
            origen: (q.get("pelicula") || q.get("funcion") || q.get("asientos")) ? "url" : (reserva.folio ? "sesion" : "prueba")
        };
    }

    function reservaActual() {
        const estado = estadoFlujo();
        return {
            pelicula: estado.pelicula,
            funcion: estado.funcion,
            asientos: estado.asientos,
            cantidad: estado.asientos.length,
            precioBoleto: PELICULAS.sombras.precioBoleto,
            origen: estado.origen
        };
    }

    function reservadasEn(funcionId) {
        return RESERVAS_SEMBRADAS.filter(function (r) { return r.funcionId === funcionId; });
    }

    function asientoOcupado(codigo, funcionId) {
        return ASIENTOS.ocupados.indexOf(codigo) !== -1 ||
            reservadasEn(funcionId).some(function (r) { return String(r.asientos).split(/ y |, /).indexOf(codigo) !== -1; });
    }

    /* QR decorativo determinista a partir del folio (no escaneable). */
    function qrDecorativo(texto) {
        let semilla = 2166136261;
        for (let i = 0; i < String(texto).length; i++) {
            semilla ^= String(texto).charCodeAt(i);
            semilla = Math.imul(semilla, 16777619);
        }
        function aleatorio() {
            semilla ^= semilla << 13; semilla ^= semilla >>> 17; semilla ^= semilla << 5;
            return (semilla >>> 0) / 4294967295;
        }
        const n = 25;
        let celdas = "";
        function esReservada(fila, col) {
            return (fila < 8 && col < 8) || (fila < 8 && col >= n - 8) || (fila >= n - 8 && col < 8);
        }
        for (let fila = 0; fila < n; fila++) {
            for (let col = 0; col < n; col++) {
                if (esReservada(fila, col)) continue;
                if (aleatorio() > 0.52) {
                    celdas += '<rect x="' + (col * 1.2 + 1.6).toFixed(1) + '" y="' + (fila * 1.2 + 1.6).toFixed(1) + '" width="1.1" height="1.1" rx="0.25" fill="#141a28"/>';
                }
            }
        }
        function posicion(cx, cy) {
            return '<rect x="' + (cx * 1.2 + 1.2).toFixed(1) + '" y="' + (cy * 1.2 + 1.2).toFixed(1) + '" width="8.4" height="8.4" rx="1.4" fill="none" stroke="#141a28" stroke-width="1.2"/>' +
                   '<rect x="' + (cx * 1.2 + 3.6).toFixed(1) + '" y="' + (cy * 1.2 + 3.6).toFixed(1) + '" width="3.6" height="3.6" rx="0.5" fill="#141a28"/>';
        }
        let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="Código QR decorativo del boleto ' + texto + '">';
        svg += celdas + posicion(1, 1) + posicion(n - 7, 1) + posicion(1, n - 7);
        svg += "</svg>";
        return svg;
    }

    /* Render del stepper compartido (cada página define en qué paso va). */
    function renderStepper(pasoActivo) {
        let html = "";
        PASOS.forEach(function (paso, i) {
            const numero = i + 1;
            let estado = "paso-pendiente";
            let interior = String(numero);
            if (numero < pasoActivo) { estado = "paso-completo"; interior = ICONOS.check; }
            if (numero === pasoActivo) { estado = "paso-activo"; }
            html += '<span class="paso ' + estado + '"><span class="paso-circulo">' + interior + "</span><span class=\"paso-label\">" + paso.etiqueta + "</span></span>";
            if (numero < PASOS.length) html += '<span class="linea-paso"></span>';
        });
        return html;
    }

    /* Iconos embebidos (trazo tipo feather, currentColor). */
    const ICONOS = {
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        usuario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        correo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>',
        telefono: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
        calendario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        reloj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        pantalla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
        butacas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        boleto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9a2 2 0 0 1-2 2v2a2 2 0 0 1 2 2h18a2 2 0 0 1 2-2v-2a2 2 0 0 1-2-2z" transform="translate(0 -4) scale(1 1)"/><path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4z" fill="none"/><line x1="12" y1="7" x2="12" y2="17" stroke-dasharray="2 2"/></svg>',
        boletoSimple: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4z"/><line x1="10" y1="5" x2="10" y2="19" stroke-dasharray="2 2"/></svg>',
        tarjeta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
        paypalP: '<span class="paypal-g" aria-hidden="true">P</span>',
        efectivo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><line x1="6" y1="12" x2="6.01" y2="12"/><line x1="18" y1="12" x2="18.01" y2="12"/></svg>',
        escudo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11.5 11 13.5 15 8.5"/></svg>',
        descarga: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
        compartir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'
    };

    window.CinePassReserva = {
        PELICULAS: PELICULAS,
        FUNCIONES: FUNCIONES,
        ASIENTOS: ASIENTOS,
        RESERVAS_SEMBRADAS: RESERVAS_SEMBRADAS,
        PASOS: PASOS,
        ICONOS: ICONOS,
        leerParametros: leerParametros,
        armarEnlace: armarEnlace,
        guardarReserva: guardarReserva,
        leerReservaGuardada: leerReservaGuardada,
        nuevoFolioPrueba: nuevoFolioPrueba,
        estadoFlujo: estadoFlujo,
        reservaActual: reservaActual,
        asientoOcupado: asientoOcupado,
        qrDecorativo: qrDecorativo,
        renderStepper: renderStepper,
        mxn: function (cantidad) { return "$" + cantidad + " MXN"; }
    };
})();
