import React, { useState, useEffect } from "react";
import { Trophy, Target, Shield, Award, Users, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTorneos, getTemporadaData } from "../services/temporadas";
import type { Torneo, TemporadaData, EquipoTabla, Goleador, MejorEquipo, JugadorInfo, EquipoInfo } from "../types/temporada.types";

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

export default function Temporada({ idTemporada }: TemporadaProps) {
  const [selectedTorneo, setSelectedTorneo] = useState<number | null>(null);

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
    enabled: selectedTorneo !== null,
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
        <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-400 mb-6">Temporada</h2>

        {/* Panel de pestañas de torneos */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
          <div className="flex overflow-x-auto">
            {torneos.map((torneo) => (
              <button
                key={torneo.id}
                onClick={() => setSelectedTorneo(torneo.id)}
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
      </div>

      {/* Contenido sin scroll - altura fija */}
      {selectedTorneo && (
        <div className="flex-1 min-h-0">
          <div className="h-full">
            {loadingTemporada ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando información...</span>
              </div>
            ) : (
              <>
                {/* Grid de 2 columnas: Tabla General a la izquierda, Goleadores + Mejores Equipos a la derecha */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  {/* Columna Izquierda - Tabla General del Torneo */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center gap-3 flex-shrink-0">
                      <Trophy size={24} />
                      <h3 className="text-xl font-bold">Tabla General del Torneo</h3>
                    </div>
                    <div className="overflow-auto flex-1" style={{ maxHeight: 'calc(100vh - 14rem)' }}>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-slate-700 sticky top-0 z-10">
                          <tr>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">#</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Equipo</th>
                            <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">JJ</th>
                            <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">JG</th>
                            <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">JE</th>
                            <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">JP</th>
                            <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">DG</th>
                            <th className="px-2 py-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">Pts</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                          {tabla.map((equipo, index) => {
                            const equipoNombre = typeof equipo.equipo === 'object' && equipo.equipo
                              ? equipo.equipo.nombre
                              : String(equipo.equipo || `Equipo ${index + 1}`);
                            const equipoEscudo = typeof equipo.equipo === 'object' && equipo.equipo
                              ? equipo.equipo.urlEscudo
                              : undefined;

                            // Detectar si cambia el grupo
                            const grupoAnterior = index > 0 ? tabla[index - 1].grupo : null;
                            const mostrarSeparadorGrupo = equipo.grupo && equipo.grupo !== grupoAnterior;

                            // Calcular el total de equipos en el grupo actual
                            const grupoActual = equipo.grupo;
                            const equiposDelGrupo = tabla.filter(e => e.grupo === grupoActual);
                            const totalDelGrupo = equiposDelGrupo.length;

                            // Determinar si está en zona de descenso (últimos 3 del grupo)
                            const esZonaDescenso = equipo.posicion >= totalDelGrupo - 2;

                            return (
                              <React.Fragment key={equipo.idEquipo || index}>
                                {/* Fila separadora de grupo */}
                                {mostrarSeparadorGrupo && (
                                  <tr className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800">
                                    <td colSpan={8} className="px-4 py-2 text-center text-white font-bold text-sm">
                                      Grupo {equipo.grupo}
                                    </td>
                                  </tr>
                                )}
                                <tr
                                  className={`${getRowBgColor(equipo.posicion, index, totalDelGrupo)} hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors`}
                                >
                                  <td className="px-2 py-2">
                                    <span className={`font-bold ${equipo.posicion <= 4 ? "text-green-600" :
                                      esZonaDescenso ? "text-red-600" : "text-gray-700 dark:text-gray-300"
                                      }`}>
                                      {equipo.posicion}
                                    </span>
                                  </td>
                                  <td className="px-2 py-2">
                                    <div className="flex items-center gap-2">
                                      {equipoEscudo && (
                                        <img
                                          src={equipoEscudo}
                                          alt={equipoNombre}
                                          className="w-6 h-6 rounded-full object-cover"
                                          referrerPolicy="no-referrer"
                                        />
                                      )}
                                      <span className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-24">{equipoNombre}</span>
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 text-center text-gray-700 dark:text-gray-300">{equipo.juegosJugados ?? equipo.pj ?? 0}</td>
                                  <td className="px-2 py-2 text-center text-green-600 font-medium">{equipo.juegosGanados ?? equipo.pg ?? 0}</td>
                                  <td className="px-2 py-2 text-center text-yellow-600 font-medium">{equipo.juegosEmpatados ?? equipo.pe ?? 0}</td>
                                  <td className="px-2 py-2 text-center text-red-600 font-medium">{equipo.juegosPerdidos ?? equipo.pp ?? 0}</td>
                                  <td className="px-2 py-2 text-center font-medium">
                                    <span className={
                                      (equipo.diferencia ?? equipo.dg ?? 0) > 0 ? "text-green-600" :
                                        (equipo.diferencia ?? equipo.dg ?? 0) < 0 ? "text-red-600" : "text-gray-500"
                                    }>
                                      {(equipo.diferencia ?? equipo.dg ?? 0) > 0 ? `+${equipo.diferencia ?? equipo.dg}` : equipo.diferencia ?? equipo.dg ?? 0}
                                    </span>
                                  </td>
                                  <td className="px-2 py-2 text-center font-bold text-blue-700 dark:text-blue-400">{equipo.puntos ?? equipo.pts ?? 0}</td>
                                </tr>
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                      {tabla.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No hay datos de tabla disponibles
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Columna Derecha - Goleadores + Mejores Equipos apilados verticalmente */}
                  <div className="flex flex-col gap-4 h-full min-h-0">
                    {/* Goleadores - con altura limitada y scroll interno */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 flex items-center gap-3 flex-shrink-0">
                        <Target size={20} />
                        <h3 className="text-lg font-bold">Goleadores</h3>
                      </div>
                      <div className="p-3 overflow-y-auto flex-1">
                        <div className="space-y-3">
                          {goleadores.slice(0, 10).map((goleador, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-3 rounded-lg ${index === 0 ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800" :
                                index === 1 ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" :
                                  index === 2 ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800" :
                                    "bg-gray-50 dark:bg-slate-700"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`font-bold w-6 text-center ${index === 0 ? "text-yellow-600" :
                                  index === 1 ? "text-blue-500" :
                                    index === 2 ? "text-orange-600" : "text-gray-600"
                                  }`}>
                                  {goleador.posicion || index + 1}
                                </span>
                                {getEquipoEscudo(goleador.equipo) && (
                                  <img
                                    src={getEquipoEscudo(goleador.equipo)}
                                    alt={getEquipoNombre(goleador.equipo)}
                                    className="w-8 h-8 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
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
                          {goleadores.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              No hay datos de goleadores disponibles
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mejores Equipos */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 flex items-center gap-3">
                        <Award size={24} />
                        <h3 className="text-xl font-bold">Mejores Equipos</h3>
                      </div>
                      <div className="p-4">
                        <div className="space-y-4">
                          {/* Mejor Ataque */}
                          <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-slate-600">
                              <Target className="text-red-500" size={18} />
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Mejor Ofensiva</h4>
                            </div>
                            {equipoOfensivo ? (
                              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                {equipoOfensivo.urlEscudo && (
                                  <img
                                    src={equipoOfensivo.urlEscudo}
                                    alt={equipoOfensivo.nombre}
                                    className="w-12 h-12 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {equipoOfensivo.nombre}
                                </span>
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-500 text-sm">
                                Sin datos
                              </div>
                            )}
                          </div>

                          {/* Mejor Defensa */}
                          <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-slate-600">
                              <Shield className="text-blue-500" size={18} />
                              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Mejor Defensiva</h4>
                            </div>
                            {equipoDefensivo ? (
                              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                {equipoDefensivo.urlEscudo && (
                                  <img
                                    src={equipoDefensivo.urlEscudo}
                                    alt={equipoDefensivo.nombre}
                                    className="w-12 h-12 rounded-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {equipoDefensivo.nombre}
                                </span>
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-500 text-sm">
                                Sin datos
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer con Leyenda - siempre visible */}
      {selectedTorneo && !loadingTemporada && (
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