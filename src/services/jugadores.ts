import { ApiService } from './api/api.service';
import { API_ENDPOINTS } from './api/api.endpoints';
import type { Jugador } from '../types/player.types';
import type { JugadorDTO, JugadorDetalleResponse } from '../types/player-dto.types';
import type { JugadoresListResponse } from '../types/jugador-listado.types';

/**
 * Obtiene listado de jugadores disponibles con paginación
 * @param pagina Número de página (default: 1)
 * @returns Respuesta paginada con jugadores
 */
export const getJugadoresDisponibles = async (
    pagina: number = 1
): Promise<JugadoresListResponse> => {
    try {
        const endpoint = `${API_ENDPOINTS.PLAYERS.GET_AVAILABLE}?pagina=${pagina}`;

        // Obtener headers de autenticación
        const token = (localStorage.getItem('token') || '').replace(/"/g, '');
        const usuario = localStorage.getItem('usuario') || '';
        const dispositivo = localStorage.getItem('dispositivo') || 'postman';
        const version = '3.0';

        if (!token) {
            throw new Error("No authenticated user");
        }

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token,
                usuario,
                dispositivo,
                version,
                'tipo-app': 'app',
            },
        });

        const data: JugadoresListResponse = await response.json();

        if (data.estado && data.estado !== 200) {
            throw new Error(data.mensaje || 'Error al obtener jugadores');
        }

        return data;  // Retorna respuesta completa con total_datos
    } catch (error) {
        console.error('Error al obtener jugadores disponibles:', error);
        throw new Error('Error al obtener jugadores disponibles');
    }
};

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
    getJugadoresDisponibles,
    getJugadoresByEquipo,
    getJugadorDetalle,
    saveJugador,
};

export default PlayersService;
