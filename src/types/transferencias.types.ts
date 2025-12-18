/**
 * Tipos para la sección de Transferencias
 */

/**
 * Tipo de transferencia (Traspaso, Baja, etc.)
 */
export interface TipoTransferencia {
    id: number;
    descripcion: string;
}

/**
 * Datos del jugador en una transferencia
 */
export interface JugadorTransferencia {
    id: number;
    nombre: string;
    apodo: string;
    media: number;
    salario: number;
    potencial: number;
    edad: number;
    urlImagen: string;
    url: string;
    posicion: string | null;
    precio: number;
    fechaNacimiento: string;
}

/**
 * Datos del equipo en una transferencia
 */
export interface EquipoTransferencia {
    id: number;
    nombre: string;
    nombreEstadio: string;
    urlEscudo: string;
    estatus: boolean;
}

/**
 * Transferencia entre equipos
 */
export interface Transferencia {
    id: number;
    idTemporada: number;
    idTipo: number;
    monto: number;
    fecha: string;
    concepto: string;
    descripcionTipo: string;
    jugador: JugadorTransferencia;
    equipoOrigen: EquipoTransferencia;
    equipoDestino: EquipoTransferencia;
}

/**
 * Respuesta paginada de transferencias
 */
export interface TransferenciasResponse {
    datos: Transferencia[];
    total_datos?: number;
    pagina?: number;
    total_paginas?: number;
}

/**
 * Estatus de una oferta de jugador
 * - en_curso: Oferta esperando tiempo para completarse (2 hrs)
 * - completada: Ha concluido el tiempo de espera sin contraoferta
 * - cerrada: El ofertante confirmó la compra
 */
export type EstatusOferta = 'en_curso' | 'completada' | 'cerrada';

/**
 * Datos del jugador en una oferta
 */
export interface JugadorOferta {
    id: number;
    nombre: string;
    apodo: string;
    edad: number;
    urlImagen: string;
    precio: number;
    posicion?: string | null;
}

/**
 * Datos del equipo ofertante
 */
export interface EquipoOfertante {
    id: number;
    nombre: string;
    urlEscudo: string;
}

/**
 * Oferta por un jugador libre
 */
export interface OfertaJugador {
    id: number;
    idTemporada: number;
    jugador: JugadorOferta;
    equipo: EquipoOfertante;
    monto?: number;
    precio?: number; // Alternativo a monto
    fecha: string;
    estatus: number; // 0: en_curso, 1: completada, 2: cerrada
}
