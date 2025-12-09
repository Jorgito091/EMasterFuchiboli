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
    getTorneos,
    getTemporadaData,
};

export default TemporadasService;
