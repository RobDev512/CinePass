/* =========================================================
   PANTALLA: CONFIRMACIÓN — script propio (js/confirmacion.js)
   Depende de js/reserva-datos.js (cargarlo ANTES en el HTML).
   ----------------------------------------------------------
   QUÉ ENTRA:  estado viajero (URL/sessionStorage) desde el
               módulo compartido + los campos del formulario
               (nombre*, correo*, teléfono opcional de 10
               dígitos, método de pago*, términos*).
   QUÉ SALE:   reserva validada guardada en sessionStorage
               ("cinepass_reserva_actual") con folio de prueba
               nuevo y redirección a mis-boletos.html. Los
               mensajes de error se pintan bajo cada campo.
   CÓMO ENTRAR A LA PANTALLA (documentado también en el .html):
               detalle.html → asientos.html → AQUÍ, o directa
               con datos de prueba por defecto.
   ========================================================= */
(function () {
    "use strict";

    const datos = window.CinePassReserva;
    const form = document.getElementById("formulario-confirmacion");

    // ---------- 1. Panel resumen (lo que llega de pasos previos) ----------
    function pintarResumen() {
        const reserva = datos.reservaActual();
        const p = reserva.pelicula;
        const f = reserva.funcion;
        document.getElementById("resumen-poster").src = p.cartel || "img/poster-sombras.svg";
        document.getElementById("resumen-titulo").textContent = p.nombre;
        document.getElementById("resumen-clasificacion").textContent = p.clasificacion;
        document.getElementById("resumen-duracion").textContent = p.duracion + " min";
        document.getElementById("resumen-genero").textContent = p.generosConfirmacion || p.genero;
        document.getElementById("resumen-sinopsis").textContent = p.sinopsis;
        document.getElementById("resumen-fecha").textContent = f.fecha;
        document.getElementById("resumen-hora").textContent = f.hora;
        document.getElementById("resumen-sala").textContent = f.sala;
        document.getElementById("resumen-asientos").textContent = unirseAsientos(reserva.asientos);
        document.getElementById("resumen-cantidad").textContent =
            reserva.cantidad + (reserva.cantidad === 1 ? " boleto" : " boletos") + " × $" + p.precioBoleto;
        document.getElementById("resumen-total").textContent =
            datos.mxn(reserva.cantidad * p.precioBoleto);
    }

    function unirseAsientos(lista) {
        if (lista.length === 2) return lista[0] + " y " + lista[1];
        if (lista.length > 2) return lista.slice(0, -1).join(", ") + " y " + lista[lista.length - 1];
        return lista[0] || "—";
    }

    // ---------- 2. Método de pago (radiogroup accesible con botones) ----------
    const botonesPago = Array.from(document.querySelectorAll("#metodos-pago .pago-boton"));
    let metodoElegido = "";
    botonesPago.forEach(function (boton) {
        boton.addEventListener("click", function () {
            metodoElegido = boton.dataset.metodo;
            botonesPago.forEach(function (otro) {
                const activo = otro === boton;
                otro.classList.toggle("seleccionado", activo);
                otro.setAttribute("aria-checked", activo ? "true" : "false");
            });
            mostrarError("metodo", "");
        });
    });

    // ---------- 3. Validación (mensajes bajo cada campo) ----------
    function mostrarError(campo, mensaje) {
        const parrafo = document.querySelector('[data-error-para="' + campo + '"]');
        if (!parrafo) return;
        parrafo.textContent = mensaje;
        parrafo.hidden = mensaje === "";
    }

    function validar() {
        let valido = true;

        const nombre = document.getElementById("nombre").value.trim();
        if (nombre.length < 3) { mostrarError("nombre", "Escribe tu nombre completo."); valido = false; }
        else mostrarError("nombre", "");

        const correo = document.getElementById("correo").value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) { mostrarError("correo", "Escribe un correo válido, por ejemplo nombre@ejemplo.com."); valido = false; }
        else mostrarError("correo", "");

        const telefono = document.getElementById("telefono").value.trim();
        if (telefono !== "" && !/^\d{10}$/.test(telefono)) { mostrarError("telefono", "El teléfono, si lo capturas, debe tener 10 dígitos."); valido = false; }
        else mostrarError("telefono", "");

        if (metodoElegido === "") { mostrarError("metodo", "Elige un método de pago."); valido = false; }
        else mostrarError("metodo", "");

        if (!document.getElementById("terminos").checked) { mostrarError("terminos", "Debes aceptar los términos y condiciones."); valido = false; }
        else mostrarError("terminos", "");

        return valido;
    }

    // ---------- 4. Confirmar → guardar y salir hacia Mis boletos ----------
    form.addEventListener("submit", function (evento) {
        evento.preventDefault();
        if (!validar()) return;

        const reserva = datos.reservaActual();
        const guardada = {
            peliculaId: reserva.pelicula.id || "sombras",
            funcionId: reserva.funcion.id,
            asientos: reserva.asientos,
            cantidad: reserva.cantidad,
            cliente: document.getElementById("nombre").value.trim(),
            correo: document.getElementById("correo").value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
            metodo: metodoElegido,
            folio: datos.nuevoFolioPrueba(), // folio nuevo de prueba
            estado: "nuevo",
            fecha: reserva.funcion.fecha,
            hora: reserva.funcion.hora,
            sala: reserva.funcion.sala,
            decorativo: true // origen: datos de prueba, sin API todavía
        };
        datos.guardarReserva(guardada);
        window.location.href = "mis-boletos.html"; // siguiente pantalla del flujo
    });

    document.getElementById("nombre").addEventListener("input", function () { mostrarError("nombre", ""); });
    document.getElementById("correo").addEventListener("input", function () { mostrarError("correo", ""); });
    document.getElementById("telefono").addEventListener("input", function () { mostrarError("telefono", ""); });
    document.getElementById("terminos").addEventListener("change", function () { mostrarError("terminos", ""); });

    pintarResumen();
})();
