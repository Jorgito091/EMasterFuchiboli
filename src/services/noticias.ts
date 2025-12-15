import { ApiService } from './api/api.service';
import { API_ENDPOINTS } from './api/api.endpoints';
import type { NoticiaDTO, CreateNoticiaDTO } from '../types/noticias.types';

export const getNoticias = async (page: number = 1): Promise<NoticiaDTO[]> => {
    try {
        // Param "page" is standard convention if "Página" failed
        const endpoint = `${API_ENDPOINTS.NEWS.GET_ALL}?page=${page}`;
        const response = await ApiService.getAsync<NoticiaDTO[]>(endpoint, true);
        return response;
    } catch (error) {
        console.error('Error al obtener noticias:', error);
        throw error;
    }
};

export const getNoticiaById = async (id: number): Promise<NoticiaDTO> => {
    try {
        const endpoint = `${API_ENDPOINTS.NEWS.GET_ALL}/${id}`;
        const response = await ApiService.getAsync<NoticiaDTO>(endpoint, true);
        return response;
    } catch (error) {
        console.error(`Error al obtener noticia ${id}:`, error);
        throw error;
    }
};

export const createNoticia = async (noticia: CreateNoticiaDTO): Promise<NoticiaDTO> => {
    try {
        const response = await ApiService.postAsync<NoticiaDTO, CreateNoticiaDTO>(
            API_ENDPOINTS.NEWS.SAVE,
            noticia,
            true
        );
        return response;
    } catch (error) {
        console.error('Error al guardar noticia:', error);
        throw error;
    }
};

export const NoticiasService = {
    getNoticias,
    getNoticiaById,
    createNoticia
};

export default NoticiasService;
