# conductor-bagazo-Irisa

Plataforma de monitoreo interactivo para conductores de bagazo en IRISA. Diagrama clickeable con parámetros.

# conductor-bagazo-Irisa

Plataforma de monitoreo interactivo para conductores de bagazo en IRISA. Diagrama clickeable con parámetros.

## Contenido

- `bagazo-flow-monitoring-system/backend` — API Express que sirve datos y rutas.
- `bagazo-flow-monitoring-system/frontend` — Frontend React + Vite que muestra el diagrama y paneles.
- `tests/` — Scripts de Playwright para pruebas E2E y snapshots.

## Requisitos

- Node.js >= 20
- npm >= 8
- Git (opcional)
- Docker & Docker Compose (opcional, recomendado para despliegues)

## Instalación rápida (local)

1. Clona el repositorio:

```bash
git clone <url-del-repo>
cd conductor-bagazo-Irisa
```

2. Instala dependencias (dos terminales o en paralelo):

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

## Ejecutar con Docker Compose

Este repositorio incluye un `docker-compose.yml` para levantar servicios juntos (si está configurado).

```bash
docker compose up --build
```

Parar y eliminar contenedores:

```bash
docker compose down
```

### Recomendaciones de despliegue y seguridad

- Considera agregar healthchecks (ya incluidos en `docker-compose.yml`) para mejorar la robustez y permitir a orquestadores detectar servicios caídos.
- En producción, revisa la seguridad de las variables de entorno: evita incrustar secretos en `environment`. Usa `env_file`, `secrets` de Docker, o un gestor de secretos externo.
- Reduce la exposición de puertos innecesarios; protege servicios detrás de un reverse-proxy (NGINX, Traefik) y reglas de firewall.

Comandos útiles para monitoreo y depuración:

```bash
# Ver el estado de los servicios (puertos, estado, reinicios)
docker compose ps

# Ver logs en tiempo real (añade -f para "follow")
docker compose logs -f frontend
docker compose logs -f backend

# Para ver logs de todos los servicios
docker compose logs -f
```

Si quieres, puedo agregar un archivo `.env.example` y mostrar cómo usar `secrets` para los valores sensibles.

## Construir y servir producción (frontend)

```bash
cd bagazo-flow-monitoring-system/frontend
npm run build
npm run preview   # sirve la versión construida en modo preview
# o
npm run serve
```

## Tests E2E (Playwright)

Las pruebas de Playwright están en la carpeta `tests/` y los reportes en `playwright-report/`.

Desde la raíz (si Playwright está configurado en el `package.json` root):

```bash
npm test
# o
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

## Sugerencias y tareas futuras

- Añadir tests unitarios (Jest + React Testing Library) para `src/components`.
- Añadir CI (GitHub Actions) que instale dependencias y ejecute tests y lint.
- Mejorar la dockerización para despliegues (imágenes separadas para backend/frontend).

## Contribución

1. Haz fork y crea un branch por feature.
2. Añade tests y documentación para cambios relevantes.
3. Abre un Pull Request describiendo los cambios.

## Licencia

Proyecto con licencia MIT.
