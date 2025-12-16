import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { NoticiasService } from "../services/noticias";
import type { NoticiaDTO, CreateNoticiaDTO } from "../types/noticias.types";
import { useAuth } from "../context/AuthContext";
import CreateNoticiaModal from "../components/CreateNoticiaModal";
import fuchibola from "../assets/fuchibola.png";

// Reusable Image Component with Fallback Logic
const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (imgSrc !== fuchibola) {
      setImgSrc(fuchibola);
    }
  };

  return (
    <img
      src={imgSrc}
      className={className}
      alt={alt}
      onError={handleError}
    />
  );
};

export default function Noticias() {
  const { user, isAuthenticated } = useAuth();
  const [selectedNew, setSelectedNew] = useState<NoticiaDTO | null>(null);
  const [noticias, setNoticias] = useState<NoticiaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchNoticias = async (pageNum: number) => {
    try {
      setLoading(true);
      const data = await NoticiasService.getNoticias(pageNum);
      if (Array.isArray(data)) {
        setNoticias(data);
      } else {
        console.warn("Received non-array data for news:", data);
        setNoticias([]);
      }
    } catch (error) {
      console.error("Failed to fetch news", error);
      setNoticias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias(page);
  }, [page]);

  const handleNextPage = () => {
    setPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleSaveNoticia = async (noticiaData: CreateNoticiaDTO) => {
    await NoticiasService.createNoticia(noticiaData);
    // Refresh list (reset to page 1 to see new item)
    setPage(1);
    fetchNoticias(1);
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-400">Noticias</h2>

        {isAuthenticated && user && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus size={20} />
            Agregar
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center p-10 text-gray-500">Cargando noticias...</div>
      ) : (
        <AnimatePresence mode="wait">
          {/* LISTA DE NOTICIAS */}
          {!selectedNew && (
            <motion.div
              key="lista"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm p-4"
            >
              {!noticias || noticias.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-gray-500 mb-4">No hay noticias disponibles.</p>
                  {page > 1 && (
                    <button onClick={handlePrevPage} className="text-blue-600 hover:underline">
                      Volver a la página anterior
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <ul className="space-y-4 mb-6">
                    {noticias.map((n) => (
                      <li
                        key={n.id}
                        onClick={() => setSelectedNew(n)}
                        className="p-4 border rounded-xl cursor-pointer hover:bg-gray-100 dark:bg-slate-700 transition flex items-center space-x-4"
                      >
                        <ImageWithFallback
                          src={n.urlImagen}
                          className="w-16 h-16 rounded-lg object-cover"
                          alt="thumb"
                        />

                        <div>
                          <h3 className="text-lg font-semibold text-blue-800 dark:text-white">
                            {n.titulo}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{n.texto}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(n.fechaPublicacion).toLocaleDateString()} - {n.usuario?.nombreUsuario}
                          </p>
                        </div>

                        {/* 
                            TODO: luego admin se encarga de eso 
                            (Logic for deleting news removed as per request)
                        */}
                      </li>
                    ))}
                  </ul>

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-700 pt-4">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} />
                      Anterior
                    </button>
                    <span className="text-sm text-gray-500">Página {page}</span>
                    <button
                      onClick={handleNextPage}
                      // We don't know exactly how we are gonna do that but that's for brochacho next code viber or whatever , good luck :D

                      disabled={noticias.length < 1}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* NOTICIA ABIERTA */}
          {selectedNew && (
            <motion.div
              key="detalle"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="
                  bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm p-6 relative
                  min-h-[80vh] max-h-[80vh] overflow-y-auto pr-4
              "
            >
              {/* Botón Volver */}
              <button
                onClick={() => setSelectedNew(null)}
                className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
                <span className="font-medium">Volver</span>
              </button>

              {/* BANNER GRANDE */}
              <div className="w-full mb-4 hidden md:block relative h-64 overflow-hidden rounded-xl">
                <ImageWithFallback
                  src={selectedNew.urlImagen}
                  className="w-full h-full object-cover"
                  alt="banner grande"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10"></div>
              </div>

              {/* Banner lateral fijo para pantallas pequeñas */}
              <div className="fixed bottom-4 right-4 w-32 md:hidden">
                <ImageWithFallback
                  src={selectedNew.urlImagen}
                  className="rounded-xl shadow-lg"
                  alt="banner lateral"
                />
              </div>

              <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-4">
                {selectedNew.titulo}
              </h2>

              <div className="text-sm text-gray-500 mb-4">
                Publicado por <span className="font-semibold">{selectedNew.usuario?.nombreUsuario}</span> el {new Date(selectedNew.fechaPublicacion).toLocaleDateString()}
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {selectedNew.texto}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* CREATE MODAL */}
      {user && (
        <CreateNoticiaModal
          isOpen={showCreateModal}
          userId={user.userId}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveNoticia}
        />
      )}
    </div>
  );
}