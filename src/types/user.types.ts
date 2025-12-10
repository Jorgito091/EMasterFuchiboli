/**
 * User Session Types
 * Tipos para el manejo de sesión de usuario global
 */

/**
 * Información del equipo almacenada en la sesión
 */
export interface EquipoSession {
    /** ID único del equipo */
    id: number;
    /** Nombre del equipo */
    nombre: string;
    /** Nombre del estadio del equipo */
    nombreEstadio: string;
    /** URL del escudo del equipo */
    urlEscudo: string;
    /** Estado activo del equipo */
    estatus: boolean;
}

/**
 * Información esencial del usuario almacenada globalmente
 * Contiene los datos necesarios para autenticación y contexto de la aplicación
 */
export interface UserSession {
    /** ID único del usuario */
    userId: number;
    /** Nombre de usuario para identificación */
    nombreUsuario: string;
    /** Indica si el usuario tiene rol de administrador */
    administrador: boolean;
    /** Token de autenticación para peticiones API */
    token: string;
    /** Información del equipo asignado al usuario */
    equipo: EquipoSession;
    /** ID de la temporada activa */
    temporadaId: number;
    /** Versión de la aplicación del usuario */
    version: string;
}

/**
 * Tipo del contexto de autenticación
 * Define las propiedades y métodos disponibles en el AuthContext
 */
export interface AuthContextType {
    /** Datos de la sesión del usuario, null si no está autenticado */
    user: UserSession | null;
    /** Indica si hay un usuario autenticado */
    isAuthenticated: boolean;
    /** Indica si el usuario actual es administrador */
    isAdmin: boolean;
    /** Función para establecer la sesión del usuario después del login */
    login: (userData: UserSession) => void;
    /** Función para cerrar sesión y limpiar datos */
    logout: () => void;
}
