import { ApiService } from './api/api.service';
import { API_ENDPOINTS } from './api/api.endpoints';
import type { Jugador } from '../types/player.types';
import type { JugadorDTO, JugadorDetalleResponse } from '../types/player-dto.types';

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
 * Obtiene el detalle de un jugador por su ID
 * @param idJugador ID del jugador
 * @returns Detalle completo del jugador
 */
export const getJugadorDetalle = async (
    idJugador: number
): Promise<JugadorDetalleResponse> => {
    try {
        const endpoint = `${API_ENDPOINTS.PLAYERS.GET_PLAYER_DETAIL}?idJugador=${idJugador}`;
        const jugador = await ApiService.getAsync<JugadorDetalleResponse>(
            endpoint,
            true
        );
        return jugador;
    } catch (error) {
        console.error('Error al obtener detalle del jugador:', error);
        throw new Error('Error al obtener el detalle del jugador');
    }
};

/**
 * Guarda o actualiza un jugador
 * @param jugador Datos del jugador (DTO)
 * @returns Respuesta del servidor
 */
export const saveJugador = async (
    jugador: JugadorDTO
): Promise<void> => {
    try {
        await ApiService.postAsync<void, JugadorDTO>(
            API_ENDPOINTS.PLAYERS.SAVE_PLAYER,
            jugador,
            true
        );
    } catch (error) {
        console.error('Error al guardar jugador:', error);
        throw new Error('Error al guardar el jugador');
    }
};

/**
 * Exporta el servicio de jugadores
 */
export const PlayersService = {
    getJugadoresByEquipo,
    getJugadorDetalle,
    saveJugador,
};

export default PlayersService;
