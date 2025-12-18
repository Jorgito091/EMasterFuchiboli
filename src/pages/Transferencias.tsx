import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
  Users,
  UserMinus,
  Lock,
  Unlock,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getTransferencias,
  getTiposTransferencia,
  getOfertasJugadores,
  getOfertasEquipo
} from "../services/transferencias";
import type { OfertaJugador } from "../types/transferencias.types";

interface TransferenciasProps {
  idTemporada: number;
}

const ITEMS_PER_PAGE = 20;

export default function Transferencias({ idTemporada }: TransferenciasProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"equipos" | "libres">("equipos");
  const [selectedTipo, setSelectedTipo] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [ofertasPage, setOfertasPage] = useState(1);
  const [showClubOnly, setShowClubOnly] = useState(false);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
    setOfertasPage(1);
  }, [selectedTipo, idTemporada, activeTab, showClubOnly]);

  // Fetch tipos de transferencia
  const { data: tipos = [] } = useQuery({
    queryKey: ["tipos-transferencia"],
    queryFn: getTiposTransferencia,
    staleTime: 1000 * 60 * 30,
  });

  // Fetch transferencias (tab Equipos)
  const {
    data: transferencias = [],
    isLoading: isLoadingTransferencias,
    error: errorTransferencias,
    isFetching: isFetchingTransferencias
  } = useQuery({
    queryKey: ["transferencias", idTemporada, selectedTipo, currentPage],
    queryFn: () => getTransferencias(idTemporada, selectedTipo, currentPage),
    staleTime: 1000 * 60 * 5,
    enabled: activeTab === "equipos",
  });

  // Fetch ofertas (tab Libres)
  const {
    data: ofertas = [],
    isLoading: isLoadingOfertas,
    error: errorOfertas,
    isFetching: isFetchingOfertas,
    refetch: refetchOfertas
  } = useQuery({
    queryKey: ["ofertas-jugadores", idTemporada, showClubOnly, user?.equipo?.id, ofertasPage],
    queryFn: () => {
      if (showClubOnly && user?.equipo?.id) {
        return getOfertasEquipo(idTemporada, user.equipo.id, ofertasPage);
      }
      return getOfertasJugadores(idTemporada, ofertasPage);
    },
    staleTime: 1000 * 60 * 2, // 2 minutos (ofertas cambian más frecuente)
    enabled: activeTab === "libres",
  });

  // Filtrar transferencias por tab activo (solo equipos con ID > 0)
  const filteredTransferencias = Array.isArray(transferencias)
    ? transferencias.filter((t) => {
      return t.equipoOrigen?.id > 0 && t.equipoDestino?.id > 0;
    })
    : [];

  // Asegurar que ofertas sea siempre un array
  const safeOfertas = Array.isArray(ofertas) ? ofertas : [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Renderizar estatus de oferta
  // Valores: 0 = en_curso, 1 = completada, 2 = cerrada (o podría variar según API)
  const renderOfertaStatus = (estatus: number | undefined | null) => {
    // Convertir a número por si viene como string
    const estatusNum = typeof estatus === 'string' ? parseInt(estatus, 10) : estatus;

    switch (estatusNum) {
      case 0: // En curso
        return (
          <div className="flex items-center justify-center gap-1 text-yellow-600 dark:text-yellow-400" title="En curso - Esperando 2hrs">
            <Unlock size={18} />
          </div>
        );
      case 1: // Completada
        return (
          <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400" title="Completada">
            <CheckCircle size={18} />
          </div>
        );
      case 2: // Cerrada
        return (
          <div className="flex items-center justify-center gap-1 text-green-700 dark:text-green-500" title="Cerrada - Compra confirmada">
            <Lock size={18} />
          </div>
        );
      default:
        // Si el estatus es undefined o un valor no reconocido, mostrar en curso por defecto
        return (
          <div className="flex items-center justify-center gap-1 text-yellow-600 dark:text-yellow-400" title={`Estatus: ${estatus ?? 'desconocido'}`}>
            <Unlock size={18} />
          </div>
        );
    }
  };

  // Renderizar escudo del equipo
  const renderTeamBadge = (urlEscudo: string, nombre: string, size: "sm" | "md" | "lg" = "md") => {
    const sizeClass = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8";

    if (urlEscudo && urlEscudo.trim() !== "") {
      return (
        <img
          src={urlEscudo}
          alt={nombre}
          className={`${sizeClass} object-contain`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      );
    }
    return (
      <div className={`${sizeClass} flex items-center justify-center bg-gray-200 dark:bg-slate-600 rounded-full`}>
        <Users size={size === "sm" ? 12 : 16} className="text-gray-400" />
      </div>
    );
  };

  // Componente de tarjeta para móvil
  const OfertaCardMobile = ({ oferta }: { oferta: OfertaJugador }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm">
      {/* Header con equipo y fecha */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {renderTeamBadge(oferta.equipo?.urlEscudo || "", oferta.equipo?.nombre || "Equipo", "sm")}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-200">
          <span>{formatDateTime(oferta.fecha)}</span>
          {renderOfertaStatus(oferta.estatus)}
        </div>
      </div>
      {/* Body con jugador */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={oferta.jugador?.urlImagen || "https://via.placeholder.com/40?text=?"}
            alt={oferta.jugador?.apodo || "Jugador"}
            className="w-10 h-10 rounded-full object-cover bg-gray-100"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/40?text=?";
            }}
          />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {oferta.jugador?.apodo || oferta.jugador?.nombre || "Sin nombre"}
          </span>
        </div>
        <span className="font-bold text-green-600 dark:text-green-400">
          {formatCurrency(oferta.monto || oferta.precio || 0)}
        </span>
      </div>
    </div>
  );

  const isLoading = activeTab === "equipos" ? isLoadingTransferencias : isLoadingOfertas;
  const error = activeTab === "equipos" ? errorTransferencias : errorOfertas;
  const isFetching = activeTab === "equipos" ? isFetchingTransferencias : isFetchingOfertas;

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-400">
        Transferencias
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab("equipos")}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === "equipos"
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
        >
          <div className="flex items-center gap-2">
            <Users size={18} />
            Equipos
          </div>
          {activeTab === "equipos" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("libres")}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === "libres"
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
        >
          <div className="flex items-center gap-2">
            <UserMinus size={18} />
            Libres
          </div>
          {activeTab === "libres" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm">
        {activeTab === "equipos" ? (
          /* Filtro por tipo de transferencia */
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Filter size={18} />
              <span className="text-sm font-medium">Tipo:</span>
            </div>
            <select
              value={selectedTipo ?? ""}
              onChange={(e) => setSelectedTipo(e.target.value ? Number(e.target.value) : undefined)}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100 text-sm"
            >
              <option value="">Todos</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.descripcion}
                </option>
              ))}
            </select>
          </div>
        ) : (
          /* Toggle y refresh para ofertas */
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`relative w-12 h-6 rounded-full transition-colors ${showClubOnly ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'
                  }`}
                onClick={() => setShowClubOnly(!showClubOnly)}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${showClubOnly ? 'translate-x-7' : 'translate-x-1'
                    }`}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ofertas del club
              </span>
            </label>
            <button
              onClick={() => refetchOfertas()}
              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title="Actualizar"
            >
              <RefreshCw size={20} className={isFetchingOfertas ? 'animate-spin' : ''} />
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600 dark:text-gray-300">
            Cargando {activeTab === "equipos" ? "transferencias" : "ofertas"}...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          Error al cargar {activeTab === "equipos" ? "transferencias" : "ofertas"}. Por favor, intenta de nuevo.
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && (
        <>
          {activeTab === "equipos" ? (
            /* ===== TAB EQUIPOS ===== */
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden flex-1 flex flex-col">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
                <h3 className="text-xl font-bold">Transferencias entre Equipos</h3>
              </div>

              {isFetching && !isLoading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              )}

              <div className="max-h-[calc(100vh-420px)] overflow-y-auto divide-y divide-gray-200 dark:divide-slate-700 relative">
                {filteredTransferencias.length === 0 ? (
                  <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron transferencias
                  </div>
                ) : (
                  filteredTransferencias.map((transferencia) => (
                    <div
                      key={transferencia.id}
                      className="p-4 md:p-6 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Player Info */}
                        <div className="flex items-center gap-3 flex-1">
                          <img
                            src={transferencia.jugador.urlImagen}
                            alt={transferencia.jugador.apodo}
                            className="w-12 h-12 rounded-full object-cover bg-gray-100"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/48?text=?";
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                #{transferencia.jugador.id}
                              </span>
                              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {transferencia.jugador.apodo}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                                Valor: {formatCurrency(transferencia.jugador.precio)}
                              </span>
                              <span className="text-gray-300 dark:text-gray-600">•</span>
                              <span className="font-semibold text-green-600 dark:text-green-400">
                                Monto: {formatCurrency(transferencia.monto)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Teams Transfer */}
                        <div className="flex items-center justify-center gap-2 min-w-[350px]">
                          <div className="flex items-center justify-end gap-2 w-[140px]">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate text-right">
                              {transferencia.equipoOrigen.nombre}
                            </span>
                            {renderTeamBadge(transferencia.equipoOrigen.urlEscudo, transferencia.equipoOrigen.nombre)}
                          </div>
                          <ArrowRight size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mx-1" />
                          <div className="flex items-center justify-start gap-2 w-[140px]">
                            {renderTeamBadge(transferencia.equipoDestino.urlEscudo, transferencia.equipoDestino.nombre)}
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate text-left">
                              {transferencia.equipoDestino.nombre}
                            </span>
                          </div>
                        </div>

                        {/* Date, Type */}
                        <div className="flex flex-col items-end gap-1 min-w-[150px]">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(transferencia.fecha)}
                          </span>
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {transferencia.descripcionTipo}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* ===== TAB LIBRES ===== */
            <div className="flex-1 flex flex-col">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
                <h3 className="text-xl font-bold">Ofertas por Jugadores Libres</h3>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block bg-white dark:bg-slate-800 rounded-b-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="max-h-[calc(100vh-420px)] overflow-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100 dark:bg-slate-700 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Equipo</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Imagen</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Edad</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Fecha</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Precio</th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Estatus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                      {safeOfertas.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                            No hay ofertas disponibles
                          </td>
                        </tr>
                      ) : (
                        safeOfertas.map((oferta) => (
                          <tr key={oferta.id} className="hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                            <td className="px-4 py-3">
                              {renderTeamBadge(oferta.equipo?.urlEscudo || "", oferta.equipo?.nombre || "Equipo")}
                            </td>
                            <td className="px-4 py-3">
                              <img
                                src={oferta.jugador?.urlImagen || "https://via.placeholder.com/40?text=?"}
                                alt={oferta.jugador?.apodo || "Jugador"}
                                className="w-10 h-10 rounded-full object-cover bg-gray-100"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/40?text=?";
                                }}
                              />
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {oferta.jugador?.id || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                              {oferta.jugador?.apodo || oferta.jugador?.nombre || "Sin nombre"}
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                              {oferta.jugador?.edad || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                              {formatDateTime(oferta.fecha)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(oferta.monto || oferta.precio || 0)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {renderOfertaStatus(oferta.estatus)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3 max-h-[calc(100vh-420px)] overflow-y-auto px-1">
                {safeOfertas.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No hay ofertas disponibles
                  </div>
                ) : (
                  safeOfertas.map((oferta) => (
                    <OfertaCardMobile key={oferta.id} oferta={oferta} />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando{" "}
              <span className="font-medium">
                {activeTab === "equipos" ? filteredTransferencias.length : safeOfertas.length}
              </span>{" "}
              {activeTab === "equipos" ? "transferencias" : "ofertas"}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => activeTab === "equipos"
                  ? setCurrentPage(p => Math.max(1, p - 1))
                  : setOfertasPage(p => Math.max(1, p - 1))
                }
                disabled={(activeTab === "equipos" ? currentPage : ofertasPage) === 1 || isFetching}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
                Anterior
              </button>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                Página{" "}
                <span className="font-medium">
                  {activeTab === "equipos" ? currentPage : ofertasPage}
                </span>
              </span>

              <button
                onClick={() => activeTab === "equipos"
                  ? setCurrentPage(p => p + 1)
                  : setOfertasPage(p => p + 1)
                }
                disabled={
                  (activeTab === "equipos"
                    ? transferencias.length < ITEMS_PER_PAGE
                    : safeOfertas.length < ITEMS_PER_PAGE
                  ) || isFetching
                }
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}