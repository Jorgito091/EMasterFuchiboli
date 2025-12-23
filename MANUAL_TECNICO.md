# Manual Técnico: EMaster Fuchiboli (Guía de Desarrollador)

Este documento detalla la arquitectura técnica, los estándares de código y los flujos de datos críticos para el mantenimiento y escalabilidad de la plataforma.

---

## 1. Arquitectura de Software

La aplicación sigue un patrón de **Arquitectura de Capas Disociadas**, diseñado para minimizar el acoplamiento entre la UI y el Backend.

### 1.1 Diagrama de Capas
1.  **Capa de Presentación (React Components)**: Se encarga exclusivamente del renderizado y la gestión de eventos de usuario utilizando Tailwind CSS.
2.  **Capa de Estado Global (Hooks/Context)**: Maneja la persistencia de sesión (`AuthContext`) y el tema visual (`ThemeContext`).
3.  **Capa de Cache & Fetching (React Query)**: Administra el estado asíncrono, las re-peticiones y la caché de datos del servidor.
4.  **Capa de Negocio (Services)**: Contiene las funciones que transforman las peticiones de la UI en llamadas a la API y aplican reglas de negocio básicas.
5.  **Capa de Red (ApiService)**: Centraliza la configuración de `fetch`, inyección de cabeceras y manejo de errores HTTP.

---

## 2. Inmersión por Módulos (Deep Dive)

A continuación se detalla el funcionamiento de cada sección del sistema, indicando sus servicios, tipos y llamados a la API.

### 2.1 Autenticación (Auth)
- **Propósito**: Validar identidad y configurar el contexto global (`temporadaId`, `token`).
- **Servicio**: `AuthService.login` (`services/auth.ts`).
- **Endpoint**: `AUTH.LOGIN` (`/api/login/acceder`).
- **Tipos Clave**:
    - `LoginRequest`: (usuario, contraseña haseada, dispositivo).
    - `LoginResponse`: Contiene el objeto `usuario` y la `temporada` activa.
    - `UserSession`: Estructura que se guarda en `AuthContext` y `localStorage`.
- **Flujo**: Se cifra la contraseña en SHA-256 en `Login.tsx` antes de enviarla. Al recibir éxito, se inyecta la sesión en el `AuthProvider`.

### 2.2 Temporada (Tabla y Goleadores)
- **Propósito**: Mostrar el estado competitivo de los torneos.
- **Servicio**: `TemporadasService` (`services/temporadas.ts`).
- **Endpoints**:
    - `SEASONS.GET_TORNEOS`: Lista de torneos disponibles.
    - `SEASONS.GET_TEMPORADA`: Datos de tabla, goleadores y mejores equipos.
- **Tipos Clave**:
    - `Torneo`: (id, nombre, urlImagen).
    - `EquipoTabla`: (posicion, juegosJugados, puntos, diferencia).
    - `Goleador`: (jugador: {nombre}, equipo: {nombre}, goles).
- **Lógica UI**: `Temporada.tsx` orquesta el cambio entre torneos y refresca los datos automáticamente vía React Query.

### 2.3 Jornadas y Encuentros
- **Propósito**: Reportar y visualizar partidos.
- **Servicio**: `JornadasService` (`services/jornadas.ts`).
- **Endpoints**:
    - `JORNADAS.GET_ENCUENTROS`: Todos los partidos de una jornada.
    - `JORNADAS.GET_PENDIENTES`: Partidos sin reporte filtrados por equipo.
    - `JORNADAS.GET_JUGADOS`: Historial de resultados del equipo.
- **Tipos Clave**:
    - `Jornada`: Define si está activa, cerrada o es eliminatoria.
    - `Encuentro`: Vincula dos equipos y contiene el marcador y autor del reporte.
- **Integración**: Se utiliza el `user.equipo.id` del contexto de autenticación para los filtros de "Mis Partidos".

### 2.4 Mercado de Jugadores
- **Propósito**: Exploración global, creación y edición de futbolistas.
- **Servicio**: `JugadoresService` (`services/jugadores.ts`).
- **Endpoints**:
    - `PLAYERS.GET_AVAILABLE`: Listado paginado con soporte de búsqueda.
    - `PLAYERS.SAVE_PLAYER`: Crear o actualizar perfil.
    - `PLAYERS.GET_PLAYER_DETAIL`: Información extendida para el modal.
- **Tipos Clave**:
    - `JugadorListado`: Vista ligera para la tabla global.
    - `JugadorDTO`: Estructura para envío/guardado.
    - `JugadorDetalleResponse`: Datos completos (cláusula, estado de bloqueo).
- **Lógica de UI**: El `PlayerProfileModal.tsx` cambia entre modo "Lectura" (perfil) y "Captura" (Admin).

### 2.5 Equipos y Finanzas
- **Propósito**: Control administrativo de los presupuestos de los clubes.
- **Servicio**: `TeamsService` (`services/equipos.ts`).
- **Endpoints**:
    - `TEAMS.GET_PRESUPUESTOS`: Resumen financiero de todos los equipos.
    - `TEAMS.GET_INGRESOS_GASTOS`: Historial de transacciones de un equipo específico.
- **Tipos Clave**:
    - `Equipo`: (presupuestoInicial, ingresos, gastos).
    - `Transaccion`: (concepto, monto, tipo: ingreso/gasto).
- **Integración**: `EquipoDetalle.tsx` utiliza `formatCurrencyMillions` para simplificar la visualización de grandes montos.

### 2.6 Transferencias
- **Propósito**: Registro histórico del flujo de dinero entre equipos.
- **Endpoints**:
    - `TRANSFERS.GET_ALL`: Lista de fichajes realizados.
    - `TRANSFERS.GET_TIPOS`: Categorías (Libre, Traspaso, Intercambio).
- **Tipos Clave**: `Transferencia`, `OfertaJugador`.

### 2.7 Detalle de Encuentro y Estadísticas
- **Propósito**: Capturar resultados oficiales, goleadores, lesiones y evidencias (imágenes).
- **Servicio**: `JornadasService` (`services/jornadas.ts`).
- **Endpoints**:
    - `JORNADAS.GET_INFO_ENCUENTRO`: Información detallada de un partido.
    - `JORNADAS.SAVE_ENCUENTRO`: Envío de estadísticas y marcador final.
- **Tipos Clave**: 
    - `EstadisticaJugadorSaveDto`: Estructura simplificada para guardado.
    - `PrmEncuentroEstadisticas`: Payload maestro para el guardado.
- **Lógica UI**: `MatchDetailModal.tsx` maneja el cálculo dinámico del marcador (goles + autogoles del rival) y valida la presencia de imágenes antes del envío.

---

## 3. Integración con la API (Capa Base)

### 3.1 ApiService (`services/api/api.service.ts`)
Es el motor de comunicación del proyecto. No se deben usar `fetch` o `axios` directamente en los componentes.
- `getAsync<T>`: Maneja peticiones GET y tipado automático de respuesta.
- `postAsync<T, D>`: Maneja peticiones POST enviando un body `D`.
- `deleteAsync<T>`: Maneja eliminaciones.

### 3.2 Seguridad y Headers
Se inyectan automáticamente en cada llamada mediante `getAuthHeaders()`:
- `token`: Desde `localStorage`.
- `usuario`: Nombre de usuario activo.
- `version`: Por defecto "3.0".
- `tipo-app`: Identificador "app".

---

## 4. Estado y Sincronización

### 4.1 React Query (TanStack Query)
- **Caching**: Los datos se mantienen frescos mediante `staleTime`.
- **Refetch**: El sistema refresca los datos automáticamente al reenfocar la ventana o recuperar conexión.

### 4.2 Debouncing
Estrategia crítica en `Jugadores.tsx`:
1. El usuario escribe.
2. Un `useEffect` espera 500ms.
3. Se actualiza el `debouncedSearchTerm`.
4. React Query detecta el cambio de parámetro y dispara la petición.

---

## 5. Glosario de Tipos por Archivo
- `api.types.ts`: Estructuras de respuesta genéricas (`ApiResponse`).
- `auth.types.ts`: Modelos de login y credenciales.
- `user.types.ts`: Estructura de la sesión y contexto global.
- `player.types.ts`: Modelos base de jugadores.
- `player-dto.types.ts`: Tipos para envío/recepción de detalles.
- `temporada.types.ts`: Modelos de competición y tablas.

---
*Este manual es la guía definitiva para entender el flujo de datos de EMaster Fuchiboli.*
