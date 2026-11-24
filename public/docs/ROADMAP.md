# Roadmap de CinePass

**Versión actual: v0.4.0 — Boleto en mano**  
**Estado:** Prototipo público  
**Actualizado:** 23 de noviembre de 2026

CinePass se desarrolla en dos fases. De v0.1.0 a v0.7.0 se integran las siete pantallas, una por hito. De v0.8.0 a v1.0.0 se implementa el sistema funcional y se comprueba la rúbrica. Las fechas futuras no están fijadas.

Publicada significa que la interfaz del hito está disponible; no acredita por sí sola el funcionamiento real, la persistencia o el cumplimiento de la rúbrica. Las etapas v0.3.0 y v0.4.0 se publican juntas en esta actualización. El progreso actual es de cuatro de siete interfaces integradas (no el porcentaje de desarrollo total). GitHub Pages sirve el frontend estático; el backend Express se ejecutará por separado.

Las etapas alimentan la vista visual de `roadmap.html`. Estados: Publicada, En desarrollo, Planeada y Objetivo.

---

## v0.1.0 — Encendido de cabina
**Estado:** Publicada  
**Responsables:** Robert  
**Objetivo:** Establecer la base del proyecto e integrar Inicio.

### Implementado
- [x] Estructura del proyecto, Node.js y Express con /api/salud.
- [x] Primera interfaz de Inicio y navegación base.
- [x] Repositorio GitHub preparado para colaborar.

---

## v0.2.0 — Primera proyección
**Estado:** Publicada  
**Responsables:** Robert  
**Objetivo:** Integrar Cartelera y unificar la identidad visual de las primeras pantallas.

### Implementado
- [x] Inicio y Cartelera V2 con seis películas ficticias.
- [x] Búsqueda por título, filtro por género y contador.
- [x] Diseño adaptable, logo SVG y favicon.
- [x] GitHub Pages y publicación automática.
- [x] README, guía del equipo, video conceptual e indicador de versión.

---

## v0.3.0 — Reserva confirmada
**Estado:** Publicada  
**Responsables:** Iván Vladimir (interfaz), Robert (integración)  
**Objetivo:** Integrar Confirmación de reservación como interfaz de demostración.

### Implementado en DEMO
- [x] Resumen de película, función, asientos e importe simulado.
- [x] Formulario de datos del cliente con validaciones en JavaScript.
- [x] Método de pago simulado; sin procesar pagos reales.
- [x] Guardado temporal de la reservación en el navegador y navegación a Mis boletos.

### Dependencias
- La validación del servidor, persistencia y prevención real de reservas duplicadas se implementarán en las versiones funcionales.

---

## v0.4.0 — Boleto en mano
**Estado:** Publicada  
**Responsables:** Iván Vladimir (interfaz), Robert (integración)  
**Objetivo:** Integrar Mis boletos y conectar las cuatro pantallas disponibles en modo DEMO.

### Implementado en DEMO
- [x] Mis boletos con consulta de reservaciones temporales de la sesión.
- [x] Visualización de boleto digital, folio y código QR de demostración.
- [x] Filtros de boletos e historial de ejemplo.
- [x] Catálogo compartido y seis carteles temporales para Inicio y Cartelera.
- [x] Encabezado, pie de página e identidad visual comunes.
- [x] Flujo provisional Cartelera → Confirmación → Mis boletos.

### Dependencias
- No hay persistencia de reservaciones en base de datos, autenticación ni verificación de boletos en el servidor. El flujo provisional se reemplazará al integrar Detalle y Asientos.

---

## v0.5.0 — Elige tu función
**Estado:** En desarrollo  
**Responsables:** Lance (interfaz), Robert (integración)  
**Objetivo:** Incorporar Detalle de película y conectarlo con el catálogo.

### En desarrollo
- [ ] Ficha con cartel, sinopsis, clasificación y duración.
- [ ] Selección de fecha, horario y sala con datos temporales.
- [ ] Navegación desde Inicio y Cartelera hacia Detalle y después a Asientos.
- [ ] Homologar HTML semántico, CSS adaptable, encabezado y pie de página.

---

## v0.6.0 — Tu asiento
**Estado:** En desarrollo  
**Responsables:** Lance (interfaz), Robert (integración)  
**Objetivo:** Incorporar Selección de asientos y completar el recorrido visual de reservación.

### En desarrollo
- [ ] Mapa de asientos con estados disponibles, ocupados y seleccionados usando datos temporales.
- [ ] Selección múltiple y cálculo del total mediante JavaScript.
- [ ] Conectar Detalle → Asientos → Confirmación → Mis boletos sin atajos DEMO.
- [ ] Validar selección y navegación en pantallas de distintos tamaños.

---

## v0.7.0 — Tras bambalinas
**Estado:** En desarrollo  
**Responsables:** Jorge (interfaz), Robert (integración)  
**Objetivo:** Incorporar la interfaz de Administración y completar las siete pantallas.

### En desarrollo
- [ ] Interfaz para consultar y gestionar películas, salas, funciones y reservaciones con datos de ejemplo.
- [ ] Formularios y controles visuales de creación, edición y eliminación.
- [ ] Integración de la séptima pantalla con la identidad visual común.
- [ ] Revisión de la estructura HTML, CSS, navegación, formularios y JavaScript en las siete pantallas.

### Dependencias
- Esta etapa no incluye el CRUD real ni permisos de servidor. Jorge desarrolla la interfaz; Robert desarrolla el backend, la API y la base de datos después de integrar las siete pantallas.

---

## v0.8.0 — Sistema conectado
**Estado:** Planeada  
**Responsables:** Robert (backend, API y base de datos)  
**Objetivo:** Implementar persistencia y el primer CRUD funcional después de completar las siete interfaces.

### Planeado
- [ ] Diseñar e implementar la base de datos de películas, salas, funciones, asientos y reservaciones, con relaciones y restricciones.
- [ ] Implementar API REST con GET, POST, PUT y DELETE para películas, salas y funciones, respuestas JSON, códigos HTTP y validación del servidor.
- [ ] Conectar Inicio, Cartelera, Detalle y los formularios de Administración a la API mediante fetch.
- [ ] Demostrar creación, consulta, actualización y eliminación desde la interfaz, con persistencia tras recargar o reiniciar el servidor.
- [ ] Definir permisos de acceso administrativo y probar entradas inválidas, errores y estados vacíos.

---

## v0.9.0 — Reservación conectada
**Estado:** Planeada  
**Responsables:** Robert (backend e integración), equipo (pruebas de sus módulos)  
**Objetivo:** Completar la integración funcional de reservaciones, asientos, boletos y Administración.

### Planeado
- [ ] Consultar funciones y disponibilidad real de asientos mediante la API.
- [ ] Crear reservaciones con precio y disponibilidad validados por el servidor.
- [ ] Impedir reservas duplicadas de un asiento para la misma función con restricciones o transacciones.
- [ ] Consultar, actualizar y cancelar reservaciones según las reglas de negocio; definir eliminación cuando corresponda.
- [ ] Conectar Confirmación, Mis boletos y Administración a datos persistentes; verificar acceso y folios en el servidor.
- [ ] Completar formularios, mensajes de error y peticiones asíncronas en todo el flujo; el pago seguirá siendo simulado.
- [ ] Probar el CRUD completo y el recorrido cliente-administrador con datos reales de prueba.

---

## v1.0.0 — Estreno oficial
**Estado:** Objetivo  
**Responsables:** Todo el equipo  
**Objetivo:** Entregar CinePass completo, funcional y demostrable de acuerdo con la rúbrica.

### Resultado esperado
- [ ] Siete pantallas funcionales, conectadas y con datos persistentes (mínimo exigido: cinco).
- [ ] HTML semántico y bien estructurado, CSS consistente y adaptable, navegación clara.
- [ ] JavaScript con DOM, eventos, funciones, arreglos y peticiones asíncronas mediante fetch.
- [ ] Formularios con validaciones del cliente y del servidor y mensajes claros.
- [ ] API REST GET, POST, PUT y DELETE con JSON y códigos HTTP; CRUD completo desde la interfaz con persistencia.
- [ ] Pruebas del flujo completo, de errores, de reservas duplicadas y de persistencia.
- [ ] README de instalación y demostración, repositorio con ramas, commits y participación de todos los integrantes.
- [ ] Video de demostración funcional de 12 a 15 minutos con explicación y participación de todo el equipo.

---

## Control de la rúbrica del profesor (100 puntos)

| Criterio | Puntos | Evidencia final a verificar |
| --- | ---: | --- |
| Cinco o más pantallas funcionales | 10 | Siete interfaces conectadas con el sistema real. |
| HTML semántico | 15 | Estructura y elementos semánticos correctos. |
| CSS y diseño visual | 15 | Diseño consistente, legible y adaptable. |
| Navegación entre pantallas | 5 | Recorridos completos sin enlaces rotos. |
| JavaScript, DOM y asincronía | 10 | Eventos, funciones, arreglos, DOM y fetch. |
| Formularios y validaciones | 10 | Rechazo de entradas inválidas con mensajes claros. |
| API REST | 10 | GET, POST, PUT, DELETE, JSON, códigos HTTP. |
| CRUD completo | 10 | Crear, leer, actualizar y eliminar desde la interfaz con persistencia. |
| Video demostrativo | 10 | Video real de 12 a 15 minutos, con participación de todos. |
| Colaboración en GitHub | 5 | Ramas, commits e integración del trabajo de todos. |
| **Total** | **100** | Verificar al finalizar; no es una calificación obtenida. |

## Mantenimiento del roadmap

- Actualizar la versión por pantalla integrada hasta v0.7.0 y por hito funcional después.
- Probar cada módulo antes de marcarlo como implementado; no confundir una maqueta DEMO con una función real.
- Actualizar `public/data/version.json`, `package.json`, `package-lock.json`, README y los indicadores HTML al publicar una nueva versión.
- El video conceptual no sustituye al video de demostración final.
