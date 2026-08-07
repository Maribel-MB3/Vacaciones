# 🌴 Vacaciones del Equipo - Departamento de Desarrollo

Aplicación web para visualizar y gestionar las vacaciones del equipo de desarrollo con vistas de **1 año completo (12 meses)**, **6 meses** o **mes a mes (3 meses / 1 mes)**, asignación automática de colores por desarrollador y sincronización con `vacations.json`.

---

## 🚀 Características principales

- **Sincronización con `vacations.json`**: Carga de datos directa desde `public/vacations.json` o repositorios remotos.
- **Identificación por Color**: Cada desarrollador cuenta con un color personalizado y distintivo en el calendario de Gantt.
- **Vistas Adaptables**:
  - **1 Año entero (12M)**: Visión global anual de todas las vacaciones.
  - **6 Meses (6M)**: Panorama semestral.
  - **Trimestral / Mensual (3M / 1M)**: Detalle diario de descansos.
- **Exclusivo Desarrollo**: Enfocado en el departamento de desarrollo sin distinción de estados de aprobación (todas confirmadas).
- **Control de Solapamientos**: Detección automática de coincidencias de fechas entre desarrolladores.
- **Sincronización y Configuración de GitHub**: Permite configurar un Personal Access Token de GitHub para sincronización directa en el repositorio.

---

## 🛠️ Instalación y ejecución local

```bash
# 1. Clonar el repositorio
git clone <URL_DE_TU_REPOSITO>
cd <NOMBRE_DEL_REPOSITO>

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`.

---

## 📦 Construcción y Despliegue en GitHub Pages

Para construir los archivos estáticos listos para subir a GitHub Pages o cualquier hosting estático:

```bash
# Generar la carpeta dist/
npm run build
```

### ⚙️ Configuración para GitHub Pages (Solución pantalla en blanco)

1. **Rutas relativas activadas (`base: './'`)**:
   Ya se ha configurado `vite.config.ts` con `base: './'` para que las rutas de los archivos JS/CSS no fallen en subdominios de GitHub Pages (`https://usuario.github.io/nombre-repo/`).

2. **Despliegue automático con GitHub Actions**:
   Hemos incluido el archivo de flujo `.github/workflows/deploy.yml`.
   - En tu repositorio de GitHub, ve a **Settings** > **Pages**.
   - En **Build and deployment** > **Source**, selecciona **GitHub Actions**.
   - Cada vez que subas cambios o exportes a la rama `main`, GitHub compilará y publicará la web automáticamente.

---

## 📁 Estructura del Archivo `vacations.json`

El archivo `public/vacations.json` almacena el listado de vacaciones en formato JSON:

```json
[
  {
    "id": "vac-1",
    "employee": "Laura García",
    "department": "Desarrollo",
    "avatarColor": "#5A5A40",
    "start": "2025-06-04",
    "end": "2025-06-08",
    "type": "vacation",
    "status": "approved",
    "notes": "Vacaciones de verano"
  }
]
```

---

## 🛠️ Tecnologías utilizadas

- **React 18** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Lucide React** (Iconos)
