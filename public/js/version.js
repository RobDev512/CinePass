/* Versión compartida entre las páginas de CinePass. */
document.addEventListener("DOMContentLoaded", async function () {
    try {
        const respuesta = await fetch("data/version.json");
        if (!respuesta.ok) throw new Error("No se pudo cargar la versión.");
        const datos = await respuesta.json();
        document.querySelectorAll("[data-version]").forEach(function (el) {
            el.textContent = "v" + datos.version + " · " + datos.nombre;
        });
        document.querySelectorAll("[data-version-corta]").forEach(function (el) {
            el.textContent = "v" + datos.version;
        });
    } catch (error) {
        console.info("Se mantiene la versión escrita en el HTML.", error.message);
    }
});
