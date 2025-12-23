# Guía de Usuario y Documentación de Desarrollo: EMaster Fuchiboli

Este documento proporciona una visión detallada de cómo utilizar la plataforma y la metodología técnica empleada para su construcción.

---

## 1. Manual de Uso (Guía del Usuario)

### 1.1 Autenticación y Seguridad
- **Acceso**: Inicie sesión con su usuario y contraseña. El sistema utiliza cifrado SHA-256 para proteger sus credenciales antes de enviarlas al servidor.
- **Persistencia**: Una vez conectado, el sistema recordará su sesión. No es necesario re-autenticarse al refrescar la página.

### 1.2 Sección de Temporada (El Tablero de Control)
- **Vista General**: Aquí encontrará la tabla de posiciones oficial. Los colores indican:
  - **Verde**: Zona de clasificación/Champions.
  - **Azul**: Competencia secundaria.
  - **Rojo**: Zona crítica/Descenso.
- **Jornadas**: Utilice los filtros para ver:
  - **Por Jornada**: Todos los partidos de una fecha específica.
  - **Pendientes**: Solo los partidos que SU equipo aún no ha reportado.
  - **Jugados**: El historial de resultados de su equipo.
- **Reporte de Partidos**: 
    - Al hacer clic en un encuentro pendiente, podrá registrar los goles, lesiones y expulsiones de cada jugador.
    - **Registro de Imágenes**: Es obligatorio adjuntar al menos un link de imagen como prueba del resultado.
    - **Autogoles**: Puede sumarlos al marcador; estos no se asignan a un jugador específico en las estadísticas individuales.

### 1.3 Gestión de Equipos y Economía
- **Listado de Equipos**: Permite auditar la salud financiera de todos los clubes.
- **Detalle de Equipo**: 
  - **Plantilla**: Revise medias, potenciales y si un jugador está "bloqueado" (no negociable).
  - **Finanzas**: Desglose exacto de cada ingreso y gasto (premios, fichajes, sanciones).

### 1.4 Mercado de Jugadores
- **Buscador Inteligente**: Busque por nombre o posición. El sistema espera a que termine de escribir (500ms) para lanzar la búsqueda automáticamente, optimizando el rendimiento.
- **Ficha Técnica**: Haga clic en cualquier jugador para ver su perfil completo, incluyendo su club actual y valor de cláusula.

---

## 2. Documentación de Implementación (Cómo se hizo)

### 2.1 Filosofía de Desarrollo
La aplicación fue construida bajo un esquema de **Arquitectura de Capas**, separando estrictamente la interfaz de la lógica de datos.

### 2.2 Stack Tecnológico
- **Core**: React 18 con TypeScript para garantizar robustez y evitar errores de tipado en producción.
- **Estilos**: Tailwind CSS con un sistema de diseño "Glassmorphism" y modo oscuro dinámico.
- **Gestión de Estado**: React Query para el manejo de caché asíncrono, asegurando que los datos estén siempre actualizados sin recargas innecesarias.
- **Iconografía**: Lucide React para una interfaz limpia y moderna.

### 2.3 Capa de Comunicación (Servicios)
Se implementó un `ApiService` centralizado que actúa como único punto de salida para las peticiones:
1.  **Seguridad**: Inyecta automáticamente los tokens y headers de seguridad en cada llamada.
2.  **Validación**: Procesa las respuestas del servidor y gestiona errores de red de forma global.
3.  **Endpoint Mapping**: Utiliza un objeto estático (`API_ENDPOINTS`) para facilitar el mantenimiento si las rutas del servidor cambian.

### 2.4 Optimización de Interfaz
- **Debounced Search**: Se implementó una lógica de retraso en las busquedas para no saturar el servidor.
- **Lazy Loading**: Los componentes y datos se cargan bajo demanda para mejorar la velocidad inicial de carga.
- **Responsive Design**: La interfaz se adapta automáticamente a pantallas de escritorio y portátiles.

---
*Este manual sirve como documento maestro tanto para administradores como para el equipo técnico de EMaster Fuchiboli.*
