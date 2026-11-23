# CinePass · Integración de catálogo y reservación DEMO

**Estado:** Prototipo, no existe API ni base de datos para reservaciones.
**Autoría:** catálogo e integración desde Inicio/Cartelera, Robert; diseño y lógica de Confirmación/Mis boletos, basados en Iván Vladimir y la versión de Claude.

## Qué se conectó
- `public/js/catalogo-demo.js` es la referencia compartida de **seis** películas para Inicio y Cartelera.
- `public/js/catalogo-paginas.js` dibuja las tarjetas con datos del mismo catálogo, conserva búsqueda y filtro por género.
- Solo **Sombras del Faro** permite `Probar reserva (DEMO)` en esta fase. El botón envía película, función y asientos de muestra a Confirmación.
- `public/js/reserva-datos.js` usa el mismo título, cartel y precio para esta película, sin duplicar sus metadatos.
- El flujo de Iván sigue siendo `Confirmación → Mis boletos`; sus folios están en `sessionStorage`.
- Un nuevo cartel SVG y un arte de boleto SVG tienen el texto «Sombras del Faro» para no mostrar una película distinta en el mismo recorrido.

## Restricciones deliberadas
- Los otros cinco títulos aún no tienen funciones: no inventamos salas, horarios ni asientos.
- No se crean `detalle.html` ni `asientos.html`: esas dos páginas son responsabilidad de **Lance**.
- No hay autenticación, pago real, asiento bloqueado en servidor ni persistencia entre navegadores.
- `Mis boletos` solo muestra los datos de **esta pestaña** y datos ficticios de muestra, no reservas de usuarios reales.
- Las fechas de función de la demostración son relativas a la fecha local, por lo que no son una programación de cine real.

## Contrato de integración con Lance
Al terminar Detalle y Selección, podrán abrir una URL como:

`confirmacion.html?pelicula=sombras&funcion=demo-01&asientos=A1,A2`

`pelicula`: ID del catálogo; `funcion`: ID de la función existente; `asientos`: hasta seis identificadores A1–H10.

> El contrato es **temporal** y solo para la demostración. Cuando exista backend, la pantalla debe recibir un `funcionId` real, consultar precio y disponibilidad en la API y reservar de forma atómica desde el servidor. No se deben aceptar precios ni disponibilidad enviados por el cliente como autoridad.

## Pendiente para la siguiente fase
1. API de películas, funciones, salas y reservas (trabajo de Robert/CRUD).
2. Reemplazar catálogo temporal por `fetch` a `/api/peliculas`.
3. Probar y conectar Detalle/Asientos de Lance, sin duplicar esas pantallas.
4. Persistencia real y prevención de dobles reservas en SQLite.
5. Actualizar versión y roadmap solo cuando el avance se integre formalmente.

## Pruebas manuales
1. En Cartelera buscar «faro», filtrar Misterio y usar `Probar reserva (DEMO)`.
2. Confirmar que título, cartel, función, asientos y precio se mantengan.
3. Rellenar nombre y apellido, correo válido, método de pago simulado y términos.
4. Confirmar y revisar Mis boletos con el mismo nombre, fecha, asientos y folio.
5. Regresar a Cartelera y probar una segunda reservación: el enlace elige otra pareja de asientos de muestra no utilizada.
6. Probar los filtros Activos/Próximos/Historial y Descargar boleto.
