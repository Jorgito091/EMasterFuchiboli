/**
 * API Response Types
 * Tipos genéricos para las respuestas del servidor
 */

/**
 * Estructura estándar de respuesta del servidor
 */
export interface ApiResponse<T> {
    estado: number;
    datos: T;
    total_datos: number;
    mensaje: string;
}

/**
 * Estructura de error de la API
 */
export interface ApiError {
    message: string;
    status?: number;
    originalError?: unknown;
}

/**
 * Configuración de headers para peticiones autenticadas
 */
export interface AuthHeaders {
    'Content-Type': string;
    token: string;
    usuario: string;
    dispositivo: string;
    version: string;
    'tipo-app': string;
    [key: string]: string;
}

/**
 * Configuración básica de headers
 */
export interface BasicHeaders {
    'Content-Type': string;
    [key: string]: string;
}
