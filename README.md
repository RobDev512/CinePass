# CinePass 🎬

Proyecto final de **Programación Web**.

CinePass es una aplicación web para consultar películas, elegir funciones, seleccionar asientos y gestionar reservaciones y boletos digitales. El proyecto se encuentra en desarrollo: algunas pantallas y funcionalidades todavía son propuestas.

## Tecnologías

- HTML, CSS y JavaScript (frontend).
- Node.js y Express (servidor).
- Git y GitHub (trabajo colaborativo).

## Instalación y ejecución en Windows

Sigue estos pasos **en tu propia computadora**. Los comandos se pueden ejecutar desde **PowerShell** o desde la terminal de Visual Studio Code.

### 1. Instalar los programas necesarios

Instala:

1. **Node.js, versión LTS:** https://nodejs.org/ (incluye npm).
2. **Git para Windows:** https://git-scm.com/downloads/win
3. **Visual Studio Code (recomendado):** https://code.visualstudio.com/

Después de instalar Node.js y Git, **cierra y vuelve a abrir PowerShell o VS Code**. Comprueba que funcionan con estos comandos:

```powershell
node --version
npm --version
git --version
```

Cada comando debe mostrar un número de versión. Si alguno no se reconoce, comprueba su instalación antes de continuar.

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

## Estado actual

- **Inicio y Cartelera:** versión V2, con navegación, diseño adaptable y filtros de películas.
- **Logo SVG y favicon:** integrados.
- **Servidor Express:** operativo, con la ruta de prueba `/api/salud`.
- **Detalle, selección de asientos, confirmación, Mis boletos y Administración:** en desarrollo o pendientes de integración.
- **Base de datos, API REST completa y CRUD:** pendientes de implementación y pruebas.

### Vista previa en línea

https://robdev512.github.io/CinePass/

Esta URL muestra el **frontend estático** publicado con GitHub Pages. No ejecuta el servidor Express ni sustituye la instalación local para desarrollar el proyecto.
