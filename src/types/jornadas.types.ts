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
