/**
 * Types for Tournaments and Season Information
 * Tipos relacionados con torneos e información de temporadas
 * ACTUALIZADO según estructura real de la API
 */

// Torneo
export interface Torneo {
    id: number;
    nombre: string;
    urlImagen?: string;  // La API usa urlImagen, no descripcion
    activo?: boolean;
}

// Tabla de posiciones - Estructura real de la API
export interface EquipoTabla {
    grupo?: string;
    posicion: number;
    idEquipo?: number;
    equipo?: string | { id: number; nombre: string; urlEscudo?: string };  // Puede ser string u objeto
    juegosJugados: number;   // API usa juegosJugados, no pj
    juegosGanados: number;   // API usa juegosGanados, no pg
    juegosEmpatados: number; // API usa juegosEmpatados, no pe
    juegosPerdidos: number;  // API usa juegosPerdidos, no pp
    golesAFavor?: number;    // Goles a favor
    golesEnContra?: number;  // Goles en contra
    diferencia?: number;     // Diferencia de goles
    puntos?: number;         // Puntos
    // Alias por si la API usa nombres alternativos
    pj?: number;
    pg?: number;
    pe?: number;
    pp?: number;
    gf?: number;
    gc?: number;
    dg?: number;
    pts?: number;
}

// Goleadores - La API devuelve jugador y equipo como OBJETOS
export interface JugadorInfo {
    id: number;
    nombre: string;
    urlFoto?: string;
}

export interface EquipoInfo {
    id: number;
    nombre: string;
    urlEscudo?: string;
}

export interface Goleador {
    posicion?: number;
    jugador: JugadorInfo | string;  // Puede ser objeto o string
    equipo: EquipoInfo | string;    // Puede ser objeto o string
    goles: number;
    asistencias?: number;
}

// Mejores equipos - Respuesta de la API
export interface MejorEquipo {
    id: number;
    nombre: string;
    nombreEstadio?: string;
    urlEscudo: string;
    estatus?: boolean;
}

// Respuesta del endpoint obtenerTemporada - Estructura REAL
export interface TemporadaData {
    tabla?: EquipoTabla[];
    goleadores?: Goleador[];
    eliminatoria?: unknown[];
    equipoOfensiva?: MejorEquipo;   // Mejor equipo ofensivo
    equipoDefensiva?: MejorEquipo;  // Mejor equipo defensivo
    [key: string]: unknown;
}
