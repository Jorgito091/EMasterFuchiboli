/**
 * Authentication Context
 * Maneja el estado global de autenticación del usuario
 * Proporciona acceso a datos de usuario desde cualquier componente
 */

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserSession, AuthContextType } from "../types/user.types";

/** Clave para almacenar la sesión en localStorage */
const AUTH_STORAGE_KEY = "auth_session";

/** Contexto de autenticación */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider de autenticación
 * Envuelve la aplicación para proporcionar acceso al estado de autenticación
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    // Lazy initialization: cargar sesión desde localStorage al montar
    const [user, setUser] = useState<UserSession | null>(() => {
        try {
            const stored = localStorage.getItem(AUTH_STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            // Si hay error al parsear, limpiar y retornar null
            localStorage.removeItem(AUTH_STORAGE_KEY);
            return null;
        }
    });

    // Sincronizar con localStorage cuando cambie el usuario
    useEffect(() => {
        if (user) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            // Mantener compatibilidad con el sistema actual de headers
            localStorage.setItem("token", user.token);
            localStorage.setItem("usuario", user.nombreUsuario);
            localStorage.setItem("dispositivo", "postman");
            localStorage.setItem("version", user.version);
        } else {
            // Limpiar toda la información de sesión
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            localStorage.removeItem("dispositivo");
            localStorage.removeItem("version");
        }
    }, [user]);

    /**
     * Establece la sesión del usuario después del login
     * @param userData - Datos de la sesión del usuario
     */
    const login = (userData: UserSession) => {
        setUser(userData);
    };

    /**
     * Cierra la sesión del usuario y limpia todos los datos almacenados
     */
    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isAdmin: user?.administrador ?? false,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook para acceder al contexto de autenticación
 * @returns Objeto con datos de usuario y funciones de autenticación
 * @throws Error si se usa fuera de un AuthProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
