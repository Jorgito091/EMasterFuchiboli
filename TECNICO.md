# Documentación Técnica Detallada: EMaster Fuchiboli

Esta guía profundiza en la interconexión entre la capa de datos (Types), la lógica de comunicación (API/Services) y la interfaz de usuario (Pages).

---

## 1. Mapeo de Tipos de Datos (Data Layer)

El proyecto utiliza TypeScript de forma estricta para garantizar que la información que viaja desde el servidor sea procesada correctamente por la UI.

### 1.1 Estructuras Base de API (`api.types.ts`)
| Tipo | Propósito | Conexión API |
| :--- | :--- | :--- |
| `ApiResponse<T>` | Envuelve todas las respuestas exitosas. | Todas las peticiones `GET`/`POST`. |
| `ApiError` | Estructura para capturar fallos de red o lógica del servidor. | Bloques `catch` en servicios. |
| `AuthHeaders` | Define las cabeceras obligatorias para el backend. | `token`, `usuario`, `dispositivo`, `version`. |

### 1.2 Modelos de Autenticación y Sesión (`auth.types.ts`, `user.types.ts`)
| Tipo | Descripción | Uso en Pages |
| :--- | :--- | :--- |
| `Usuario` | Perfil completo retornado tras login. | `Login.tsx` (procesamiento inicial). |
| `UserSession` | Versión optimizada guardada en `AuthContext`. | Toda la App vía `useAuth`. |
| `Equipo` | Modelo de datos de un club profesional. | `Equipos.tsx`, `EquipoDetalle.tsx`. |

### 1.3 Lógica de Jugadores y Mercado (`player-dto.types.ts`, `jugador-listado.types.ts`)
| Tipo | Campos Clave | Contexto |
| :--- | :--- | :--- |
| `JugadorDTO` | `media`, `potencial`, `precio`, `salario`. | Creación/Edición de jugadores. |
| `JugadorListado` | `nombreEquipo`, `urlEscudo`, `edad`. | Buscador en `Jugadores.tsx`. |
| `JugadorDetalle` | `precioClausula`, `bloqueado`, `idEquipo`. | Modal de perfil y `EquipoDetalle.tsx`. |

---

## 2. Conexión Endpoints -> Servicios -> Types

A continuación se detalla cómo se conectan los puntos de acceso del backend con la lógica de frontend.

### 2.1 Módulo de Temporadas y Torneos
*   **Endpoint**: `SEASONS.GET_TEMPORADA` (`/api/temporadas/obtenerTemporada`)
*   **Servicio**: `getTemporadaData(idTemp, idTorneo)`
*   **Type Retornado**: `TemporadaData`
*   **Estructura Interna**: 
    - `tabla`: Array de `EquipoTabla` (posiciones, PJ, PG, pts).
    - `goleadores`: Array de `Goleador` (objetos `JugadorInfo` y `EquipoInfo`).
*   **Consumo**: `Temporada.tsx`.

### 2.2 Módulo de Jornadas y Encuentros
*   **Endpoints**: `JORNADAS.GET_ENCUENTROS`, `GET_PENDIENTES`, `GET_JUGADOS`.
*   **Servicio**: `JornadasService`
*   **Type Retornado**: `Encuentro[]`
*   **Campos de Encuentro**: Vincula `equipoLocal` y `equipoVisita` (de tipo `EquipoEncuentro`) con el `marcadorLocal/Visita`.
*   **Consumo**: Modo 'Jornadas' en `Temporada.tsx`.

---

## 3. Flujo de Datos Extremo a Extremo (E2E)

Ejemplo del flujo al buscar un jugador:

1.  **UI (`Jugadores.tsx`)**: El usuario escribe "Messi". El estado `searchTerm` cambia. Un `useEffect` espera 500ms (debounce) y actualiza `debouncedSearchTerm`.
2.  **Query (`React Query`)**: Se dispara `getJugadoresDisponibles(pagina, busqueda)`.
3.  **Service (`jugadores.ts`)**: Construye la URL usando `API_ENDPOINTS.PLAYERS.GET_AVAILABLE` y añade el parámetro `&busqueda=Messi`.
4.  **API Layer (`api.service.ts`)**: Ejecuta `fetch`. Extrae el `token` de `localStorage` de forma automática para las cabeceras.
5.  **Server Response**: Retorna un JSON que el `ApiService` valida (debe ser estado 200).
6.  **Casting**: Los datos se mapean al tipo `JugadoresListResponse`.
7.  **Finalización**: React Query guarda en caché los resultados y la tabla se renderiza usando los campos del tipo `JugadorListado`.

---

## 4. Matriz de Consumo por Pantalla (Resumen)

| Pantalla | Servicios Consumidos | Tipos Principales Utilizados |
| :--- | :--- | :--- |
| **Login** | `AuthService` | `LoginRequest`, `LoginResponse`, `UserSession`. |
| **Temporada** | `TemporadasService`, `JornadasService` | `TemporadaData`, `Encuentro`, `Torneo`. |
| **Equipos** | `TeamsService` | `Equipo`. |
| **EquipoDetalle** | `JugadoresService`, `TeamsService` | `Jugador`, `JugadorDetalle`, `Transaccion`. |
| **Jugadores** | `JugadoresService` | `JugadorListado`, `JugadoresListResponse`. |
| **Transferencias**| `ApiService` (directo) | `Transferencia` (estático/API). |
| **Noticias** | `NoticiasService` | `NoticiaDTO`, `CreateNoticiaDTO`. |

---

## 5. Decisiones de Diseño "Por Qué" (Técnico)

1.  **Por qué interfaces duplicadas (`JugadorDTO` vs `JugadorListado`)?**
    - El backend envía información distinta según el contexto. En el listado global se requiere información del equipo actual (`nombreEquipo`), mientras que para guardar un jugador solo se requiere el perfil base.
2.  **Por qué `ApiService` no es un Hook?**
    - Para que pueda ser utilizado en cualquier lugar (servicios, utilidades, componentes de clase si los hubiera) sin las restricciones de los ciclos de vida de React.
3.  **Por qué `UserSession` en lugar de guardar todo el objeto de la API?**
    - Para minimizar el uso de memoria en `localStorage` y facilitar el acceso a datos que se usan en CADA sección (como `temporadaId`).

---
*Este documento es la fuente de verdad técnica para la arquitectura de EMaster Fuchiboli.*
