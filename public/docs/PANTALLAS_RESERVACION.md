# Pantallas del flujo de reservación (con datos de prueba)

**Versión del proyecto:** v0.2.0 — Primera proyección
**Estado:** pantallas nuevas del módulo de reservación, alimentadas con **datos
de prueba** (aún no hay API REST ni base de datos; ver ROADMAP v0.6.0).
**Actualizado:** 22 de noviembre de 2026

Este documento resume **qué entra, qué sale y cómo entrar** a cada pantalla del
recorrido. Cada archivo `.html` y `.css` del flujo trae además su propia
documentación en el encabezado (comentario `QUÉ ENTRA / QUÉ SALE / CÓMO ENTRAR`),
que es la fuente de verdad a nivel de código.

## Recorrido completo

```
Inicio → Cartelera → detalle.html → asientos.html → confirmacion.html → mis-boletos.html
         (paso 1)      (paso 2)       (paso 3)         (resultado)
```

Las pantallas nuevas son **detalle**, **asientos**, **confirmación** (creada
igual a la captura de referencia del equipo) y **mis boletos** (igual a la
segunda captura). Como no hay backend todavía, todo el flujo funciona solo con
datos sembrados en `public/js/reserva-datos.js`; los datos del formulario se
pasan entre pantallas por **URL** y por **sessionStorage**, y se pierden al
cerrar la pestaña.

## Resumen por pantalla

| Pantalla | Archivo | Qué entra | Qué sale | Cómo entrar |
| --- | --- | --- | --- | --- |
| Detalle de película | `detalle.html` + `css/detalle.css` + `js/detalle.js` | `?pelicula=` (con datos de prueba: `sombras`); sin parámetros arranca con la película de las capturas | Enlace a `asientos.html` con `?pelicula=&funcion=` (función elegida) | Cartelera → tarjeta «Sombras del Faro» → «Ver detalles» |
| Selección de asientos | `asientos.html` + `css/asientos.css` + `js/asientos.js` | `?pelicula=&funcion=`; mapa de prueba (filas A–F, ocupados sembrados, precio $90 MXN) | Enlace a `confirmacion.html` con `?pelicula=&funcion=&asientos=` (CSV) | Detalle → «Continuar: elegir asientos» |
| Confirmar reservación | `confirmacion.html` + `css/confirmacion.css` + `js/confirmacion.js` | Estado viajero de la pantalla 2 + formulario: nombre*, correo*, teléfono opcional (10 dígitos), método de pago* y términos* | Reserva validada en sessionStorage (`cinepass_reserva_actual`) con folio nuevo y redirección a Mis boletos | Asientos → «Continuar: confirmar» (o directa con datos de prueba) |
| Mis boletos | `mis-boletos.html` + `css/mis-boletos.css` + `js/mis-boletos.js` | Reservas sembradas (folios `CP-2026-1148` y `CP-2026-1097`) + la reserva recién confirmada | Boleto digital con QR **decorativo** (no escaneable); «Descargar boleto» genera un .txt local; «Compartir» copia al portapapeles | Confirmación (tras confirmar) o menú «Mis boletos» |

## Datos de prueba que se ven en las capturas

- Película: **Sombras de la Noche** (en Cartelera aparece como «Sombras del Faro») · B15 · 105 min · Misterio / Suspenso.
- Función sembrada (la de la confirmación): **Sáb 21 Nov 2026 · 7:30 p. m. · Sala 3 · D5 y D6 · 2 boletos × $90 = $180 MXN**.
- Cliente sembrado en Mis boletos: **Ana Sofía Ramírez**, folio **CP-2026-1148** (tarjeta NUEVO seleccionada).
- Segunda reserva sembrada: **Vie 20 Nov 2026 · 5:10 p. m. · Sala 3 · B7 y B8**, folio **CP-2026-1097**.
- Precio único por boleto: **$90 MXN** (sin taquillas ni recargas).

## Archivos compartidos del módulo

- `css/reserva-flujo.css` — variables, pasos (stepper), columnas con divisor, campos, botones, avisos y tarjetas del flujo.
- `js/reserva-datos.js` — catálogo de películas, funciones, mapa de asientos, reservas sembradas, utilidades de URL/sessionStorage y QR decorativo.
- `img/poster-sombras.svg` — cartel vectorial aproximado del cartel fotográfico de la referencia.

## Notas de diseño

- Fuente de la referencia: **Inter** (Google Fonts) con fallback **Segoe UI/Arial**;
  sin internet el aspecto se mantiene en Windows.
- Acento menta `#62d9c2` para pasos, totales, QR y checkbox; coral `#f4534a`
  para llamados a la acción, tomados de las capturas.
- El pie es la única pieza añadida que las capturas no alcanzan a mostrar
  (cortan en el viewport); se dejó el pie compartido del proyecto.
- El QR es decorativo: no codifica datos y no es escaneable (no hay backend
  que valide folios todavía).

## Para probar en local

```powershell
npm ci    # solo la primera vez
npm start
```

y abrir <http://localhost:3000/> → Cartelera → «Sombras del Faro» → el recorrido
completo. En GitHub Pages (solo frontend) el flujo también funciona, porque las
pantallas nuevas no dependen del servidor Express.
