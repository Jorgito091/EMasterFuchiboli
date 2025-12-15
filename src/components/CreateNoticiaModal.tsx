
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import type { CreateNoticiaDTO } from "../types/noticias.types";

interface CreateNoticiaModalProps {
    isOpen: boolean;
    userId: number;
    onClose: () => void;
    onSave: (noticia: CreateNoticiaDTO) => Promise<void>;
}

export default function CreateNoticiaModal({
    isOpen,
    userId,
    onClose,
    onSave,
}: CreateNoticiaModalProps) {
    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    const [urlImagen, setUrlImagen] = useState("");
    const [loading, setLoading] = useState(false);

    // Reset form when modal opens is handled by parent or useEffect if needed, 
    // currently we just let state persist or reset manually on close if desired.
    // Ideally reset on open or successful save.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo || !texto || !urlImagen) return;

        setLoading(true);
        try {
            const newNoticia: CreateNoticiaDTO = {
                titulo,
                texto,
                urlImagen,
                usuario: { id: userId },
            };
            await onSave(newNoticia);

            // Reset form
            setTitulo("");
            setTexto("");
            setUrlImagen("");
            onClose();
        } catch (error: any) {
            console.error("Error saving news:", error);
            alert(`Error al guardar: ${error.message || "Error desconocido"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-700">
                            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400">
                                Nueva Noticia
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white transition-all"
                                    placeholder="Título de la noticia"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    URL de Imagen
                                </label>
                                <input
                                    type="url"
                                    value={urlImagen}
                                    onChange={(e) => setUrlImagen(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white transition-all"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    required
                                />
                                {urlImagen && (
                                    <div className="mt-2 h-32 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-900">
                                        <img
                                            src={urlImagen}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                            onLoad={(e) => (e.currentTarget.style.display = 'block')}
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Contenido
                                </label>
                                <textarea
                                    value={texto}
                                    onChange={(e) => setTexto(e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white transition-all resize-none"
                                    placeholder="Escribe el contenido de la noticia..."
                                    required
                                />
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end pt-4 gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                                >
                                    <Save size={18} />
                                    {loading ? "Guardando..." : "Guardar Noticia"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
