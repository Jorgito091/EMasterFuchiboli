

import type { ApiResponse, ApiError, AuthHeaders, BasicHeaders } from '../../types/api.types';

/**
 * Obtiene los headers de autenticación desde localStorage
 */
/**
 * Obtiene los headers de autenticación desde localStorage
 * @throws Error si no hay token y se requiere autenticación
 */
const getAuthHeaders = (): AuthHeaders => {
    // Match original logic: only replace quotes in token
    const token = (localStorage.getItem('token') || '').replace(/"/g, '');
    const usuario = localStorage.getItem('usuario') || '';
    const dispositivo = localStorage.getItem('dispositivo') || 'postman';

    // Match original logic: hardcode version to 3.0
    const version = '3.0';

    if (!token) {
        throw new Error("No authenticated user");
    }

    return {
        'Content-Type': 'application/json',
        token,
        usuario,
        dispositivo,
        version,
        'tipo-app': 'app',
    };
};

/**
 * Obtiene los headers básicos
 */
const getBasicHeaders = (): BasicHeaders => ({
    'Content-Type': 'application/json',
});

/**
 * Maneja errores de la API de forma centralizada
 */
const handleApiError = async (response: Response): Promise<never> => {
    let errorMessage = 'Error en la petición al servidor';

    try {
        const errorData = await response.text();
        errorMessage = errorData || errorMessage;
    } catch {
        // Si no se puede leer el error, usar el mensaje por defecto
    }

    const error: ApiError = {
        message: errorMessage,
        status: response.status,
    };

    throw error;
};

/**
 * Realiza una petición GET
 * @param endpoint - Endpoint de la API
 * @param requiresAuth - Si requiere autenticación (default: false)
 * @returns Promesa con los datos de la respuesta
 */
export const getAsync = async <T>(
    endpoint: string,
    requiresAuth: boolean = false
): Promise<T> => {
    const headers = requiresAuth ? getAuthHeaders() : getBasicHeaders();

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers as HeadersInit,
    });

    const data: ApiResponse<T> = await response.json();

    if (data.estado && data.estado !== 200) {
        const error: ApiError = {
            message: data.mensaje || 'Error en la petición al servidor',
            status: data.estado,
        };
        throw error;
    }

    if (!response.ok && !data.estado) {
        await handleApiError(response);
    }

    return data.datos || (data as unknown as T);
};

/**
 * Realiza una petición POST
 * @param endpoint - Endpoint de la API
 * @param body - Datos a enviar en el body
 * @param requiresAuth - Si requiere autenticación (default: false)
 * @returns Promesa con los datos de la respuesta
 */
export const postAsync = async <T, D = unknown>(
    endpoint: string,
    body: D,
    requiresAuth: boolean = false,
    returnFullResponse: boolean = false
): Promise<T> => {
    const headers = requiresAuth ? getAuthHeaders() : getBasicHeaders();

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers as HeadersInit,
        body: JSON.stringify(body),
    });

    const data: ApiResponse<T> = await response.json();

    // Si el servidor retorna un estado de error en la respuesta JSON
    if (data.estado && data.estado !== 200) {
        const error: ApiError = {
            message: data.mensaje || 'Error en la petición al servidor',
            status: data.estado,
        };
        throw error;
    }

    // Si el HTTP status no es ok pero no tenemos info del servidor
    if (!response.ok && !data.estado) {
        await handleApiError(response);
    }

    if (returnFullResponse) {
        return data as unknown as T;
    }

    return data.datos || (data as unknown as T);
};

/**
 * Exporta el servicio API como objeto
 */
export const ApiService = {
    getAsync,
    postAsync,
};

export default ApiService;
