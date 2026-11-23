# CinePass — Integración selectiva de las pantallas de Iván

**Proyecto:** CinePass · **Versión:** v0.2.0 — Primera proyección

## Autoría y alcance

La base de la experiencia visual de **Confirmación de reservación** y **Mis boletos** proviene del trabajo de **Iván Vladimir** en la rama `rama-ivan`. La adaptación conserva el concepto de pasos de reservación, tarjeta de resumen, formulario con validaciones, elección de pago simulado, listado de boletos, vista grande del comprobante y acciones de descarga/compartir. Los estilos navy, coral y menta siguen sus referencias.

Esta entrega **no incluye** `detalle.html`, `asientos.html` ni modificaciones a las páginas de Robert. Tampoco integra todavía la pantalla administrativa de Jorge ni el CRUD de Robert.

## Archivos nuevos

- `confirmacion.html`, `css/confirmacion.css`, `js/confirmacion.js`
- `mis-boletos.html`, `css/mis-boletos.css`, `js/mis-boletos.js`
- `css/reserva-flujo.css` — estilos comunes exclusivos de estas pantallas
- `js/reserva-datos.js` — datos de prueba y contrato provisional de paso de datos
- `img/poster-sombras.svg` — adaptación del cartel ilustrado de Iván, con título coherente con Cartelera

## Contrato provisional con Lance

La futura pantalla **Selección de asientos** podrá abrir:

```text
confirmacion.html?pelicula=sombras&funcion=demo-01&asientos=D5,D6
```

En esta primera adaptación se aceptan los identificadores locales `sombras`, `demo-01` y `demo-02`. El número de butacas se limita a 6 y se validan códigos de A1 a H10. **No enviar por URL datos personales.** Cuando Lance conecte su módulo, acordaremos IDs de película/función obtenidos de la base de datos y eliminaremos los IDs de demostración.

## Qué ya se puede probar

1. **Formulario:** nombre (3-100 caracteres), correo, teléfono opcional de diez dígitos, método de pago simulado y aceptación de las condiciones de prueba.
2. **Confirmación:** calcula el total usando la cantidad de asientos y guarda un folio `CP-DEMO-*` en `sessionStorage`.
3. **Mis boletos:** muestra únicamente las reservas generadas en esa misma pestaña, con filtros Activos / Próximos (48 h) / Historial. Las funciones de ejemplo usan fechas futuras relativas.
4. **Descargar:** genera un comprobante `.txt` que aclara que es de demostración.
5. **Compartir:** intenta abrir el diálogo de compartir del navegador o copia un resumen al portapapeles.
6. **Cancelar:** cancela una reserva de prueba y la mueve a Historial. No modifica ningún servidor.

## Límites explícitos

- No existe conexión a API REST ni base de datos; **la reservación no es real**.
- La verificación de asientos repetidos se hace **solo entre reservas de esta sesión**. La validación definitiva debe ejecutarse de manera atómica en la API y la base de datos para evitar reservas duplicadas en múltiples equipos.
- `sessionStorage` no es un sistema de autenticación. No ofrece consulta entre dispositivos y no se usa para mostrar reservas de otros usuarios.
- No hay QR válido para ingreso: se muestra un diseño decorativo etiquetado **DEMO**.
- No se procesan tarjetas ni pagos. Las opciones de pago son ficticias.
- El nombre de la película coincide con la Cartelera actual: **Sombras del Faro**.
- No se añadieron enlaces desde Inicio o Cartelera para no modificar pantallas ajenas en esta fase. En una siguiente integración se agregarán con revisión.

## Pruebas mínimas antes de publicar

- [ ] Abrir la confirmación directamente; verificar advertencia visible de modo demo.
- [ ] Intentar enviar formulario vacío y comprobar los errores.
- [ ] Confirmar con datos ficticios y comprobar que aparece el mismo cliente en Mis boletos.
- [ ] Descargar el `.txt` y verificar sus datos.
- [ ] Abrir en móvil y revisar el boleto sin desbordamiento horizontal.
- [ ] Confirmar los mismos asientos dos veces y verificar el aviso de duplicación en esta sesión.
- [ ] Cancelar una reserva y localizarla en Historial.
- [ ] Cerrar la pestaña: las reservas son temporales; **no son persistencia de servidor**.

## Siguiente paso de integración

Revisar los archivos de Iván con el equipo, acordar con Lance el esquema de `peliculaId`, `funcionId` y asientos, diseñar los endpoints reales y retirar los datos de prueba. Robert conectará el CRUD con la API; Jorge entregará el HTML/CSS de la pantalla de Administración.
