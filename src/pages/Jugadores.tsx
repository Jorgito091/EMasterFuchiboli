import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Edit2, Trash2, Plus, Search, ChevronLeft, ChevronRight, Loader2, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PlayerProfileModal from "../components/PlayerProfileModal";
import { getJugadoresDisponibles } from "../services/jugadores";
import type { JugadorListado } from "../types/jugador-listado.types";

const ITEMS_PER_PAGE = 20; // Estimación basada en el API

export default function Jugadores() {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"capture" | "read">("read");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);

  // Fetch jugadores desde API con paginación
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["jugadores-disponibles", currentPage],
    queryFn: () => getJugadoresDisponibles(currentPage),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const jugadores = data?.datos || [];
  const totalDatos = data?.total_datos || 0;
  const totalPages = Math.ceil(totalDatos / ITEMS_PER_PAGE) || 1;

  // Filtro local por nombre, equipo o posición
  const filteredPlayers = jugadores.filter(
    (player) =>
      player.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.apodo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.nombreEquipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.posicion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCapture = () => {
    setModalMode("capture");
    setSelectedPlayerId(undefined);
    setShowModal(true);
  };

  const handleOpenRead = (id: number) => {
    setModalMode("read");
    setSelectedPlayerId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlayerId(undefined);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Renderizar escudo del equipo o placeholder
  const renderTeamBadge = (player: JugadorListado) => {
    if (player.urlEscudo && player.urlEscudo.trim() !== "") {
      return (
        <div className="flex items-center gap-2">
          <img
            src={player.urlEscudo}
            alt={player.nombreEquipo}
            className="w-6 h-6 object-contain"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="text-sm text-gray-100 dark:text-gray-100">{player.nombreEquipo}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
        <Users size={20} className="opacity-50" />
        <span className="text-sm italic">Sin equipo</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-400">
          Gestión de Jugadores
        </h2>
        {isAdmin && (
          <button
            onClick={handleOpenCapture}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus size={20} />
            Nuevo Jugador
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nombre, apodo, equipo o posición..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando jugadores...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          Error al cargar jugadores. Por favor, intenta de nuevo.
        </div>
      )}

      {/* Players Table */}
      {!isLoading && !error && (
        <>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Fetching overlay */}
            {isFetching && !isLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 flex items-center justify-center z-10">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            )}

            {/* Scrollable table container - fills available screen */}
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto overflow-x-auto relative">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Foto</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Posición</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Media</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Potencial</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Edad</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Equipo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Precio</th>
                    {isAdmin && (
                      <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredPlayers.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 9 : 8} className="px-4 py-8 text-center text-gray-500">
                        {searchTerm ? "No se encontraron jugadores con ese criterio" : "No hay jugadores disponibles"}
                      </td>
                    </tr>
                  ) : (
                    filteredPlayers.map((player, index) => (
                      <tr
                        key={player.id}
                        className={`hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors ${index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-700/50"
                          }`}
                      >
                        <td className="px-4 py-3">
                          <img
                            src={player.urlImagen}
                            alt={player.nombre}
                            className="w-10 h-10 rounded-full object-cover bg-gray-100"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/40?text=?";
                            }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {player.apodo || player.nombre}
                            </span>
                            {player.apodo && player.apodo !== player.nombre && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {player.nombre}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {player.posicion}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-bold text-sm ${player.media >= 85 ? "text-green-600 dark:text-green-400" :
                            player.media >= 75 ? "text-yellow-600 dark:text-yellow-400" :
                              "text-gray-600 dark:text-gray-400"
                            }`}>
                            {player.media}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-medium text-sm ${player.potencial >= 85 ? "text-purple-600 dark:text-purple-400" :
                            "text-gray-600 dark:text-gray-400"
                            }`}>
                            {player.potencial}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                          {player.edad}
                        </td>
                        <td className="px-4 py-3">
                          {renderTeamBadge(player)}
                        </td>
                        <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400 font-medium">
                          {formatCurrency(player.precio)}
                        </td>
                        {isAdmin && (
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenRead(player.id)}
                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("¿Estás seguro de que deseas eliminar este jugador?")) {
                                    // Lógica de eliminación aquí
                                  }
                                }}
                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando <span className="font-medium">{filteredPlayers.length}</span> de{" "}
              <span className="font-medium">{totalDatos}</span> jugadores
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1 || isFetching}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
                Anterior
              </button>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                Página <span className="font-medium">{currentPage}</span> de{" "}
                <span className="font-medium">{totalPages}</span>
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || isFetching}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal for Add/Edit Player */}
      <PlayerProfileModal
        isOpen={showModal}
        mode={modalMode}
        playerId={selectedPlayerId}
        onClose={handleCloseModal}
        onSave={handleSaveSuccess}
      />
    </div>
  );
}