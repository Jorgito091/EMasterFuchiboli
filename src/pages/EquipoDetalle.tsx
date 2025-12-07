import { ArrowLeft, Lock, Unlock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getJugadoresByEquipo } from "../services/jugadores";
import { formatCurrencyMillions, formatCurrencyShort } from "../utils/currency.utils";
import type { Jugador } from "../types/player.types";
import type { Equipo } from "../types/auth.types";

interface EquipoDetalleProps {
    idTemporada: number;
    idEquipo: number;
    equipo?: Equipo;
    onBack: () => void;
}

export default function EquipoDetalle({
    idTemporada,
    idEquipo,
    equipo,
    onBack,
}: EquipoDetalleProps) {
    const { data: jugadores = [], isLoading, error } = useQuery<Jugador[]>({
        queryKey: ["jugadores", idTemporada, idEquipo],
        queryFn: () => getJugadoresByEquipo(idTemporada, idEquipo),
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    aria-label="Volver a equipos"
                >
                    <ArrowLeft className="text-white-600 dark:text-blue-400" size={24} />
                </button>
                <div className="flex items-center gap-4">
                    {equipo?.urlEscudo && (
                        <img
                            src={equipo.urlEscudo}
                            alt={equipo.nombre}
                            className="w-16 h-16 rounded-lg object-cover shadow-md"
                            referrerPolicy="no-referrer"
                        />
                    )}
                    <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-400">
                        {equipo?.nombre || "Detalle del Equipo"}
                    </h2>
                </div>
            </div>

            {/* Financial Status Section */}
            {equipo && (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm p-6">
                    <h3 className="text-xl font-bold text-blue-900 dark:text-blue-400 mb-4">
                        Estado Financiero
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {/* Presupuesto Inicial */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-600 p-4 rounded-lg border border-blue-200 dark:border-slate-600">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                Presupuesto Inicial
                            </p>
                            <p className="text-xl font-bold text-blue-900 dark:text-blue-300">
                                {formatCurrencyMillions(equipo.presupuestoInicial)}
                            </p>
                        </div>

                        {/* Total Ingresos */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-lg border border-green-200 dark:border-green-700">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                Total Ingresos
                            </p>
                            <p className="text-xl font-bold text-green-700 dark:text-green-400">
                                {formatCurrencyMillions(equipo.ingresos)}
                            </p>
                        </div>

                        {/* Total Gastos */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 p-4 rounded-lg border border-red-200 dark:border-red-700">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                Total Gastos
                            </p>
                            <p className="text-xl font-bold text-red-700 dark:text-red-400">
                                {formatCurrencyMillions(equipo.gastos)}
                            </p>
                        </div>

                        {/* Presupuesto Final */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                Presupuesto Final
                            </p>
                            <p className="text-xl font-bold text-purple-700 dark:text-purple-400">
                                {formatCurrencyMillions(equipo.presupuestoFinal)}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Players Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                    <h3 className="text-xl font-bold text-blue-900 dark:text-blue-400">
                        Plantilla de Jugadores
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Temporada {idTemporada}
                    </p>
                </div>

                {isLoading && (
                    <div className="p-6">
                        <p className="text-gray-500">Cargando jugadores...</p>
                    </div>
                )}

                {error && (
                    <div className="p-6">
                        <p className="text-red-500">Error al cargar jugadores</p>
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Nombre
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold">
                                        Media
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold">
                                        Potencial
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold">
                                        Edad
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Posición
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold">
                                        Precio
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-semibold">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {jugadores.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            No hay jugadores registrados para este equipo
                                        </td>
                                    </tr>
                                ) : (
                                    jugadores.map((jugador, index) => (
                                        <tr
                                            key={`${jugador.id}-${index}`}
                                            className={`hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors ${index % 2 === 0
                                                ? "bg-white dark:bg-slate-800"
                                                : "bg-gray-50 dark:bg-slate-700/50"
                                                }`}
                                        >
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {jugador.nombre}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center">
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold">
                                                    {jugador.media}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center">
                                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold">
                                                    {jugador.potencial}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center text-gray-700 dark:text-gray-300">
                                                {jugador.edad}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                                                <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                                                    {jugador.posicion}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-semibold text-green-600 dark:text-green-400">
                                                {formatCurrencyShort(jugador.precio)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {jugador.bloqueado ? (
                                                    <Lock
                                                        className="inline-block text-red-500"
                                                        size={20}
                                                        aria-label="Bloqueado"
                                                    />
                                                ) : (
                                                    <Unlock
                                                        className="inline-block text-green-500"
                                                        size={20}
                                                        aria-label="Disponible"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
