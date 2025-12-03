/**
 * Authentication Service
 * Maneja la autenticación de usuarios y transforma datos del servidor
 */

import { ApiService } from './api/api.service';
import { API_ENDPOINTS } from './api/api.endpoints';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

/**
 * Realiza el login de un usuario
 * @param credentials - Credenciales del usuario (usuario, contraseña, dispositivo)
 * @returns Datos del usuario y temporada activa
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await ApiService.postAsync<LoginResponse, LoginRequest>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials,
            false, // No requiere autenticación previa
            true   // Retornar respuesta completa
        );

        return response;
    } catch (error) {
        console.error('Error en login:', error);
        throw new Error('Error en la autenticación');
    }
};

/**
 * Exporta el servicio de autenticación
 */
export const AuthService = {
    login,
};

export default AuthService;
