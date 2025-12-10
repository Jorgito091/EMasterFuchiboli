/**
 * Financial Types
 * Tipos relacionados con ingresos y gastos de equipos
 */

export interface Transaccion {
    id: number;
    idTemporada: number;
    idTransferencia: number;
    idEquipo: number;
    concepto: string;
    monto: number;
    ingreso: boolean;
    gasto: boolean;
    destinoLiga: boolean;
    sancion: boolean;
}

export interface IngresosGastosResponse {
    estado: number;
    datos: Transaccion[];
    total_datos: number;
    mensaje: string;
}
