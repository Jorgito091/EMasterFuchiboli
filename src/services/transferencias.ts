/**
 * Transfers Service
 * Maneja la obtención de transferencias y tipos de transferencia
 */

import { ApiService } from './api/api.service';
import { API_ENDPOINTS } from './api/api.endpoints';
import type { Transferencia, TipoTransferencia, OfertaJugador } from '../types/transferencias.types';

/**
 * Obtiene las transferencias de una temporada con filtros opcionales
 * @param idTemporada ID de la temporada
 * @param idTipo ID del tipo de transferencia (opcional)
 * @param page Página a obtener (default 1)
 * @returns Lista de transferencias
 */
export const getTransferencias = async (
    idTemporada: number,
    idTipo?: number,
    page: number = 1
): Promise<Transferencia[]> => {
    try {
        let endpoint = `${API_ENDPOINTS.TRANSFERS.GET_ALL}?idTemporada=${idTemporada}&page=${page}`;

        if (idTipo !== undefined && idTipo !== null) {
            endpoint += `&idTipo=${idTipo}`;
        }

        const transferencias = await ApiService.getAsync<Transferencia[]>(
            endpoint,
            true
        );
        return transferencias;
    } catch (error) {
        console.error('Error al obtener transferencias:', error);
        throw new Error('Error al obtener las transferencias');
    }
};

/**
 * Obtiene los tipos de transferencia disponibles
 * @returns Lista de tipos de transferencia
 */
export const getTiposTransferencia = async (): Promise<TipoTransferencia[]> => {
    try {
        const tipos = await ApiService.getAsync<TipoTransferencia[]>(
            API_ENDPOINTS.TRANSFERS.GET_TIPOS,
            true
        );
        return tipos;
    } catch (error) {
        console.error('Error al obtener tipos de transferencia:', error);
        throw new Error('Error al obtener los tipos de transferencia');
    }
};

/**
 * Obtiene todas las ofertas de jugadores libres
 * @param idTemporada ID de la temporada
 * @param page Página a obtener (default 1)
 * @returns Lista de ofertas
 */
export const getOfertasJugadores = async (
    idTemporada: number,
    page: number = 1
): Promise<OfertaJugador[]> => {
    try {
        const endpoint = `${API_ENDPOINTS.TRANSFERS.GET_OFERTAS_ALL}?idTemporada=${idTemporada}&page=${page}`;
        const ofertas = await ApiService.getAsync<OfertaJugador[]>(
            endpoint,
            true
        );
        return ofertas;
    } catch (error) {
        console.error('Error al obtener ofertas de jugadores:', error);
        throw new Error('Error al obtener las ofertas de jugadores');
    }
};

/**
 * Obtiene las ofertas de jugadores de un equipo específico
 * @param idTemporada ID de la temporada
 * @param idEquipo ID del equipo
 * @param page Página a obtener (default 1)
 * @returns Lista de ofertas del equipo
 */
export const getOfertasEquipo = async (
    idTemporada: number,
    idEquipo: number,
    page: number = 1
): Promise<OfertaJugador[]> => {
    try {
        const endpoint = `${API_ENDPOINTS.TRANSFERS.GET_OFERTAS_EQUIPO}?idTemporada=${idTemporada}&idEquipo=${idEquipo}&page=${page}`;
        const ofertas = await ApiService.getAsync<OfertaJugador[]>(
            endpoint,
            true
        );
        return ofertas;
    } catch (error) {
        console.error('Error al obtener ofertas del equipo:', error);
        throw new Error('Error al obtener las ofertas del equipo');
    }
};

/**
 * Exporta el servicio de transferencias
 */
export const TransferenciasService = {
    getTransferencias,
    getTiposTransferencia,
    getOfertasJugadores,
    getOfertasEquipo,
};

export default TransferenciasService;
