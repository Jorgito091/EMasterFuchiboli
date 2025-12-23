import { ApiService } from './api/api.service';
import { API_ENDPOINTS } from './api/api.endpoints';
import type {
    Jornada,
    Encuentro,
    EncuentroInformacionResponse,
    PrmEncuentroEstadisticas
} from '../types/jornadas.types';

export const getJornadas = async (idTemporada: number, idTorneo: number): Promise<Jornada[]> => {
    try {
        const endpoint = `${API_ENDPOINTS.JORNADAS.GET_JORNADAS}?idTemporada=${idTemporada}&idTorneo=${idTorneo}&IdTemporada=${idTemporada}&IdTorneo=${idTorneo}`;
        const response = await ApiService.getAsync<Jornada[]>(endpoint, true);
        return response;
    } catch (error: any) {
        console.error('Error fetching jornadas:', error);
        if (error.message) console.log('Error message from server:', error.message);
        throw error;
    }
};

export const getEncuentros = async (idJornada: number): Promise<Encuentro[]> => {
    try {
        const endpoint = `${API_ENDPOINTS.JORNADAS.GET_ENCUENTROS}?idJornada=${idJornada}&IdJornada=${idJornada}`;
        const response = await ApiService.getAsync<Encuentro[]>(endpoint, true);
        return response;
    } catch (error) {
        console.error('Error fetching encuentros:', error);
        throw error;
    }
};

export const getPendientes = async (idTemporada: number, idTorneo: number, idEquipo: number): Promise<Encuentro[]> => {
    try {
        const endpoint = `${API_ENDPOINTS.JORNADAS.GET_PENDIENTES}?idTemporada=${idTemporada}&idTorneo=${idTorneo}&idEquipo=${idEquipo}&IdTemporada=${idTemporada}&IdTorneo=${idTorneo}&IdEquipo=${idEquipo}`;
        const response = await ApiService.getAsync<Encuentro[]>(endpoint, true);
        return response;
    } catch (error) {
        console.error('Error fetching encuentros pendientes:', error);
        throw error;
    }
};

export const getJugados = async (idTemporada: number, idTorneo: number, idEquipo: number): Promise<Encuentro[]> => {
    try {
        const endpoint = `${API_ENDPOINTS.JORNADAS.GET_JUGADOS}?idTemporada=${idTemporada}&idTorneo=${idTorneo}&idEquipo=${idEquipo}&IdTemporada=${idTemporada}&IdTorneo=${idTorneo}&IdEquipo=${idEquipo}`;
        const response = await ApiService.getAsync<Encuentro[]>(endpoint, true);
        return response;
    } catch (error) {
        console.error('Error fetching encuentros jugados:', error);
        throw error;
    }
};

/**
 * Obtiene la información detallada de un encuentro (estadísticas, jugadores, suspensiones)
 * @param idEncuentro ID del encuentro
 * @returns Detalle del encuentro
 */
export const getInformacionEncuentro = async (idEncuentro: number): Promise<EncuentroInformacionResponse> => {
    try {
        const endpoint = `${API_ENDPOINTS.JORNADAS.GET_INFO_ENCUENTRO}?idEncuentro=${idEncuentro}&IdEncuentro=${idEncuentro}`;
        const response = await ApiService.getAsync<EncuentroInformacionResponse>(endpoint, true);
        return response;
    } catch (error: any) {
        console.error('Error fetching encuentro info:', error);
        throw error;
    }
};

/**
 * Guarda las estadísticas y resultado de un encuentro
 * @param datos Objeto con marcador, estadísticas de jugadores e imágenes
 */
export const guardarEncuentro = async (datos: PrmEncuentroEstadisticas): Promise<void> => {
    try {
        await ApiService.postAsync<void, PrmEncuentroEstadisticas>(
            API_ENDPOINTS.JORNADAS.SAVE_ENCUENTRO,
            datos,
            true
        );
    } catch (error) {
        console.error('Error saving encuentro:', error);
        throw error;
    }
};

export const JornadasService = {
    getJornadas,
    getEncuentros,
    getPendientes,
    getJugados,
    getInformacionEncuentro,
    guardarEncuentro,
};

export default JornadasService;
