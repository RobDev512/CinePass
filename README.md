# CinePass 🎬

**Versión actual: v0.4.0 — Boleto en mano** · Prototipo público.

Proyecto final de **Programación Web**.

CinePass es una aplicación web para consultar películas, elegir funciones, seleccionar asientos y gestionar reservaciones y boletos digitales. Actualmente se han integrado cuatro de las siete interfaces previstas: Inicio, Cartelera, Confirmación y Mis boletos. Las reservaciones son una demostración temporal en el navegador; el sistema real todavía no está implementado.

## Tecnologías

- HTML, CSS y JavaScript (frontend).
- Node.js y Express (servidor).
- Git y GitHub (trabajo colaborativo).

## Instalación y ejecución en Windows

Sigue estos pasos **en tu propia computadora**. Los comandos se pueden ejecutar desde **PowerShell** o desde la terminal de Visual Studio Code.

### 1. Comprobar Node.js y npm

Para ejecutar CinePass necesitas **Node.js**, que incluye npm. Comprueba que ya los tienes instalados:

```powershell
node --version
npm --version
```

Ambos comandos deben mostrar un número de versión. Si te falta Node.js, instala la versión LTS desde https://nodejs.org/ y vuelve a abrir la terminal.

### 2. Descargar el proyecto con Git

Abre PowerShell en la carpeta donde quieras guardar el proyecto (por ejemplo, Documentos) y ejecuta:

```powershell
git clone https://github.com/RobDev512/CinePass.git
cd CinePass
```

> **Importante:** `git clone` crea una carpeta llamada `CinePass` y la conecta con el repositorio de GitHub. Para trabajar en equipo, **no uses «Download ZIP»**, porque perderías esa conexión.

Si ya clonaste el proyecto anteriormente, **no vuelvas a clonarlo**. Entra a tu carpeta existente y ejecuta `git pull origin main` estando en `main` y sin cambios locales pendientes.

### 3. Abrir el proyecto en VS Code (opcional)

Si tienes el comando `code` disponible, desde la carpeta `CinePass` ejecuta:

```powershell
code .
```

También puedes abrir VS Code y usar **Archivo → Abrir carpeta → CinePass**.

### 4. Instalar las dependencias

En la terminal, asegúrate de estar **dentro de la carpeta CinePass**, donde se encuentran `package.json` y `package-lock.json`.

Ejecuta:

```powershell
npm ci
```

Esto instala las dependencias indicadas en el proyecto. Puede crear una carpeta `node_modules`; **es normal y no debes subirla a GitHub**.

> Si PowerShell muestra un error relacionado con la ejecución de `npm.ps1`, utiliza `npm.cmd ci`. No necesitas cambiar las políticas de seguridad de Windows.

### 5. Iniciar CinePass

En la misma carpeta, ejecuta:

```powershell
npm start
```

El servidor debe mostrar algo similar a:

```text
CinePass funcionando en http://localhost:3000
```

**Deja esa terminal abierta** mientras utilizas la página. Abre en tu navegador:

- **Inicio:** http://localhost:3000/
- **Cartelera:** http://localhost:3000/cartelera.html
- **Confirmación (DEMO):** http://localhost:3000/confirmacion.html
- **Mis boletos (DEMO):** http://localhost:3000/mis-boletos.html
- **Prueba del servidor (JSON):** http://localhost:3000/api/salud

La última dirección debe mostrar un objeto JSON con `"estado": "Funcionando"`.

Para detener el servidor, regresa a la terminal y presiona **Ctrl + C**.

### 6. ¿Cómo volver a abrirlo otro día?

No hace falta reinstalar las dependencias cada vez. Solo:

1. Abre la carpeta `CinePass` en VS Code.
2. Abre una terminal en esa carpeta.
3. Ejecuta `npm start`.
4. Visita http://localhost:3000/.

Vuelve a ejecutar `npm ci` cuando cambien las dependencias del proyecto.

## Solución de problemas frecuentes

| Problema | Qué revisar |
| --- | --- |
| `node`, `npm` o `git` no se reconoce | Instala el programa correspondiente y reinicia la terminal. |
| PowerShell bloquea `npm.ps1` | Usa `npm.cmd ci` y `npm.cmd start`. |
| `npm start` indica que no encuentra `package.json` | Estás en otra carpeta: abre la carpeta raíz de `CinePass`. |
| Aparece un error de módulo faltante | Ejecuta `npm ci` desde la raíz del proyecto. |
| El puerto 3000 está ocupado | Cierra el otro servidor que esté usando ese puerto. |
| El navegador no abre `localhost:3000` | Comprueba que `npm start` siga ejecutándose y que la terminal no muestre errores. |

## Colaboración en GitHub

Para subir cambios al repositorio, pide primero que te agreguen como colaborador y **acepta la invitación**.

Cada integrante debe desarrollar sus tareas en una rama propia, sin modificar directamente `main`. Por ejemplo:

```powershell
git switch main
git pull origin main
git switch -c feat/nombre-del-modulo
```

Después de hacer y probar tus cambios:

```powershell
git add .
git commit -m "Agregar avances de mi modulo"
git push -u origin feat/nombre-del-modulo
```

En GitHub, crea un **Pull Request** desde tu rama hacia `main` para revisar e integrar el trabajo. Sustituye `nombre-del-modulo` por un nombre descriptivo y distinto al de tus compañeros.

> **No ejecutes `git init` dentro de la copia clonada**, porque ya es un repositorio Git. Tampoco subas `node_modules`, credenciales ni contraseñas.

## Versiones y roadmap

CinePass utiliza versiones con nombre. La actual es **v0.4.0 — Boleto en mano**. Cada versión hasta v0.7.0 representa la integración de una pantalla; las versiones v0.3.0 y v0.4.0 se publican juntas. Las versiones v0.8.0 a v1.0.0 se reservan para la implementación funcional y las pruebas finales.

| Versión | Nombre | Alcance | Estado |
| --- | --- | --- | --- |
| v0.1.0 | Encendido de cabina | Inicio y estructura base | Publicada |
| v0.2.0 | Primera proyección | Cartelera | Publicada |
| v0.3.0 | Reserva confirmada | Confirmación DEMO | Publicada |
| v0.4.0 | Boleto en mano | Mis boletos DEMO | Publicada |
| v0.5.0 | Elige tu función | Detalle | En desarrollo |
| v0.6.0 | Tu asiento | Selección de asientos | En desarrollo |
| v0.7.0 | Tras bambalinas | Administración (interfaz) | En desarrollo |
| v0.8.0 | Sistema conectado | Base de datos, API y primer CRUD | Planeada |
| v0.9.0 | Reservación conectada | CRUD e integración de reservaciones y boletos | Planeada |
| v1.0.0 | Estreno oficial | Pruebas, demostración y entrega | Objetivo |

- 🗺️ [Roadmap visual interactivo](https://robdev512.github.io/CinePass/roadmap.html) — etapas, filtros y responsables.
- 📝 [ROADMAP.md](public/docs/ROADMAP.md) — documento editable que alimenta la visualización e incluye el control completo de la rúbrica.
- 🎞️ [Ver la demostración conceptual en la web](https://robdev512.github.io/CinePass/demo.html) — reproductor en GitHub Pages y enlace alternativo de descarga.

La versión se muestra en las páginas mediante `public/data/version.json`. Cuando se publique una actualización, hay que cambiar ese archivo, `package.json`, `package-lock.json`, los indicadores HTML, el nombre de versión aquí y la etapa correspondiente del roadmap.

## Material de referencia

Los siguientes materiales ayudan a organizar el trabajo y visualizar el resultado esperado:

- 📄 **[Guía de trabajo en equipo (PDF)](docs/Guia_Equipo_CinePass.pdf):** asignación de módulos, entregables pendientes y rúbrica del proyecto.
- 🎬 **[Demostración conceptual de CinePass (MP4)](https://github.com/RobDev512/CinePass/releases/tag/demo-conceptual-v1):** video conceptual que ilustra cómo se espera que funcione la aplicación completa.

> **Nota:** el video conceptual no sustituye el video de demostración funcional de 12 a 15 minutos con participación de todos los integrantes, exigido para la entrega.

## Estado actual

- **Inicio y Cartelera (Robert):** versión V2, seis películas ficticias con carteles temporales, navegación, diseño adaptable y filtros.
- **Confirmación y Mis boletos (Iván Vladimir, integradas por Robert):** interfaces publicadas con reservaciones DEMO en sessionStorage, validaciones del cliente, boleto digital y QR de ejemplo. No representan un sistema de compra real.
- **Detalle y selección de asientos (Lance):** pendientes de integración.
- **Administración (Jorge):** interfaz pendiente de integración.
- **Servidor Express:** operativo con la ruta de prueba `/api/salud`.
- **Base de datos, API REST completa y CRUD (Robert):** pendientes hasta integrar las siete interfaces.

La entrega final deberá demostrar las siete pantallas funcionales (la rúbrica exige cinco o más), HTML semántico, CSS consistente, navegación, JavaScript/DOM y fetch, formularios validados, API REST GET/POST/PUT/DELETE, CRUD persistente desde la interfaz, colaboración en GitHub y video funcional de 12 a 15 minutos. La lista de control de los diez criterios y sus 100 puntos se encuentra en [ROADMAP.md](public/docs/ROADMAP.md).

### Vista previa en línea

https://robdev512.github.io/CinePass/

Esta URL muestra el **frontend estático** publicado con GitHub Pages. No ejecuta el servidor Express ni sustituye la instalación local para desarrollar el proyecto.
