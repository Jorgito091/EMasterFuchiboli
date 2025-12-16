import { ApiService } from './api/api.service';
import { API_ENDPOINTS } from './api/api.endpoints';
import type { Jornada, Encuentro } from '../types/jornadas.types';

export const getJornadas = async (idTemporada: number, idTorneo: number): Promise<Jornada[]> => {
    try {
        const endpoint = `${API_ENDPOINTS.JORNADAS.GET_JORNADAS}?idTemporada=${idTemporada}&idTorneo=${idTorneo}`;
        const response = await ApiService.getAsync<Jornada[]>(endpoint, true);
        return response;
    } catch (error) {
        console.error('Error fetching jornadas:', error);
        throw error;
    }
};

export const getEncuentros = async (idJornada: number): Promise<Encuentro[]> => {
    try {
        const endpoint = `${API_ENDPOINTS.JORNADAS.GET_ENCUENTROS}?idJornada=${idJornada}`;
        const response = await ApiService.getAsync<Encuentro[]>(endpoint, true);
        return response;
    } catch (error) {
        console.error('Error fetching encuentros:', error);
        throw error;
    }
};

export const getPendientes = async (idTemporada: number, idTorneo: number, idEquipo: number): Promise<Encuentro[]> => {
    try {
        const endpoint = `${API_ENDPOINTS.JORNADAS.GET_PENDIENTES}?idTemporada=${idTemporada}&idTorneo=${idTorneo}&idEquipo=${idEquipo}`;
        const response = await ApiService.getAsync<Encuentro[]>(endpoint, true);
        return response;
    } catch (error) {
        console.error('Error fetching encuentros pendientes:', error);
        throw error;
    }
};

export const getJugados = async (idTemporada: number, idTorneo: number, idEquipo: number): Promise<Encuentro[]> => {
    try {
        const endpoint = `${API_ENDPOINTS.JORNADAS.GET_JUGADOS}?idTemporada=${idTemporada}&idTorneo=${idTorneo}&idEquipo=${idEquipo}`;
        const response = await ApiService.getAsync<Encuentro[]>(endpoint, true);
        return response;
    } catch (error) {
        console.error('Error fetching encuentros jugados:', error);
        throw error;
    }
};

export const JornadasService = {
    getJornadas,
    getEncuentros,
    getPendientes,
    getJugados,
};

export default JornadasService;
