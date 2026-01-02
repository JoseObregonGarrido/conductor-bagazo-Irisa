# conductor-bagazo-Irisa

Plataforma de monitoreo interactivo para conductores de bagazo en IRISA. Diagrama clickeable con parámetros en tiempo real.

## Contenido

- `bagazo-flow-monitoring-system/backend` — API Express simple que sirve datos y rutas.
- `bagazo-flow-monitoring-system/frontend` — Frontend React + Vite que muestra el diagrama y paneles.
- `tests/` — Scripts de Playwright para pruebas E2E y snapshots.

## Requisitos

- Node.js >= 16
- npm >= 8
- Git (opcional)

## Instalación rápida

1. Clona el repositorio (si aún no lo tienes):

```bash
git clone <url-del-repo>
cd conductor-bagazo-Irisa
```

2. Instala dependencias para backend y frontend por separado:

```bash
cd bagazo-flow-monitoring-system/backend
npm install

# en otra terminal
cd ../../bagazo-flow-monitoring-system/frontend
npm install
```

## Ejecutar en desarrollo

- Backend (carpeta `bagazo-flow-monitoring-system/backend`):

```bash
npm run dev
# o
npm start
```

- Frontend (carpeta `bagazo-flow-monitoring-system/frontend`):

```bash
npm run dev
```

El frontend por defecto usa Vite; abre la URL que imprima la consola (normalmente `http://localhost:5173`).

## Construir y servir producción

```bash
# en frontend
npm run build
npm run preview   # sirve la versión construida en modo preview

# o usar el script de serve que usa `sirv` para servir `dist`
npm run serve
```

## Tests E2E (Playwright)

Hay pruebas de Playwright en la carpeta `tests/` y resultados de ejecuciones en `playwright-report/`.

```bash
# desde la raíz si Playwright está instalado en el root package.json
npm test
# o usar el runner de Playwright directamente
npx playwright test
```

## Estructura del proyecto (resumen)

- `bagazo-flow-monitoring-system/backend`
  - `server.js` — servidor Express principal
  - `routes/` — rutas de la API (por ejemplo `puntos.js`)
  - `data/` — datos simulados usados por la API

- `bagazo-flow-monitoring-system/frontend`
  - `src/` — código fuente React
  - `public/` — recursos estáticos (modelos 3D, etc.)
  - `defer_css.js` — script post-build

## Tareas sugeridas

- Ejecutar localmente y verificar flujos (frontend + backend).
- Añadir tests unitarios (Jest + React Testing Library) para `src/components`.
- Dockerizar backend y frontend para despliegue sencillo.
- Añadir CI (GitHub Actions) que instale dependencias y ejecute tests.

## Contribución

1. Haz fork y un branch por feature.
2. Añade tests y documentación para cambios relevantes.
3. Abre un Pull Request explicando los cambios.

## Licencia

Proyecto con licencia MIT.
