# Roadmap de CinePass

**Versión actual: v0.2.0 — Primera proyección**  
**Estado:** Prototipo público  
**Actualizado:** 21 de noviembre de 2026

Este documento define lo que CinePass **ya tiene**, lo que está **asignado** y lo que **falta desarrollar**. Está inspirado en el roadmap versionado del PW Hub. La versión publicada no implica que la compra de boletos ya funcione. Las fechas de las próximas versiones aún no están fijadas.

Las etapas aquí enumeradas alimentan la vista visual de `roadmap.html`; utiliza los estados **Publicada**, **En desarrollo**, **Planeada** y **Objetivo**.

---

## v0.1.0 — Encendido de cabina
**Estado:** Publicada  
**Responsables:** Robert  
**Objetivo:** Construir la base del proyecto y las primeras páginas.

### Implementado
- [x] Estructura independiente del proyecto.
- [x] Node.js y Express con la ruta de prueba /api/salud.
- [x] Inicio y Cartelera en su primera versión.
- [x] Repositorio GitHub preparado para colaborar.

---

## v0.2.0 — Primera proyección
**Estado:** Publicada  
**Responsables:** Robert  
**Objetivo:** Publicar una base visual consistente y la documentación del equipo.

### Implementado
- [x] Inicio V2 y Cartelera V2 con seis películas ficticias.
- [x] Búsqueda por título, filtro por género y contador.
- [x] Diseño adaptable, logo SVG y favicon.
- [x] GitHub Pages y publicación automática.
- [x] README de instalación, PDF del equipo y video conceptual.
- [x] Indicador de versión y roadmap navegable.

### Pendiente
- [ ] Conectar las películas con datos persistidos mediante una API.

---

## v0.3.0 — Tu función, tus asientos
**Estado:** En desarrollo  
**Responsables:** Lance  
**Objetivo:** Incorporar Detalle de película y Selección de asientos.

### En desarrollo
- [ ] Ficha de película con sinopsis, clasificación y funciones disponibles.
- [ ] Elección de fechas, horarios y salas.
- [ ] Mapa de asientos con estados disponible, ocupado y seleccionado.
- [ ] Selección múltiple con cálculo de total.

### Dependencias
- La ocupación real necesita datos en servidor. No basta con bloquear butacas visualmente.

---

## v0.4.0 — Boleto en mano
**Estado:** Planeada  
**Responsables:** Por asignar  
**Objetivo:** Completar el recorrido de reserva del cliente.

### Planeado
- [ ] Confirmación de reservación con formularios validados.
- [ ] Pago simulado sin procesar tarjetas reales.
- [ ] Consulta de Mis boletos con verificación de folio y correo.
- [ ] Boleto digital, historial y reglas de cancelación.

---

## v0.5.0 — Tras bambalinas
**Estado:** Planeada  
**Responsables:** Por asignar  
**Objetivo:** Administrar la información que aparece en CinePass.

### Planeado
- [ ] Panel administrativo con permisos adecuados.
- [ ] Crear, consultar, actualizar y eliminar películas.
- [ ] Administrar funciones y salas.
- [ ] Consultar reservaciones.

---

## v0.6.0 — Sistema conectado
**Estado:** Planeada  
**Responsables:** Trabajo compartido  
**Objetivo:** Integrar todos los módulos y guardar información real.

### Planeado
- [ ] Base de datos para películas, funciones, salas, asientos y reservaciones.
- [ ] API REST con GET, POST, PUT y DELETE; JSON y códigos HTTP.
- [ ] Integración de las pantallas mediante fetch.
- [ ] Validación del servidor que impida reservar un asiento dos veces para la misma función.
- [ ] Pruebas de formularios, navegación y reglas de negocio.

---

## v1.0.0 — Estreno oficial
**Estado:** Objetivo  
**Responsables:** Todo el equipo  
**Objetivo:** Entregar una aplicación completa y demostrable según la rúbrica.

### Resultado esperado
- [ ] Siete pantallas funcionales y conectadas.
- [ ] CRUD real con persistencia y API REST.
- [ ] Validaciones y navegación probadas.
- [ ] Colaboración visible en GitHub.
- [ ] Video de demostración real de 12 a 15 minutos con participación de todos.

---

## Mantenimiento del roadmap

- Al finalizar un módulo, probarlo antes de marcarlo como implementado.
- Editar este archivo para reflejar responsables y estados de las versiones.
- Cuando cambie la versión publicada, actualizar también public/data/version.json, package.json, package-lock.json y el encabezado del README.
- El video conceptual es una visión de diseño, no una demostración funcional.
