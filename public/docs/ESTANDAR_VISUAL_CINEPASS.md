# CinePass — Estándar visual compartido

**Fecha:** 23 de noviembre de 2026 · **Versión mostrada:** v0.2.0 — Primera proyección

Las pantallas **Inicio, Cartelera, Confirmación, Mis boletos, Roadmap y Demostración** usan una cabecera y un pie de página iguales. El CSS del componente está en `public/css/identidad-cinepass.css` y se carga **después** de los CSS propios de cada página.

## Reglas para integrar Detalle, Asientos y Administración

- Reutilizar sin cambios las etiquetas `<header class="cp-site-header">...</header>` y `<footer class="cp-site-footer">...</footer>` de una pantalla actual. No crear otra barra distinta.
- Marcar como activa **solo una opción** de la navegación (`class="activo" aria-current="page"`), o ninguna en páginas informativas.
- Mantener el logo oficial en `img/logo-cinepass.svg` y la versión con `data-version-corta` en el encabezado. El pie usa `data-version` con nombre completo.
- No convertir el avatar en un inicio de sesión ficticio: por ahora es **decorativo**.
- Conservamos la paleta navy, acento coral y menta. Las fuentes locales son Nunito Sans (texto) y Montserrat (títulos). Si están disponibles en `public/fonts` se cargarán; de otro modo se utilizan fuentes del sistema.
- La ruta "Mis boletos" ya funciona como **demostración**. "Administración" permanece enlazada a la sección de desarrollo hasta integrar la pantalla de Jorge y el CRUD de Robert.
- La API, base de datos, pago real y control de asientos aún están pendientes. Nunca anunciar que ya funcionan solo por tener una interfaz.
- Como no hay componentes de servidor, el encabezado y pie están **duplicados intencionalmente** en HTML semántico: cambiar ambos en todas las páginas al editar el menú.

## Próxima integración

1. Recepción y validación del trabajo de Lance, sin reemplazarlo con maquetas provisionales de otro compañero.
2. Definición compartida de identificadores de películas/funciones/asientos. **Sombras de la Noche** en el demo de Iván/Claude y **Sombras del Faro** en Cartelera todavía son datos distintos; no fusionarlos inventando equivalencias.
3. Conexión de Confirmación con la función y asientos seleccionados.
4. Backend con persistencia y restricciones de asientos, seguido del panel de Jorge y CRUD de Robert.
5. Cuando una versión se publique de verdad, actualizar `public/data/version.json`, `package.json`, `package-lock.json` y README.
