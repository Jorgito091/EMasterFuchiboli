

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/api/login/acceder',
    },

    // Teams
    TEAMS: {
        GET_PRESUPUESTOS: '/api/equipos/obtenerpresupuestos',
    },

    // Seasons
    SEASONS: {
        GET_ACTIVE: '/api/temporadas/activa',
        GET_ALL: '/api/temporadas/obtener',
        GET_TORNEOS: '/api/temporadas/ObtenerTorneos',
        GET_TEMPORADA: '/api/temporadas/obtenerTemporada',
        GET_MEJOR_EQUIPO: '/api/temporadas/obtenerMejorEquipo',
    },

    // Players
    PLAYERS: {
        GET_ALL: '/api/jugadores/obtener',
    },

    // Transfers
    TRANSFERS: {
        GET_ALL: '/api/transferencias/obtener',
        CREATE: '/api/transferencias/crear',
    },

    // News
    NEWS: {
        GET_ALL: '/api/noticias/obtener',
    },
} as const;
