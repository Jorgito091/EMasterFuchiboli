import { ApiService } from './api/api.service';
import { API_ENDPOINTS } from './api/api.endpoints';
import type { Jugador } from '../types/player.types';
import type { JugadorDTO, JugadorDetalleResponse } from '../types/player-dto.types';
import type { JugadoresListResponse } from '../types/jugador-listado.types';

/**
 * Obtiene listado de jugadores disponibles con paginación y búsqueda
 * @param pagina Número de página (default: 1)
 * @param busqueda Término de búsqueda opcional (id, nombre, apodo o posición)
 * @returns Respuesta paginada con jugadores
 */
export const getJugadoresDisponibles = async (
    pagina: number = 1,
    busqueda?: string
): Promise<JugadoresListResponse> => {
    try {
        // Construir URL con parámetros
        let endpoint = `${API_ENDPOINTS.PLAYERS.GET_AVAILABLE}?pagina=${pagina}`;
        if (busqueda && busqueda.trim() !== '') {
            endpoint += `&busqueda=${encodeURIComponent(busqueda.trim())}`;
        }

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
            if (data.mensaje?.toLowerCase().includes('no se encontraron') ||
                data.mensaje?.toLowerCase().includes('no hay')) {
                return {
                    estado: 200,
                    datos: [],
                    total_datos: 0,
                    mensaje: data.mensaje
                };
            }
            throw new Error(data.mensaje || 'Error al obtener jugadores');
        }

        return data;
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
