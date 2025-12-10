/**
 * API Endpoints Configuration
 * Define todas las rutas de los endpoints del backend
 * Centraliza las URLs para facilitar mantenimiento y evitar strings duplicados
 */

export const API_ENDPOINTS = {
    /**
     * Endpoints de autenticación
     */
    AUTH: {
        /** POST - Iniciar sesión con usuario y contraseña */
        LOGIN: '/api/login/acceder',
    },

    /**
     * Endpoints de equipos
     */
    TEAMS: {
        /** GET - Obtener equipos con sus presupuestos por temporada */
        GET_PRESUPUESTOS: '/api/equipos/obtenerpresupuestos',
    },

    /**
     * Endpoints de temporadas
     */
    SEASONS: {
        /** GET - Obtener la temporada activa actual */
        GET_ACTIVE: '/api/temporadas/activa',
        /** GET - Obtener todas las temporadas (requiere auth) */
        GET_ALL: '/api/temporadas/obtener',
        /** GET - Obtener lista de temporadas con total_datos (público) */
        GET_LIST: '/api/temporadas',
        /** GET - Obtener lista de torneos disponibles */
        GET_TORNEOS: '/api/temporadas/ObtenerTorneos',
        /** GET - Obtener datos completos de una temporada/torneo */
        GET_TEMPORADA: '/api/temporadas/obtenerTemporada',
        /** GET - Obtener mejor equipo de la temporada */
        GET_MEJOR_EQUIPO: '/api/temporadas/obtenerMejorEquipo',
    },

    /**
     * Endpoints de jugadores
     */
    PLAYERS: {
        /** GET - Obtener jugadores por temporada y equipo */
        GET_ALL: '/api/jugadores/obtener',
    },

    /**
     * Endpoints de transferencias
     */
    TRANSFERS: {
        /** GET - Obtener historial de transferencias */
        GET_ALL: '/api/transferencias/obtener',
        /** POST - Crear una nueva transferencia */
        CREATE: '/api/transferencias/crear',
    },

    /**
     * Endpoints de noticias
     */
    NEWS: {
        /** GET - Obtener todas las noticias */
        GET_ALL: '/api/noticias/obtener',
    },
} as const;

