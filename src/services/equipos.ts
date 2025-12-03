/**
 * Teams Service
 * Maneja la obtención de equipos y transforma datos del servidor
 */

import { ApiService } from './api/api.service';
import { API_ENDPOINTS } from './api/api.endpoints';
import type { Equipo } from '../types/auth.types';

/**
 * Obtiene todos los equipos
 * @returns Lista de equipos
 */
export const getEquipos = async (): Promise<Equipo[]> => {
    try {
        const equipos = await ApiService.getAsync<Equipo[]>(
            API_ENDPOINTS.TEAMS.GET_ALL,
            true // Requiere autenticación
        );

        return equipos;
    } catch (error) {
        console.error('Error al obtener equipos:', error);
        throw new Error('Error al obtener los equipos');
    }
};

/**
 * Exporta el servicio de equipos
 */
export const TeamsService = {
    getEquipos,
};

export default TeamsService;
