/**
 * Players Service
 * Maneja la obtención de jugadores
 */

import { ApiService } from './api/api.service';
import { API_ENDPOINTS } from './api/api.endpoints';
import type { Jugador } from '../types/player.types';

/**
 * Obtiene todos los jugadores de un equipo en una temporada
 * @param idTemporada ID de la temporada
 * @param idEquipo ID del equipo
 * @returns Lista de jugadores
 */
export const getJugadoresByEquipo = async (
    idTemporada: number,
    idEquipo: number
): Promise<Jugador[]> => {
    try {
        const endpoint = `${API_ENDPOINTS.PLAYERS.GET_ALL}?idTemporada=${idTemporada}&idEquipo=${idEquipo}`;
        const jugadores = await ApiService.getAsync<Jugador[]>(
            endpoint,
            true
        );
        return jugadores;
    } catch (error) {
        console.error('Error al obtener jugadores:', error);
        throw new Error('Error al obtener los jugadores');
    }
};

/**
 * Exporta el servicio de jugadores
 */
export const PlayersService = {
    getJugadoresByEquipo,
};

export default PlayersService;
