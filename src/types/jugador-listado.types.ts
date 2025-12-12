/**
 * Tipos para el listado de jugadores paginado
 * Endpoint: /api/jugadores/obtener_filtro
 */

/** Tipo para un jugador en el listado disponible */
export interface JugadorListado {
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
    urlEscudo: string;  // Puede ser string vacío si no tiene equipo
    clausulaRecision: boolean;
    bloqueado: boolean;
    edad: number;
    edadPublicacion: number;
}

/** Tipo para la respuesta paginada del endpoint */
export interface JugadoresListResponse {
    estado: number;
    datos: JugadorListado[];
    total_datos: number;
    mensaje: string;
}
