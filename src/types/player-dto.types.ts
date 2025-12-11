/**
 * Player Data Transfer Objects
 * Tipos para la transferencia de datos de jugadores con el backend
 */

export interface JugadorDTO {
    id: number;
    nombre: string;
    apodo: string;
    media: number;
    salario: number;
    potencial: number;
    edad: number;
    urlImagen: string;
    url: string;
    posicion: string;
    precio: number;
    fechaNacimiento?: string | null;
}

export interface JugadorDetalle extends JugadorDTO {
    // Campos adicionales en la respuesta de detalle
    mediaPublicacion: number;
    potencialPublicacion: number;
    precioClausula: number;
    precioPublicacion: number;
    idEquipo: number;
    nombreEquipo: number | string; // API returns string in example, but keeping flexible
    urlEscudo: string;
    clausulaRecision: boolean;
    bloqueado: boolean;
    edadPublicacion: number;
}

export interface JugadorDetalleResponse {
    id: number;
    nombre: string;
    apodo: string;
    fechaNacimiento: string;
    posicion: string;
    media: number;
    mediaPublicacion: number;
    potencial: number;
    potencialPublicacion: number;
    precio: number;
    precioClausula: number;
    salario: number;
    precioPublicacion: number;
    urlImagen: string;
    url: string;
    idEquipo: number;
    nombreEquipo: string;
    urlEscudo: string;
    clausulaRecision: boolean;
    bloqueado: boolean;
    edad: number;
    edadPublicacion: number;
}
