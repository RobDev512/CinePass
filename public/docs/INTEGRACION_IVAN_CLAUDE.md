# CinePass — Integración del diseño de Claude para los módulos de Iván

**Estado:** propuesta local de integración sobre `feat/adaptar-confirmacion-boletos`.
**Versión del proyecto:** v0.2.0 — Primera proyección.

## Procedencia y alcance

- Se utilizan como base los archivos de `VersionClaude.zip` compartidos por Robert. Ese paquete, a su vez, parte de las pantallas de **Iván Vladimir**, responsables 05 y 06.
- Se conserva su estructura visual, formularios, tarjetas, navegación, boleto, descarga PNG, QR de demostración y filtros.
- Se incluyen HTML, CSS, JavaScript, ilustraciones SVG y licencia del QR embebida en `js/vendor/qrcode.js`.
- **No** se cambian Inicio, Cartelera, Detalle, Asientos, Administración ni la rama remota de Iván.
- El logo del paquete se renombró a `logo-cinepass-flujo.svg` para no sobrescribir el logo global de CinePass.

## Ajustes de compatibilidad

- Se vuelve a mostrar la versión corta junto al logo y la completa en el footer, con enlaces a Roadmap y Video conceptual.
- No se reenvían datos personales por URL ni se solicitan datos bancarios.
- Se muestran fechas futuras relativas a la fecha actual y los registros de ejemplo no bloquean los asientos de las pruebas.
- Los registros de prueba usan `sessionStorage` y una clave propia para no mezclar sesiones anteriores.
- El QR puede escanearse, pero solo codifica un folio DEMO y **no es un comprobante válido para entrar al cine**.
- El nombre completo requiere al menos nombre y apellido.
- El pago es ficticio. No hay API REST ni base de datos.

## Dependencia pendiente de integración

El paquete de Claude utiliza la película ficticia **Sombras de la Noche**, pero en la Cartelera que está publicada se conoce como **Sombras del Faro**. No modificamos Cartelera: antes de conectar el módulo de Lance deberán acordarse los identificadores definitivos de película, función, asientos y el catálogo único.

## Probar

1. Copia todo `public/` de este ZIP a la raíz del proyecto sin borrar otros archivos.
2. Para que las tipografías se vean **exactamente** como en el concepto, copia de **tu propio** archivo original `VersionClaude.zip` la carpeta `fonts/` hacia `public/fonts/`. Este paquete no redistribuye archivos de fuentes.
3. Ejecuta `npm start` y abre `http://localhost:3000/confirmacion.html` y `http://localhost:3000/mis-boletos.html`.
4. En Confirmación, ingresa un nombre y apellido ficticios y un correo válido, elige el método de pago y acepta las condiciones.
5. Prueba crear una reserva, filtrar entre pestañas, descargar el PNG y compartir los datos.
6. Comprueba que el navegador no muestre páginas blancas al desplazar y que la versión y el footer coincidan con la web principal.

**Advertencia:** la seguridad de asientos y la propiedad de las reservas tendrán que validarse en el servidor cuando se implemente el CRUD y la API. `sessionStorage` nunca es sustituto de autenticación.
