/**
 * Temporadas Service
 * Maneja las operaciones relacionadas con temporadas y torneos
 */

import { ApiService } from './api/api.service';
import { API_ENDPOINTS } from './api/api.endpoints';
import type {
    Torneo,
    TemporadaData,
} from '../types/temporada.types';
import type { Temporada } from '../types/auth.types';

/** Respuesta del endpoint de temporadas que incluye total_datos */
interface TemporadasResponse {
    estado: number;
    datos: Temporada[];
    total_datos: number;
    mensaje: string;
}

/**
 * Obtiene el total de temporadas disponibles
 * Este endpoint es público y no requiere autenticación
 * @returns Número total de temporadas
 */
export const getTotalTemporadas = async (): Promise<number> => {
    try {
        const response = await fetch(API_ENDPOINTS.SEASONS.GET_LIST);

        if (!response.ok) {
            console.error('Error al obtener temporadas:', response.status);
            return 13; // Fallback
        }

        const data: TemporadasResponse = await response.json();
        console.log('Total temporadas:', data.total_datos);
        return data.total_datos;
    } catch (error) {
        console.error('Error en getTotalTemporadas:', error);
        return 13; // Fallback si hay error
    }
};

/**
 * Obtiene la lista de torneos disponibles
 * @returns Lista de torneos
 */
export const getTorneos = async (): Promise<Torneo[]> => {
    return ApiService.getAsync<Torneo[]>(
        API_ENDPOINTS.SEASONS.GET_TORNEOS,
        true // Requiere autenticación
    );
};

/**
 * Obtiene la información completa de una temporada/torneo
 * Incluye: tabla de posiciones, goleadores, eliminatoria, equipoOfensiva, equipoDefensiva
 * @param idTemporada - ID de la temporada
 * @param idTorneo - ID del torneo
 * @returns Datos de la temporada
 */
export const getTemporadaData = async (idTemporada: number, idTorneo: number): Promise<TemporadaData> => {
    return ApiService.getAsync<TemporadaData>(
        `${API_ENDPOINTS.SEASONS.GET_TEMPORADA}?idTemporada=${idTemporada}&idTorneo=${idTorneo}`,
        true
    );
};

/**
 * Exporta el servicio de temporadas
 */
export const TemporadasService = {
    getTotalTemporadas,
    getTorneos,
    getTemporadaData,
};

export default TemporadasService;

