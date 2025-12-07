/**
 * Player Types
 * Tipos relacionados con jugadores y transacciones
 */

export interface Jugador {
    id: number;
    nombre: string;
    media: number;
    potencial: number;
    edad: number;
    precio: number;
    posicion: string;
    bloqueado: boolean;
    idEquipo: number;
    idTemporada: number;
}

export interface Transaccion {
    id: number;
    tipo: 'ingreso' | 'gasto';
    concepto: string;
    monto: number;
    fecha?: string;
    idEquipo: number;
    idTemporada: number;
}

export interface EstadoFinanciero {
    presupuestoInicial: number;
    presupuestoFinal: number;
    totalIngresos: number;
    totalGastos: number;
    transacciones: Transaccion[];
}
