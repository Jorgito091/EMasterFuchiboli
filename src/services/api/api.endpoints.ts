

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/api/login/acceder',
    },

    // Teams
    TEAMS: {
        GET_PRESUPUESTOS: '/api/equipos/obtenerpresupuestos',
        GET_INGRESOS_GASTOS: '/api/equipos/obtenerIngresosGastos',
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
        SAVE_PLAYER: '/api/jugadores/guardar',
        GET_PLAYER_DETAIL: '/api/jugadores/obtener', // Same endpoint but uses query param idJugador
        GET_AVAILABLE: '/api/jugadores/obtener_filtro', // Paginated player listing
    },

    // Transfers
    TRANSFERS: {
        GET_ALL: '/api/transferencias',
        GET_TIPOS: '/api/transferencias/obtenertipos',
        GET_OFERTAS_ALL: '/api/transferencias/obtenerjugadoresofertados',
        GET_OFERTAS_EQUIPO: '/api/transferencias/obtenerjugadoresofertados', // Same endpoint, filtered by idEquipo
    },

    // News
    NEWS: {
        GET_ALL: '/api/noticias', // params: page
        SAVE: '/api/noticias',
    },

    // Jornadas
    JORNADAS: {
        GET_JORNADAS: '/api/jornadas/obtener_jornadas', // params: idTemporada, idTorneo
        GET_ENCUENTROS: '/api/jornadas/obtener_encuentros', // params: idJornada
        GET_PENDIENTES: '/api/jornadas/obtener_encuentros_pendientes', // params: idTemporada, idTorneo, idEquipo
        GET_JUGADOS: '/api/jornadas/obtener_encuentros_jugados', // params: idTemporada, idTorneo, idEquipo
    },
} as const;
