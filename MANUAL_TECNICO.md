# Documentación Técnica Integral - EMasterFuchiboli

Documentacion para que sepan que show 

---

## 1. Arquitectura y Stack
*   **Core**: React 18+ con Vite (SPA).
*   **Lenguaje**: TypeScript (Strict Mode).
*   **Gestión de Datos**: TanStack Query v5 (React Query).
*   **Estilos**: TailwindCSS + Lucide Icons.
*   **Autenticación**: JWT / Bearer Token persistido en LocalStorage vía Context API.

## 2. Gestión de Navegación y Estado Global (`App.tsx`)
La aplicación no utiliza un router externo (como react-router), sino un sistema de **Renderizado Condicional** basado en el estado `activePage`.

*   **Estado `activePage`**: Determina qué componente de la carpeta `/src/pages` se muestra en el área principal.
*   **Temporada Global**: El estado `selectedSeason` se maneja en `App.tsx` y se comparte con todos los componentes para mantener la consistencia al navegar entre pestañas.
*   **Selección de Equipo**: Al hacer clic en un equipo en la vista de lista, se actualiza `selectedTeam` y se cambia automáticamente a la vista `equipo-detalle`.

---

## 3. Estructura de Archivos (Catálogo)

### 3.1. Páginas (`/src/pages`)
*   `Login.tsx`: Gestión de acceso y protección de rutas.
*   `Temporada.tsx`: Dashboard principal con tabla general, goleadores y sistema de jornadas.
*   `Equipos.tsx`: Buscador y listado financiero de todos los equipos.
*   `EquipoDetalle.tsx`: Ficha profunda de un equipo (Plantilla + Transacciones).
*   `Jugadores.tsx`: Buscador global de jugadores con paginación.
*   `Transferencias.tsx`: Panel de gestión de ofertas y mercado.
*   `Noticias.tsx`: Feed de noticias y anuncios oficiales.
*   `Configuracion.tsx`: Ajustes de usuario y cierre de sesión.

### 3.2. Componentes de Negocio (`/src/components`)
*   `MatchDetailModal.tsx`: Edición de resultados, estadísticas de partido y evidencias.
*   `PlayerProfileModal.tsx`: Ficha técnica de jugadores.
*   `CreateNoticiaModal.tsx`: Editor de publicaciones para administradores.
*   `Sidebar.tsx`: Navegación principal y selector de Temporada Global.

### 3.3. Capa de Servicios (`/src/services`)
Centralizan la comunicación con la API.
*   `api/api.service.ts`: Wrapper genérico de Fetch. Implementa `getAsync`, `postAsync` y `deleteAsync`.
*   `api/api.endpoints.ts`: Configuración única de URLs.
*   `auth.ts`, `jornadas.ts`, `equipos.ts`, `jugadores.ts`, `noticias.ts`, `transferencias.ts`: Métodos específicos por módulo.

### 3.4. Sistema de Tipos (`/src/types`)
Define el contrato de datos para evitar errores de inconsistencia.
*   `auth.types.ts` / `user.types.ts`: Gestión de sesión y usuario.
*   `jornadas.types.ts`: Modelos de partidos y estadísticas de juego.
*   `player.types.ts` / `player-dto.types.ts`: Perfiles y transferencia de jugadores.
*   `temporada.types.ts`: Clasificaciones y goleadores.
*   `transferencias.types.ts`: Mercado de fichajes.
*   `noticias.types.ts`: Estructura de publicaciones.
*   `financial.types.ts`: Modelos de ingresos y gastos.

---

## 4. Diccionario de Interfaces y Tipos Clave

Para entender el flujo de datos, es vital conocer los contratos definidos en `/src/types`:

### 4.1. Autenticación y Usuario (`auth.types.ts` / `user.types.ts`)
*   **`UserSession`**: Objeto central del usuario autenticado. Contiene el `token`, el rol de `administrador` y el objeto del equipo asignado.
*   **`Equipo`**: Representa la entidad del club. Incluye presupuestos, ingresos, gastos y la URL del escudo.

### 4.2. Jornadas y Encuentros (`jornadas.types.ts`)
*   **`Encuentro`**: El modelo del partido. Contiene marcadores, estados (`cerrado`, `completado`) y referencias a los equipos.
*   **`EstadisticaJugadorSaveDto`**: Data Transfer Object para enviar los goles, amarillas, rojas y lesiones capturadas en el modal hacia la API.
*   **`PrmEncuentroEstadisticas`**: El "payload" final de guardado que agrupa el marcador global y el detalle por jugador.

### 4.3. Temporada y Rendimiento (`temporada.types.ts`)
*   **`TemporadaData`**: El objeto que alimenta la vista general. Contiene la `tabla` de posiciones, la lista de `goleadores` y los `mejoresEquipos`.
*   **`EquipoTabla`**: Fila individual de la clasificación con registros de PJ, PG, PE, PP, DG y Puntos.

### 4.4. Mercado y Finanzas (`transferencias.types.ts` / `financial.types.ts`)
*   **`Oferta`**: Define una propuesta económica por un jugador, incluyendo el monto, el equipo de origen/destino y el estado de la negociación.
*   **`Transaccion`**: Modelo para registrar ingresos o gastos específicos de un equipo.

---

## 5. Lógica de Implementación Detallada

### 5.1. Patrón de Consumo de API
El `ApiService` detecta automáticamente el contexto del usuario. Cuando se llama a una función con `requiresAuth: true`, inyecta en los headers el `token` y el identificaor de `usuario` guardados en el navegador.

### 5.2. Robustez de Datos (Parsing)
Debido a la naturaleza flexible de la API, se utiliza un patrón de extracción en los componentes:
```typescript
const data = responseData;
const list = data?.lstDatos || data?.datos || (Array.isArray(data) ? data : []);
```
Esto asegura que si el backend devuelve una lista envuelta en un objeto o de forma plana, la UI no se rompa.

### 5.3. Gestión de Estado con React Query (Caché)
Se utilizan `queryKeys` descriptivas para permitir la invalidación de datos. Por ejemplo, al guardar un resultado, invalidamos `["encuentros"]` para que la tabla y las jornadas se refresquen solas.

---

## 6. Guía de Desarrollo de Nuevas Features

### Paso 1: Tipado
Define los contratos de datos primero para asegurar que el componente no tenga errores de "undefined".

### Paso 2: Servicio
Crea el método en `/src/services`. Recuerda pasar `true` si el endpoint requiere que el usuario esté logueado.

### Paso 3: Vista
Usa el hook `useQuery` o `useMutation`. Mantén la lógica de negocio en el componente de página y deja que el modal solo se encargue de la captura de datos.

---

## 7. Diseño y Estética
*   **Colores**: Los que nos dio el poderosisimo agente copilot que se la rifo 
*   **Layout**: Sistema de Sidebar colapsable con contenido principal en contenedor de alto contraste.
*   **Modo Oscuro**: Implementado nativamente vía Tailwind (`dark:`).

---

## 8. Comandos de Operación
*   Instalación: `npm install`
*   Desarrollo: `npm run dev`
*   Compilación: `npm run build`

Esta documentacion mas o menos se encarga de que se sepa el contexto del proyecto , favor de actualizarlo en caso de mejoras 
