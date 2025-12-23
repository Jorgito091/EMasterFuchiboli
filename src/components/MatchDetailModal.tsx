import { useState, useEffect } from "react";
import { X, AlertCircle, Plus, Minus, Image as ImageIcon, Trash2, Shield, Users, Info, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInformacionEncuentro, guardarEncuentro } from "../services/jornadas";
import type {
    PrmEncuentroEstadisticas,
    EstadisticaJugadorGetDto,
    EstadisticaJugadorSaveDto
} from "../types/jornadas.types";

interface MatchDetailModalProps {
    isOpen: boolean;
    idEncuentro: number | null;
    onClose: () => void;
}

type TabType = "local" | "visita" | "resumen";

export default function MatchDetailModal({ isOpen, idEncuentro, onClose }: MatchDetailModalProps) {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<TabType>("local");
    const [statsLocal, setStatsLocal] = useState<EstadisticaJugadorGetDto[]>([]);
    const [statsVisita, setStatsVisita] = useState<EstadisticaJugadorGetDto[]>([]);
    const [suspencionesLocal, setSuspencionesLocal] = useState<any[]>([]);
    const [suspencionesVisita, setSuspencionesVisita] = useState<any[]>([]);
    const [marcadorLocal, setMarcadorLocal] = useState(0);
    const [marcadorVisita, setMarcadorVisita] = useState(0);
    const [autogolesLocal, setAutogolesLocal] = useState(0);
    const [autogolesVisita, setAutogolesVisita] = useState(0);
    const [urlsImagenes, setUrlsImagenes] = useState<string[]>([""]);

    // Fetch match info
    const { data: info, isLoading, error } = useQuery({
        queryKey: ["encuentro-info", idEncuentro],
        queryFn: () => getInformacionEncuentro(idEncuentro!),
        enabled: idEncuentro !== null && isOpen,
    });

    useEffect(() => {
        if (info) {
            console.log("MATCH INFO RECEIVED:", info);

            // Extractor robusto de datos
            const rawData = (info as any).datos || (info as any).data || info;
            const encuentroInfo = rawData.encuentro || rawData;

            // Intentamos varios nombres posibles para la lista de estadísticas
            const localStatsRaw = rawData.lstEstadisticasLocal || rawData.estadisticasLocal || rawData.goleadoresLocal || rawData.jugadoresLocal || (rawData.encuentro && rawData.encuentro.lstEstadisticasLocal) || [];
            const visitaStatsRaw = rawData.lstEstadisticasVisita || rawData.estadisticasVisita || rawData.goleadoresVisita || rawData.jugadoresVisita || (rawData.encuentro && rawData.encuentro.lstEstadisticasVisita) || [];

            const normalize = (list: any[]) => list.map(item => ({
                ...item,
                idJugador: item.idJugador || item.jugador?.id || item.id,
                nombreJugador: item.nombreJugador || item.jugador?.nombre || item.nombre || "Jugador",
                cantidadGoles: item.cantidadGoles ?? item.goles ?? 0,
                expulsion: item.expulsion || item.expulsionDobleAmarilla || item.roja || false,
                expulsionDirecta: item.expulsionDirecta || item.rojaDirecta || false,
                lesion: item.lesion || false
            }));

            setStatsLocal(normalize(localStatsRaw));
            setStatsVisita(normalize(visitaStatsRaw));
            setSuspencionesLocal(rawData.lstSuspensionesLocal || []);
            setSuspencionesVisita(rawData.lstSuspensionesVisita || []);
            setMarcadorLocal(encuentroInfo.marcadorLocal ?? 0);
            setMarcadorVisita(encuentroInfo.marcadorVisita ?? 0);
            setAutogolesLocal(0);
            setAutogolesVisita(0);

            // Cargar imágenes guardadas
            const savedUrls = rawData.lstUrlImagenes || rawData.imagenes || encuentroInfo.lstUrlImagenes || [];
            if (savedUrls && savedUrls.length > 0) {
                setUrlsImagenes(savedUrls);
            } else {
                setUrlsImagenes([""]);
            }

            // Si el encuentro está cerrado, ir directo a resumen
            if (encuentroInfo.cerrado) {
                setActiveTab("resumen");
            }
        }
    }, [info]);

    // Calcular marcador dinámicamente si no está cerrado
    useEffect(() => {
        const rawData = (info as any)?.datos || (info as any)?.data || info;
        const e = rawData?.encuentro || rawData;

        if (e && !e.cerrado) {
            const getGoles = (p: any) => p.cantidadGoles ?? p.goles ?? 0;
            const golesLocales = (statsLocal || []).reduce((acc, p) => acc + getGoles(p), 0) + autogolesVisita;
            const golesVisita = (statsVisita || []).reduce((acc, p) => acc + getGoles(p), 0) + autogolesLocal;
            setMarcadorLocal(golesLocales);
            setMarcadorVisita(golesVisita);
        }
    }, [statsLocal, statsVisita, autogolesLocal, autogolesVisita, info]);

    const handleUpdateStat = (team: "local" | "visita", playerId: number, field: keyof EstadisticaJugadorGetDto, value: any) => {
        const rawData = (info as any)?.datos || (info as any)?.data || info;
        const e = rawData?.encuentro || rawData;
        if (e?.cerrado) return;

        const setStats = team === "local" ? setStatsLocal : setStatsVisita;
        setStats(prev => prev.map(p => {
            if (p.idJugador === playerId) {
                if (field === "expulsion" && value === true) {
                    return { ...p, expulsion: true, expulsionDirecta: false };
                }
                if (field === "expulsionDirecta" && value === true) {
                    return { ...p, expulsionDirecta: true, expulsion: false };
                }
                return { ...p, [field]: value };
            }
            return p;
        }));
    };

    const handleAddImageUrl = () => setUrlsImagenes([...urlsImagenes, ""]);
    const handleUpdateImageUrl = (index: number, value: string) => {
        const newUrls = [...urlsImagenes];
        newUrls[index] = value;
        setUrlsImagenes(newUrls);
    };
    const handleRemoveImageUrl = (index: number) => setUrlsImagenes(urlsImagenes.filter((_, i) => i !== index));

    const mutation = useMutation({
        mutationFn: guardarEncuentro,
        onSuccess: () => {
            alert("¡Encuentro guardado con éxito!");
            queryClient.invalidateQueries({ queryKey: ["encuentros"] });
            queryClient.invalidateQueries({ queryKey: ["encuentros-pendientes"] });
            onClose();
        },
        onError: (err: any) => alert(err.message || "Error al guardar el encuentro")
    });

    const handleSave = async () => {
        const rawData = (info as any)?.datos || (info as any)?.data || info;
        const e = rawData?.encuentro || rawData;
        if (!e) return;

        const validUrls = urlsImagenes.filter(url => url.trim() !== "");
        if (validUrls.length === 0) {
            alert("Es obligatorio capturar al menos un link de imagen del resultado.");
            return;
        }

        if (!confirm("Atención: Una vez enviada la información, solo un administrador podrá revertir el resultado. ¿Deseas continuar?")) return;

        const filterStats = (stats: EstadisticaJugadorGetDto[]): EstadisticaJugadorSaveDto[] => {
            return stats
                .filter(p => p.cantidadGoles > 0 || p.expulsion || p.expulsionDirecta || p.lesion)
                .map(p => ({
                    idJugador: p.idJugador,
                    cantidadGoles: p.cantidadGoles,
                    expulsion: p.expulsion,
                    expulsionDirecta: p.expulsionDirecta,
                    lesion: p.lesion
                }));
        };

        const payload: PrmEncuentroEstadisticas = {
            idEncuentro: e.id || 0,
            marcadorLocal,
            marcadorVisita,
            lstEstadisticasLocal: filterStats(statsLocal),
            lstEstadisticasVisita: filterStats(statsVisita),
            lstUrlImagenes: validUrls
        };

        mutation.mutate(payload);
    };

    if (!isOpen) return null;

    const rawData = info ? ((info as any).datos || (info as any).data || info) : null;
    const e = rawData ? (rawData.encuentro || rawData) : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <Info size={24} className="opacity-80" />
                        <h2 className="text-xl font-bold">Detalle de Encuentro</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Cargando información del partido...</p>
                    </div>
                ) : error ? (
                    <div className="flex-1 p-12 text-center">
                        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                        <p className="text-red-600 font-bold text-lg">Error al cargar el encuentro</p>
                        <button onClick={onClose} className="mt-6 px-6 py-2 bg-gray-200 dark:bg-slate-700 rounded-lg">Cerrar</button>
                    </div>
                ) : e && (
                    <>
                        {/* Scoreboard */}
                        <div className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 p-6">
                            <div className="flex items-center justify-center gap-8 md:gap-16">
                                <div className="flex flex-col items-center text-center">
                                    <img src={e.equipoLocal?.urlEscudo} alt="" className="w-20 h-20 mb-2 object-contain" referrerPolicy="no-referrer" />
                                    <span className="font-bold text-lg dark:text-gray-100">{e.equipoLocal?.nombre}</span>
                                    <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">LOCAL</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-4">
                                        <span className="text-5xl font-black text-blue-900 dark:text-white tabular-nums">
                                            {marcadorLocal}
                                        </span>
                                        <span className="text-2xl font-bold text-gray-400">-</span>
                                        <span className="text-5xl font-black text-blue-900 dark:text-white tabular-nums">
                                            {marcadorVisita}
                                        </span>
                                    </div>
                                    <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${e.cerrado ? 'bg-red-100 text-red-700' :
                                        e.completado ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {e.cerrado ? 'Cerrado' : e.completado ? 'Completado' : 'Pendiente'}
                                    </span>
                                </div>

                                <div className="flex flex-col items-center text-center">
                                    <img src={e.equipoVisita?.urlEscudo} alt="" className="w-20 h-20 mb-2 object-contain" referrerPolicy="no-referrer" />
                                    <span className="font-bold text-lg dark:text-gray-100">{e.equipoVisita?.nombre}</span>
                                    <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">VISITA</span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-gray-100 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600">
                            {[
                                { id: "local", label: e.equipoLocal?.nombre || "Local", icon: Shield },
                                { id: "visita", label: e.equipoVisita?.nombre || "Visita", icon: Users },
                                { id: "resumen", label: e.cerrado ? "Resumen" : "Multimedia y Finalizar", icon: ImageIcon }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-all ${activeTab === tab.id
                                        ? "bg-white dark:bg-slate-800 text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600"
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {(activeTab === "local" || activeTab === "visita") && (
                                <div className="space-y-6">
                                    {/* Suspensiones Section */}
                                    {(activeTab === "local" ? suspencionesLocal : suspencionesVisita).length > 0 && (
                                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4">
                                            <h4 className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-3">
                                                <AlertCircle size={16} />
                                                Jugadores Suspendidos / Lesionados
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {(activeTab === "local" ? suspencionesLocal : suspencionesVisita).map((s, idx) => (
                                                    <div key={`susp-${idx}`} className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 shadow-sm flex items-center gap-2">
                                                        <span className="text-xs font-medium dark:text-gray-200">{s.nombreJugador || s.jugador?.nombre || "Jugador"}</span>
                                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600 uppercase border border-red-200">
                                                            {s.lesion ? "LES" : "SUSP"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold dark:text-white">Estadísticas de Jugadores</h3>
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-200 dark:border-yellow-800 flex items-center gap-2">
                                            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">Autogoles del Rival:</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    disabled={e.cerrado}
                                                    onClick={() => activeTab === "local" ? setAutogolesVisita(Math.max(0, autogolesVisita - 1)) : setAutogolesLocal(Math.max(0, autogolesLocal - 1))}
                                                    className="p-1 bg-white dark:bg-slate-700 rounded shadow hover:bg-gray-100"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="font-bold dark:text-white">{activeTab === "local" ? autogolesVisita : autogolesLocal}</span>
                                                <button
                                                    disabled={e.cerrado}
                                                    onClick={() => activeTab === "local" ? setAutogolesVisita(autogolesVisita + 1) : setAutogolesLocal(autogolesLocal + 1)}
                                                    className="p-1 bg-white dark:bg-slate-700 rounded shadow hover:bg-gray-100"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 dark:bg-slate-900/80">
                                                <tr className="dark:text-gray-300">
                                                    <th className="px-4 py-3 text-left">Jugador</th>
                                                    <th className="px-4 py-3 text-center">Goles</th>
                                                    <th className="px-4 py-3 text-center">Lesión</th>
                                                    <th className="px-4 py-3 text-center">Expulsión</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                                {(activeTab === "local" ? statsLocal : statsVisita).map((player, idx) => {
                                                    const isExp = player.expulsion;
                                                    const isRoja = player.expulsionDirecta;

                                                    return (
                                                        <tr key={player.idJugador || `player-${idx}`} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                                            <td className="px-4 py-3 font-medium dark:text-gray-100">{player.nombreJugador}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center justify-center gap-3">
                                                                    <button
                                                                        disabled={e.cerrado || player.cantidadGoles === 0}
                                                                        onClick={() => handleUpdateStat(activeTab as any, player.idJugador, "cantidadGoles", player.cantidadGoles - 1)}
                                                                        className="p-1 bg-gray-100 dark:bg-slate-700 rounded hover:bg-gray-200 disabled:opacity-30"
                                                                    >
                                                                        <Minus size={14} />
                                                                    </button>
                                                                    <span className="w-4 text-center font-bold dark:text-white">{player.cantidadGoles}</span>
                                                                    <button
                                                                        disabled={e.cerrado}
                                                                        onClick={() => handleUpdateStat(activeTab as any, player.idJugador, "cantidadGoles", player.cantidadGoles + 1)}
                                                                        className="p-1 bg-gray-100 dark:bg-slate-700 rounded hover:bg-gray-200"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    disabled={e.cerrado}
                                                                    checked={player.lesion}
                                                                    onChange={(ev) => handleUpdateStat(activeTab as any, player.idJugador, "lesion", ev.target.checked)}
                                                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3 text-center">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button
                                                                        disabled={e.cerrado}
                                                                        onClick={() => {
                                                                            handleUpdateStat(activeTab as any, player.idJugador, "expulsion", false);
                                                                            handleUpdateStat(activeTab as any, player.idJugador, "expulsionDirecta", false);
                                                                        }}
                                                                        className={`text-[10px] font-bold px-2 py-1 rounded border ${!isExp && !isRoja ? 'bg-gray-200 border-gray-400' : 'border-gray-200 text-gray-400'}`}
                                                                    >NADA</button>
                                                                    <button
                                                                        disabled={e.cerrado}
                                                                        onClick={() => handleUpdateStat(activeTab as any, player.idJugador, "expulsion", true)}
                                                                        className={`text-[10px] font-bold px-2 py-1 rounded border ${isExp ? 'bg-yellow-400 border-yellow-600 text-yellow-900' : 'border-gray-200 text-gray-400'}`}
                                                                    >2ª AMA</button>
                                                                    <button
                                                                        disabled={e.cerrado}
                                                                        onClick={() => handleUpdateStat(activeTab as any, player.idJugador, "expulsionDirecta", true)}
                                                                        className={`text-[10px] font-bold px-2 py-1 rounded border ${isRoja ? 'bg-red-500 border-red-700 text-white' : 'border-gray-200 text-gray-400'}`}
                                                                    >ROJA</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === "resumen" && (
                                <div className="space-y-8">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                                        <div className="flex gap-3">
                                            <AlertCircle className="text-blue-600 shrink-0" size={24} />
                                            <div>
                                                <h4 className="font-bold text-blue-900 dark:text-blue-300">Resumen del Encuentro</h4>
                                                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                                                    {e.cerrado ? "Este encuentro está cerrado." : "Sube evidencia para guardar."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {["local", "visita"].map(team => {
                                            const stats = team === "local" ? statsLocal : statsVisita;
                                            const scorers = stats.filter(s => (s.cantidadGoles ?? (s as any).goles ?? 0) > 0);
                                            const tName = team === "local" ? e.equipoLocal?.nombre : e.equipoVisita?.nombre;

                                            return (
                                                <div key={team} className="bg-white dark:bg-slate-900/40 p-5 rounded-xl border border-gray-100 dark:border-slate-700">
                                                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                        <Shield size={18} className="text-blue-600" />
                                                        {tName}
                                                    </h4>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Goles</span>
                                                        </div>
                                                        {scorers.map((s, idx) => (
                                                            <div key={s.idJugador || `scorer-${idx}`} className="flex justify-between text-sm">
                                                                <span className="dark:text-gray-300">{s.nombreJugador}</span>
                                                                <span className="font-bold text-blue-600">{s.cantidadGoles}</span>
                                                            </div>
                                                        ))}
                                                        {scorers.length === 0 && <p className="text-sm text-gray-400 italic">Sin goles registrados</p>}

                                                        {/* Incidencias (Tarjetas/Lesiones) */}
                                                        {stats.some(s => s.expulsion || s.expulsionDirecta || s.lesion) && (
                                                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700 space-y-2">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Incidencias</span>
                                                                </div>
                                                                {stats.filter(s => s.expulsion || s.expulsionDirecta || s.lesion).map((s, idx) => (
                                                                    <div key={`inc-${s.idJugador || idx}`} className="flex items-center justify-between text-xs">
                                                                        <span className="dark:text-gray-400">{s.nombreJugador}</span>
                                                                        <div className="flex gap-1">
                                                                            {s.expulsion && <span className="px-1.5 py-0.5 bg-yellow-400 text-yellow-900 rounded text-[9px] font-bold">2ª AMA</span>}
                                                                            {s.expulsionDirecta && <span className="px-1.5 py-0.5 bg-red-500 text-white rounded text-[9px] font-bold">ROJA</span>}
                                                                            {s.lesion && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[9px] font-bold border border-red-200">LES</span>}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                                            <ImageIcon size={20} />
                                            Imágenes del Partido
                                        </h3>
                                        <div className="grid gap-4">
                                            {urlsImagenes.map((url, idx) => (
                                                <div key={idx} className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="url"
                                                            disabled={e.cerrado}
                                                            placeholder="https://ejemplo.com/partido.png"
                                                            value={url}
                                                            onChange={(ev) => handleUpdateImageUrl(idx, ev.target.value)}
                                                            className="flex-1 px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg dark:text-white text-sm"
                                                        />
                                                        {urlsImagenes.length > 1 && !e.cerrado && (
                                                            <button onClick={() => handleRemoveImageUrl(idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                                <Trash2 size={20} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    {url && (
                                                        <div className="flex items-center justify-between px-1">
                                                            <a
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                                                            >
                                                                <ExternalLink size={12} />
                                                                {e.cerrado ? "Ver Evidencia del Resultado" : "Previsualizar Link"}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {!e.cerrado && (
                                                <button
                                                    onClick={handleAddImageUrl}
                                                    className="w-fit px-4 py-2 text-sm text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2"
                                                >
                                                    <Plus size={16} />
                                                    Añadir otro link de imagen
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {!e.cerrado && (
                                        <div className="flex flex-col items-center pt-8 border-t dark:border-slate-700">
                                            <button
                                                onClick={handleSave}
                                                disabled={mutation.isPending}
                                                className="px-10 py-4 bg-blue-600 text-white rounded-xl text-lg font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700"
                                            >
                                                {mutation.isPending ? "Guardando..." : "Guardar Resultado"}
                                            </button>
                                        </div>
                                    )}


                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
