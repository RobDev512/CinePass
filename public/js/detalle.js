/* =========================================================
   PANTALLA: DETALLE DE PELÍCULA — script propio (js/detalle.js)
   Depende de js/reserva-datos.js (cargarlo ANTES en el HTML).
   ----------------------------------------------------------
   QUÉ ENTRA:  ?pelicula= (por ahora la ficha completa de prueba
               es "sombras") y el catálogo/funciones sembradas
               del módulo compartido.
   QUÉ SALE:   asientos.html?pelicula=...&funcion=... con la
               función elegida (por defecto la de la referencia
               visual, f-sab21-1930-s3).
   CÓMO ENTRAR: Cartelera ("Sombras del Faro") → AQUÍ.
   ========================================================= */
(function () {
    "use strict";

    const datos = window.CinePassReserva;
    const estado = datos.estadoFlujo();
    const pelicula = datos.PELICULAS.sombras; // única ficha de prueba completa
    const contenedor = document.getElementById("lista-funciones");
    const enlaceContinuar = document.getElementById("enlace-continuar");

    // Ficha con los datos del catálogo sembrado.
    document.getElementById("resumen-titulo").textContent = pelicula.nombre;
    document.getElementById("resumen-clasificacion").textContent = pelicula.clasificacion;
    document.getElementById("resumen-duracion").textContent = pelicula.duracion + " min";
    document.getElementById("resumen-genero").textContent = pelicula.generosConfirmacion || pelicula.genero;
    document.getElementById("resumen-sinopsis").textContent = pelicula.sinopsis;
    document.getElementById("resumen-precio").textContent = "Precio por boleto: " + datos.mxn(pelicula.precioBoleto);

    // Funciones de prueba; la elegida por defecto es la de las capturas.
    const idsFunciones = Object.keys(datos.FUNCIONES);
    let elegida = estado.funcion.id;
    if (idsFunciones.indexOf(elegida) === -1) elegida = "f-sab21-1930-s3";

    function marcarElegida(id) {
        elegida = id;
        Array.prototype.forEach.call(contenedor.querySelectorAll(".funcion-tarjeta"), function (tarjeta) {
            const activo = tarjeta.dataset.funcion === id;
            tarjeta.classList.toggle("elegida", activo);
            tarjeta.setAttribute("aria-checked", activo ? "true" : "false");
        });
        enlaceContinuar.href = datos.armarEnlace("asientos.html", { pelicula: "sombras", funcion: id });
    }

    idsFunciones.forEach(function (id) {
        const funcion = datos.FUNCIONES[id];
        const tarjeta = document.createElement("button");
        tarjeta.type = "button";
        tarjeta.className = "funcion-tarjeta" + (id === elegida ? " elegida" : "");
        tarjeta.dataset.funcion = id;
        tarjeta.setAttribute("role", "radio");
        tarjeta.setAttribute("aria-checked", id === elegida ? "true" : "false");
        tarjeta.innerHTML =
            '<span class="marcador" aria-hidden="true">' + datos.ICONOS.check + "</span>" +
            '<span class="funcion-datos">' +
                '<span class="item"><span class="icono">' + datos.ICONOS.calendario + "</span><span class=\"fuerte\">" + funcion.fecha + "</span></span>" +
                '<span class="item"><span class="icono">' + datos.ICONOS.reloj + "</span><span class=\"fuerte\">" + funcion.hora + "</span></span>" +
                '<span class="item"><span class="icono">' + datos.ICONOS.pantalla + "</span><span class=\"fuerte\">" + funcion.sala + "</span></span>" +
                '<span class="funcion-precio">' + datos.mxn(pelicula.precioBoleto) + "</span>" +
            "</span>";
        tarjeta.addEventListener("click", function () { marcarElegida(id); });
        contenedor.appendChild(tarjeta);
    });
    contenedor.querySelector(".cargando").remove();

    // Arranque igual a las capturas: enlace ya apunta a la función sembrada.
    marcarElegida(elegida);
})();
