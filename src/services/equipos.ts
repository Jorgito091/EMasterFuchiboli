/**
 * Teams Service
 * Maneja la obtención de equipos y transforma datos del servidor
 */

import { ApiService } from './api/api.service';
import { API_ENDPOINTS } from './api/api.endpoints';
import type { Equipo } from '../types/auth.types';

/**
 * Obtiene todos los equipos con sus presupuestos para una temporada
 * @param idTemporada ID de la temporada (por defecto 6)
 * @returns Lista de equipos con presupuestos
 */
export const getEquipos = async (idTemporada: number = 6): Promise<Equipo[]> => {
    try {
        const endpoint = `${API_ENDPOINTS.TEAMS.GET_PRESUPUESTOS}?idTemporada=${idTemporada}`;
        const equipos = await ApiService.getAsync<Equipo[]>(
            endpoint,
            true
        );
        return equipos;
    } catch (error) {
        console.error('Error al obtener equipos:', error);
        throw new Error('Error al obtener los equipos');
    }
};

/**
 * Obtiene los ingresos y gastos de un equipo en una temporada
 * @param idTemporada ID de la temporada
 * @param idEquipo ID del equipo
 * @returns Array de transacciones (ingresos y gastos)
 */
export const getIngresosGastos = async (
    idTemporada: number,
    idEquipo: number
): Promise<any[]> => {
    try {
        const endpoint = `${API_ENDPOINTS.TEAMS.GET_INGRESOS_GASTOS}?idTemporada=${idTemporada}&idEquipo=${idEquipo}&ingresos=true&gastos=true`;
        const response = await ApiService.getAsync<any[]>(
            endpoint,
            true
        );
        return response;
    } catch (error) {
        console.error('Error al obtener ingresos y gastos:', error);
        throw new Error('Error al obtener los datos financieros');
    }
};

/**
 * Exporta el servicio de equipos
 */
export const TeamsService = {
    getEquipos,
    getIngresosGastos,
};

export default TeamsService;
