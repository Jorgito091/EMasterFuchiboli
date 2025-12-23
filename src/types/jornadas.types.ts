export interface EquipoEncuentro {
    id: number;
    nombre: string;
    urlEscudo: string;
}

export interface Jornada {
    id: number;
    numero: number;
    descripcion: string;
    activa: boolean;
    cerrada: boolean;
    eliminatoria: boolean;
    idTemporada: number;
    idTorneo: number;
}

export interface UsuarioPublicacion {
    id: number;
    nombreUsuario: string;
}

export interface Encuentro {
    id: number;
    marcadorLocal: number;
    marcadorVisita: number;
    completado: boolean;
    cerrado: boolean;
    fechaPublicacion: string;
    equipoLocal: EquipoEncuentro;
    equipoVisita: EquipoEncuentro;
    jornada: Jornada;
    usuarioPublicacion: UsuarioPublicacion;
}

// Estadísticas de Jugador para obtención
export interface EstadisticaJugadorGetDto {
    idJugador: number;
    nombreJugador: string;
    cantidadGoles: number;
    cantidadExpulsion: number;
    cantidadLesion: number;
    expulsion: boolean;
    expulsionDirecta: boolean;
    lesion: boolean;
}

// Estadísticas de Jugador para guardado
export interface EstadisticaJugadorSaveDto {
    idJugador: number;
    cantidadGoles: number;
    expulsion: boolean;
    expulsionDirecta: boolean;
    lesion: boolean;
}

// Estructura de guardado (PrmEncuentroEstadisticas)
export interface PrmEncuentroEstadisticas {
    idEncuentro: number;
    marcadorLocal: number;
    marcadorVisita: number;
    lstEstadisticasLocal?: EstadisticaJugadorSaveDto[];
    lstEstadisticasVisita?: EstadisticaJugadorSaveDto[];
    lstUrlImagenes: string[];
}

// Respuesta completa de información de encuentro
export interface EncuentroInformacionResponse {
    encuentro: Encuentro;
    lstEstadisticasLocal: EstadisticaJugadorGetDto[];
    lstEstadisticasVisita: EstadisticaJugadorGetDto[];
    lstSuspensionesLocal: any[]; // Definir si es necesario detalle
    lstSuspensionesVisita: any[];
}

