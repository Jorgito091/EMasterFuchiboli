import React, { useState, useEffect } from "react";
import { Trophy, Target, Shield, Award, Users, Loader2, Calendar, List, Filter, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTorneos, getTemporadaData } from "../services/temporadas";
import { JornadasService } from "../services/jornadas";
import type { Torneo, TemporadaData, EquipoTabla, Goleador, MejorEquipo, JugadorInfo, EquipoInfo } from "../types/temporada.types";
import type { Jornada, Encuentro } from "../types/jornadas.types";
import { useAuth } from "../context/AuthContext";

interface TemporadaProps {
  idTemporada: number;
}

// Helper para convertir respuesta a array de forma segura
const toArray = <T,>(data: T[] | T | unknown): T[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') return [data as T];
  return [];
};

// Helper para obtener nombre de jugador (puede ser string u objeto)
const getJugadorNombre = (jugador: JugadorInfo | string | undefined): string => {
  if (!jugador) return 'Desconocido';
  if (typeof jugador === 'string') return jugador;
  return jugador.nombre || 'Desconocido';
};

// Helper para obtener info de equipo (puede ser string u objeto)
const getEquipoNombre = (equipo: EquipoInfo | string | undefined): string => {
  if (!equipo) return 'Desconocido';
  if (typeof equipo === 'string') return equipo;
  return equipo.nombre || 'Desconocido';
};

const getEquipoEscudo = (equipo: EquipoInfo | string | undefined): string | undefined => {
  if (!equipo) return undefined;
  if (typeof equipo === 'string') return undefined;
  return equipo.urlEscudo;
};

import fuchibola from "../assets/fuchibola.png";

// Reusable TeamLogo Component
const TeamLogo = ({ src, alt, className }: { src?: string; alt: string; className: string }) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = () => {
    if (imgSrc !== fuchibola) {
      setImgSrc(fuchibola);
    }
  };

  return (
    <img
      src={imgSrc || fuchibola}
      alt={alt}
      className={className}
      onError={handleError}
      referrerPolicy="no-referrer"
    />
  );
};

export default function Temporada({ idTemporada }: TemporadaProps) {
  const { user } = useAuth();
  const [selectedTorneo, setSelectedTorneo] = useState<number | null>(null);

  // Estados para Jornadas
  const [viewMode, setViewMode] = useState<'general' | 'jornadas'>('general');
  const [jornadaMode, setJornadaMode] = useState<'jornada' | 'pendientes' | 'jugados'>('jornada');
  const [selectedJornadaId, setSelectedJornadaId] = useState<number | null>(null);

  // Obtener lista de torneos
  const { data: rawTorneos, isLoading: loadingTorneos, error: errorTorneos } = useQuery<Torneo[] | Torneo | unknown>({
    queryKey: ["torneos"],
    queryFn: getTorneos,
  });

  // Convertir torneos a array de forma segura
  const torneos: Torneo[] = toArray<Torneo>(rawTorneos);

  // Seleccionar primer torneo automáticamente cuando se carguen
  useEffect(() => {
    if (torneos.length > 0 && selectedTorneo === null) {
      setSelectedTorneo(torneos[0].id);
    }
  }, [torneos, selectedTorneo]);

  // Obtener datos de la temporada (tabla, goleadores, mejores equipos)
  const { data: temporadaData, isLoading: loadingTemporada } = useQuery<TemporadaData>({
    queryKey: ["temporadaData", idTemporada, selectedTorneo],
    queryFn: () => getTemporadaData(idTemporada, selectedTorneo!),
    enabled: selectedTorneo !== null && viewMode === 'general',
  });

  // query para obtener jornadas
  const { data: jornadas = [] } = useQuery<Jornada[]>({
    queryKey: ["jornadas", idTemporada, selectedTorneo],
    queryFn: async () => {
      const data = await JornadasService.getJornadas(idTemporada, selectedTorneo!);
      return toArray(data);
    },
    enabled: selectedTorneo !== null && viewMode === 'jornadas' && jornadaMode === 'jornada',
  });

  // Efecto para seleccionar la primera jornada activa por defecto
  useEffect(() => {
    if (jornadas.length > 0 && !selectedJornadaId) {
      const activeJornada = jornadas.find(j => j.activa);
      if (activeJornada) {
        setSelectedJornadaId(activeJornada.id);
      } else {
        setSelectedJornadaId(jornadas[0].id);
      }
    }
  }, [jornadas, selectedJornadaId]);

  // query para encuentros (según modo)
  const { data: encuentros = [], isLoading: loadingEncuentros } = useQuery<Encuentro[]>({
    queryKey: ["encuentros", idTemporada, selectedTorneo, viewMode, jornadaMode, selectedJornadaId, user?.equipo?.id],
    queryFn: async () => {
      if (viewMode !== 'jornadas') return [];

      if (jornadaMode === 'jornada' && selectedJornadaId) {
        const data = await JornadasService.getEncuentros(selectedJornadaId);
        return toArray(data);
      }

      if (jornadaMode === 'pendientes' && user?.equipo?.id) {
        const data = await JornadasService.getPendientes(idTemporada, selectedTorneo!, user.equipo.id);
        return toArray(data);
      }

      if (jornadaMode === 'jugados' && user?.equipo?.id) {
        const data = await JornadasService.getJugados(idTemporada, selectedTorneo!, user.equipo.id);
        return toArray(data);
      }

      return [];
    },
    enabled: selectedTorneo !== null && viewMode === 'jornadas' && (
      (jornadaMode === 'jornada' && !!selectedJornadaId) ||
      ((jornadaMode === 'pendientes' || jornadaMode === 'jugados') && !!user?.equipo?.id)
    ),
  });

  // Extraer datos de temporadaData
  const tabla: EquipoTabla[] = temporadaData?.tabla ? toArray(temporadaData.tabla) : [];
  const goleadores: Goleador[] = temporadaData?.goleadores ? toArray(temporadaData.goleadores) : [];
  const equipoOfensivo: MejorEquipo | undefined = temporadaData?.equipoOfensiva;
  const equipoDefensivo: MejorEquipo | undefined = temporadaData?.equipoDefensiva;

  const getRowBgColor = (posicion: number, index: number, totalRows: number) => {
    if (posicion <= 4) return "bg-green-50 dark:bg-green-900/20";
    if (posicion <= 6) return "bg-blue-50 dark:bg-blue-900/20";
    if (posicion >= totalRows - 2) return "bg-red-50 dark:bg-red-900/20";
    return index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-700";
  };

  if (loadingTorneos) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (errorTorneos) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Error al cargar los torneos</p>
        <p className="text-gray-500 mt-2">Por favor, intenta recargar la página</p>
      </div>
    );
  }

  if (torneos.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-500 text-lg">No hay torneos disponibles</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header fijo */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-400">Temporada</h2>

          {/* View Switcher */}
          <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('general')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'general'
                ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
            >
              <List size={16} />
              General
            </button>
            <button
              onClick={() => setViewMode('jornadas')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'jornadas'
                ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
            >
              <Calendar size={16} />
              Jornadas
            </button>
          </div>
        </div>

        {/* Panel de pestañas de torneos */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
          <div className="flex overflow-x-auto">
            {torneos.map((torneo) => (
              <button
                key={torneo.id}
                onClick={() => {
                  setSelectedTorneo(torneo.id);
                  setSelectedJornadaId(null);
                }}
                className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-all border-b-2 ${selectedTorneo === torneo.id
                  ? "bg-blue-600 text-white border-blue-600"
                  : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 border-transparent hover:border-blue-300"
                  }`}
              >
                <Trophy className="inline-block mr-2" size={16} />
                {String(torneo.nombre || `Torneo ${torneo.id}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Jornadas Sub-Navigation */}
        {viewMode === 'jornadas' && selectedTorneo && (
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-slate-700 shadow-sm">
              <button
                onClick={() => setJornadaMode('jornada')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${jornadaMode === 'jornada' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
              >
                Por Jornada
              </button>
              <button
                onClick={() => setJornadaMode('pendientes')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${jornadaMode === 'pendientes' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setJornadaMode('jugados')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${jornadaMode === 'jugados' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
              >
                Jugados
              </button>
            </div>

            {/* Selector de Jornada (Solo visible en modo 'jornada') */}
            {jornadaMode === 'jornada' && jornadas.length > 0 && (
              <div className="relative">
                <select
                  value={selectedJornadaId || ''}
                  onChange={(e) => setSelectedJornadaId(Number(e.target.value))}
                  className="appearance-none bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pointer-events-auto cursor-pointer"
                >
                  {jornadas.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.descripcion} {j.activa ? '(Activa)' : ''}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <Filter size={16} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 min-h-0">
        <div className="h-full">
          {/* MODO GENERAL (TABLA + GOLEADORES) */}
          {viewMode === 'general' && (
            <>
              {loadingTemporada ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                  <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando información...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  {/* ... (Existing Table Code) ... */}
                  {/* Reusing existing logic for rendering table and stats */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
                      <div className="flex items-center gap-3">
                        <Trophy size={24} className="text-blue-600 dark:text-blue-400" />
                        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-400">Tabla General del Torneo</h3>
                      </div>
                    </div>
                    <div className="overflow-auto flex-1" style={{ maxHeight: 'calc(100vh - 14rem)' }}>
                      <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Equipo</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">JJ</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">JG</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">JE</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">JP</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">DG</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Pts</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                          {tabla.map((equipo, index) => {
                            const equipoNombre = typeof equipo.equipo === 'object' && equipo.equipo
                              ? equipo.equipo.nombre
                              : String(equipo.equipo || `Equipo ${index + 1}`);
                            const equipoEscudo = typeof equipo.equipo === 'object' && equipo.equipo
                              ? equipo.equipo.urlEscudo
                              : undefined;

                            const grupoAnterior = index > 0 ? tabla[index - 1].grupo : null;
                            const mostrarSeparadorGrupo = equipo.grupo && equipo.grupo !== grupoAnterior;
                            const grupoActual = equipo.grupo;
                            const equiposDelGrupo = tabla.filter(e => e.grupo === grupoActual);
                            const totalDelGrupo = equiposDelGrupo.length;
                            const esZonaDescenso = equipo.posicion >= totalDelGrupo - 2;

                            return (
                              <React.Fragment key={equipo.idEquipo || index}>
                                {mostrarSeparadorGrupo && (
                                  <tr className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800">
                                    <td colSpan={8} className="px-4 py-2 text-center text-white font-bold text-sm">
                                      Grupo {equipo.grupo}
                                    </td>
                                  </tr>
                                )}
                                <tr className={`${getRowBgColor(equipo.posicion, index, totalDelGrupo)} hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors`}>
                                  <td className="px-4 py-3 text-sm">
                                    <span className={`font-bold ${equipo.posicion <= 4 ? "text-green-600" : esZonaDescenso ? "text-red-600" : "text-gray-700 dark:text-gray-300"}`}>
                                      {equipo.posicion}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    <div className="flex items-center gap-2">
                                      {equipoEscudo && (
                                        <img src={equipoEscudo} alt={equipoNombre} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                                      )}
                                      <span className="font-medium text-gray-900 dark:text-gray-100">{equipoNombre}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-center text-gray-700 dark:text-gray-300">{equipo.juegosJugados ?? equipo.pj ?? 0}</td>
                                  <td className="px-4 py-3 text-sm text-center text-green-600 font-medium">{equipo.juegosGanados ?? equipo.pg ?? 0}</td>
                                  <td className="px-4 py-3 text-sm text-center text-yellow-600 font-medium">{equipo.juegosEmpatados ?? equipo.pe ?? 0}</td>
                                  <td className="px-4 py-3 text-sm text-center text-red-600 font-medium">{equipo.juegosPerdidos ?? equipo.pp ?? 0}</td>
                                  <td className="px-4 py-3 text-sm text-center font-medium">
                                    <span className={(equipo.diferencia ?? equipo.dg ?? 0) > 0 ? "text-green-600" : (equipo.diferencia ?? equipo.dg ?? 0) < 0 ? "text-red-600" : "text-gray-500"}>
                                      {(equipo.diferencia ?? equipo.dg ?? 0) > 0 ? `+${equipo.diferencia ?? equipo.dg}` : equipo.diferencia ?? equipo.dg ?? 0}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-center font-bold text-blue-700 dark:text-blue-400">{equipo.puntos ?? equipo.pts ?? 0}</td>
                                </tr>
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                      {tabla.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No hay datos de tabla disponibles</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 h-full min-h-0">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
                      <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
                        <div className="flex items-center gap-3">
                          <Target size={24} className="text-yellow-500" />
                          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-400">Goleadores</h3>
                        </div>
                      </div>
                      <div className="p-6 overflow-y-auto flex-1">
                        <div className="space-y-3">
                          {goleadores.slice(0, 10).map((goleador, index) => (
                            <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${index === 0 ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" : index === 1 ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" : index === 2 ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800" : "bg-gray-50 dark:bg-slate-700"}`}>
                              <div className="flex items-center gap-3">
                                <span className={`font-bold w-6 text-center ${index === 0 ? "text-yellow-600" : index === 1 ? "text-blue-500" : index === 2 ? "text-orange-600" : "text-gray-600"}`}>
                                  {goleador.posicion || index + 1}
                                </span>
                                {getEquipoEscudo(goleador.equipo) && (
                                  <img src={getEquipoEscudo(goleador.equipo)} alt={getEquipoNombre(goleador.equipo)} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                                )}
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">{getJugadorNombre(goleador.jugador)}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{getEquipoNombre(goleador.equipo)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{goleador.goles}</span>
                                <span className="text-xs text-gray-500">goles</span>
                              </div>
                            </div>
                          ))}
                          {goleadores.length === 0 && <div className="text-center py-8 text-gray-500">No hay datos de goleadores disponibles</div>}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                          <Award size={24} className="text-green-500" />
                          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-400">Mejores Equipos</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-slate-600">
                              <Target className="text-red-500" size={18} />
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Mejor Ofensiva</h4>
                            </div>
                            {equipoOfensivo ? (
                              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-lg border border-red-200 dark:border-red-700">
                                {equipoOfensivo.urlEscudo && <img src={equipoOfensivo.urlEscudo} alt={equipoOfensivo.nombre} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />}
                                <span className="font-medium text-gray-800 dark:text-gray-200">{equipoOfensivo.nombre}</span>
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-500 text-sm">Sin datos</div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-slate-600">
                              <Shield className="text-blue-500" size={18} />
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Mejor Defensiva</h4>
                            </div>
                            {equipoDefensivo ? (
                              <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg border border-blue-200 dark:border-blue-700">
                                {equipoDefensivo.urlEscudo && <img src={equipoDefensivo.urlEscudo} alt={equipoDefensivo.nombre} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />}
                                <span className="font-medium text-gray-800 dark:text-gray-200">{equipoDefensivo.nombre}</span>
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-500 text-sm">Sin datos</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* MODO JORNADAS */}
          {viewMode === 'jornadas' && (
            <div className="h-full overflow-hidden flex flex-col">
              {loadingEncuentros ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700">
                  <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                  <p className="text-gray-500">Cargando encuentros...</p>
                </div>
              ) : (jornadaMode === 'pendientes' || jornadaMode === 'jugados') && !user?.equipo?.id ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-xl border border-yellow-100 dark:border-yellow-900/30 text-center">
                  <Shield className="text-yellow-400 mb-4" size={64} />
                  <p className="text-xl font-medium text-gray-700 dark:text-gray-300">No tienes un equipo asignado</p>
                  <p className="text-gray-500 mt-2">Para ver partidos pendientes o jugados, necesitas estar vinculado a un equipo.</p>
                  <div className="mt-4 text-xs text-gray-400 font-mono bg-gray-100 dark:bg-slate-900 p-2 rounded">
                    Debug: UserID: {user?.userId}, Equipo: {JSON.stringify(user?.equipo)}
                  </div>
                </div>
              ) : encuentros.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 text-center">
                  <Calendar className="text-gray-300 mb-4" size={64} />
                  <p className="text-xl font-medium text-gray-500">No hay encuentros disponibles</p>
                  <p className="text-gray-400 mt-2">Intenta seleccionar otra jornada o filtro.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-4 flex-1 overflow-y-auto pr-2">
                  {encuentros.map((encuentro) => (
                    <div key={encuentro.id} className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all p-4 flex flex-col md:flex-row items-center gap-4 relative overflow-hidden group flex-shrink-0">

                      {/* Status & Date (Left/Top) */}
                      <div className="w-full md:w-32 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-2 text-xs text-gray-500 dark:text-gray-400 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-700 pb-2 md:pb-0 md:pr-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">Jornada {encuentro.jornada?.numero}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{new Date(encuentro.fechaPublicacion).toLocaleDateString()}</span>
                        </div>
                        <div className="md:mt-2">
                          {encuentro.completado ? (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1">
                              <CheckCircle size={10} /> <span className="hidden md:inline">Finalizado</span><span className="md:hidden">Fin</span>
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1">
                              <Clock size={10} /> <span className="hidden md:inline">Pendiente</span><span className="md:hidden">Pen</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Match Content (Center) */}
                      <div className="flex-1 flex items-center justify-center gap-2 md:gap-6 w-full">

                        {/* Local */}
                        <div className={`flex flex-col md:flex-row items-center justify-end flex-1 gap-2 md:gap-3 text-center md:text-right p-2 rounded-xl transition-all ${encuentro.completado && encuentro.marcadorLocal > encuentro.marcadorVisita
                          ? "bg-gradient-to-l from-blue-200/80 to-transparent dark:from-green-800/40"
                          : encuentro.completado && encuentro.marcadorLocal < encuentro.marcadorVisita
                            ? "bg-gradient-to-l from-red-200/80 to-transparent dark:from-red-900/40"
                            : ""
                          }`}>
                          <span className="text-sm md:text-base font-semibold order-2 md:order-1 line-clamp-1 md:line-clamp-2 text-gray-800 dark:text-gray-200">
                            {encuentro.equipoLocal?.nombre}
                          </span>
                          <TeamLogo
                            src={encuentro.equipoLocal?.urlEscudo}
                            alt={encuentro.equipoLocal?.nombre}
                            className="w-12 h-12 md:w-10 md:h-10 rounded-full object-cover p-0.5 bg-white shadow-sm border border-gray-100 order-1 md:order-2"
                          />
                        </div>

                        {/* Score */}
                        <div className="flex flex-col items-center justify-center min-w-[4rem] px-2">
                          {encuentro.completado || encuentro.marcadorLocal > 0 || encuentro.marcadorVisita > 0 ? (
                            <div className={`flex items-center justify-center gap-1 px-3 py-1 rounded-lg border transition-colors ${encuentro.completado
                              ? "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-sm"
                              : "bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                              }`}>
                              <span className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-400">{encuentro.marcadorLocal}</span>
                              <span className="text-gray-400 font-light text-sm">-</span>
                              <span className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-400">{encuentro.marcadorVisita}</span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-gray-300 tracking-widest">VS</span>
                          )}
                        </div>

                        {/* Visita */}
                        <div className={`flex flex-col md:flex-row items-center justify-start flex-1 gap-2 md:gap-3 text-center md:text-left p-2 rounded-xl transition-all ${encuentro.completado && encuentro.marcadorVisita > encuentro.marcadorLocal
                          ? "bg-gradient-to-r from-blue-200/80 to-transparent dark:from-green-800/40"
                          : encuentro.completado && encuentro.marcadorVisita < encuentro.marcadorLocal
                            ? "bg-gradient-to-r from-red-200/80 to-transparent dark:from-red-900/40"
                            : ""
                          }`}>
                          <TeamLogo
                            src={encuentro.equipoVisita?.urlEscudo}
                            alt={encuentro.equipoVisita?.nombre}
                            className="w-12 h-12 md:w-10 md:h-10 rounded-full object-cover p-0.5 bg-white shadow-sm border border-gray-100"
                          />
                          <span className="text-sm md:text-base font-semibold line-clamp-1 md:line-clamp-2 text-gray-800 dark:text-gray-200">
                            {encuentro.equipoVisita?.nombre}
                          </span>
                        </div>
                      </div>

                      {/* Author & Actions (Right) */}
                      <div className="hidden md:flex flex-col items-end justify-center gap-2 border-l border-gray-100 dark:border-slate-700 pl-4 min-w-[100px]">
                        {encuentro.usuarioPublicacion?.nombreUsuario && (
                          <div className="flex flex-col items-end text-xs text-gray-400">
                            <span className="uppercase text-[10px] font-bold tracking-wider mb-0.5">Autor</span>
                            <span className="text-blue-500 truncate max-w-[80px] text-right">{encuentro.usuarioPublicacion.nombreUsuario}</span>
                          </div>
                        )}
                        <button className="flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          Detalles <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Footer con Leyenda - siempre visible solo en vista GENERAL */}
      {selectedTorneo && !loadingTemporada && viewMode === 'general' && (
        <div className="flex-shrink-0 mt-4 bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="text-gray-500" size={16} />
              <span className="text-gray-600 dark:text-gray-400 font-medium">Leyenda:</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-200 dark:bg-green-800"></div>
              <span className="text-gray-600 dark:text-gray-400">Zona de clasificación</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-200 dark:bg-blue-800"></div>
              <span className="text-gray-600 dark:text-gray-400">Zona de competencia europea</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-200 dark:bg-red-800"></div>
              <span className="text-gray-600 dark:text-gray-400">Zona de descenso</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}