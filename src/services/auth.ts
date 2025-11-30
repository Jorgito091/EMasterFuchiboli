export interface Equipo {
    id: number;
    nombre: string;
    nombreEstadio: string;
    urlEscudo: string;
    estatus: boolean;
    presupuestoInicial: number;
    presupuestoFinal: number;
    ingresos: number;
    gastos: number;
    totalJugadores: number;
    totalPrecio: number;
    nombreGrupo: string;
    urlEquipo: string | null;
    fechaPublicacion: string;
    publicacionPlantilla: boolean;
    idUsuario: number;
}

export interface Temporada {
    id: number;
    descripcion: string;
    activa: boolean;
    transferenciasActivas: boolean;
    transferenciasLibresActivas: boolean;
    clausulasActivas: boolean;
    bloqueos: boolean;
    publicacionActiva: boolean;
}

export interface Usuario {
    id: number;
    nombreUsuario: string;
    contraseña?: string;
    administrador: boolean;
    token: string;
    equipo: Equipo;
    version: string;
}

export interface LoginRequest {
    usuario: string;
    contraseña: string;
    dispositivo: string;
}

export interface LoginResponse {
    estado: number;
    datos: {
        usuario: Usuario;
        temporada: Temporada;
    };
    total_datos: number;
    mensaje: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch("/api/login/acceder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error("Error en la autenticación");
    }

    return response.json();
};
