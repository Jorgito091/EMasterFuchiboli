export interface UsuarioDTO {
    id: number;
    nombreUsuario: string;
}

export interface NoticiaDTO {
    id: number;
    titulo: string;
    texto: string;
    urlImagen: string;
    fechaPublicacion: string; // ISO DateTime string
    usuario: UsuarioDTO;
}

export interface CreateNoticiaDTO {
    titulo: string;
    texto: string;
    urlImagen: string;
    usuario: { id: number };
}
