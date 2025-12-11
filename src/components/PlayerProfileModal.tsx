import { useState, useEffect } from "react";
import { X, Search, Save, Edit2, Lock, Unlock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { PlayersService } from "../services/jugadores";
import type { JugadorDTO, JugadorDetalleResponse } from "../types/player-dto.types";
// import toast from "react-hot-toast";

interface PlayerProfileModalProps {
    isOpen: boolean;
    mode: "capture" | "read";
    playerId?: number;
    onClose: () => void;
    onSave?: () => void;
}

const INITIAL_FORM_DATA: JugadorDTO = {
    id: 0,
    nombre: "",
    apodo: "",
    media: 0,
    salario: 0,
    potencial: 0,
    edad: 0,
    urlImagen: "",
    url: "",
    posicion: "",
    precio: 0,
    fechaNacimiento: null,
};

// Map property name mismatch if necessary, or just rely on API compatibility
// The DTO has 'precio' but the form might display it as 'Valor'

export default function PlayerProfileModal({
    isOpen,
    mode,
    playerId,
    onClose,
    onSave,
}: PlayerProfileModalProps) {
    const { isAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [searchId, setSearchId] = useState("");
    const [formData, setFormData] = useState<JugadorDTO>(INITIAL_FORM_DATA);
    const [playerDetail, setPlayerDetail] = useState<JugadorDetalleResponse | null>(null);
    const [isEditing, setIsEditing] = useState(mode === "capture");

    // Reset state when modal opens/closes or mode changes
    useEffect(() => {
        if (isOpen) {
            if (mode === "read" && playerId) {
                fetchPlayerDetail(playerId);
                setIsEditing(false);
            } else if (mode === "capture") {
                setFormData(INITIAL_FORM_DATA);
                setPlayerDetail(null);
                setSearchId("");
                setIsEditing(true);
            }
        }
    }, [isOpen, mode, playerId]);

    const fetchPlayerDetail = async (id: number) => {
        setLoading(true);
        try {
            const data = await PlayersService.getJugadorDetalle(id);
            setPlayerDetail(data);

            // Populate form data in case we want to edit
            setFormData({
                id: data.id,
                nombre: data.nombre,
                apodo: data.apodo,
                media: data.media,
                salario: data.salario,
                potencial: data.potencial,
                edad: data.edad,
                urlImagen: data.urlImagen,
                url: data.url,
                posicion: data.posicion,
                precio: data.precio,
                fechaNacimiento: data.fechaNacimiento,
            });
        } catch (error) {
            console.error("Error al cargar datos del jugador", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchId) return;

        const idToCheck = parseInt(searchId);
        if (isNaN(idToCheck)) {
            alert("El ID debe ser un número");
            return;
        }

        setLoading(true);
        try {
            // In capture mode, we search to see if player exists to populate form, 
            // otherwise we just set the ID for a new player
            try {
                const data = await PlayersService.getJugadorDetalle(idToCheck);
                setPlayerDetail(data);
                setFormData({
                    id: data.id,
                    nombre: data.nombre,
                    apodo: data.apodo,
                    media: data.media,
                    salario: data.salario,
                    potencial: data.potencial,
                    edad: data.edad,
                    urlImagen: data.urlImagen,
                    url: data.url,
                    posicion: data.posicion,
                    precio: data.precio,
                    fechaNacimiento: data.fechaNacimiento,
                });
                alert("Jugador encontrado");
            } catch {
                // Player not found, that's okay in capture mode - we might be creating a new one
                // But typically for this specific requirement, it implies searching existing database to update/fix?
                // The requirement says: "La API hará la función de validación de existencia de jugador por medio de ID"
                // So we just set the ID and let user fill rest if not found? 
                // Or maybe we treat 'not found' as just setting the ID in the form.

                // If the search fails (404), we assume it's a new player or just initialize with ID
                setPlayerDetail(null);
                setFormData({ ...INITIAL_FORM_DATA, id: idToCheck });
                alert("ID asignado para nuevo registro");
            }
        } catch (error) {
            alert("Error en la búsqueda");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!formData.nombre) return alert("El nombre es obligatorio");
        if (formData.media < 0 || formData.media > 99) return alert("La media debe estar entre 0 y 99");
        if (formData.potencial < 0 || formData.potencial > 99) return alert("El potencial debe estar entre 0 y 99");

        setLoading(true);
        try {
            await PlayersService.saveJugador(formData);
            alert("Jugador guardado correctamente");
            if (onSave) onSave();

            // If in read mode (editing), refresh data
            if (mode === "read") {
                setIsEditing(false);
                fetchPlayerDetail(formData.id);
            }
        } catch (error) {
            alert("Error al guardar jugador");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFormData(INITIAL_FORM_DATA);
        setPlayerDetail(null);
        setSearchId("");
        setIsEditing(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl shadow-md">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        {mode === "capture" ? "Captura de Jugador" : "Perfil de Jugador"}
                        {mode === "capture" && <span className="text-xs bg-blue-800 px-2 py-1 rounded text-blue-200">Admin Mode</span>}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-blue-800 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {/* Search Section (Capture Mode Only) */}
                    {mode === "capture" && (
                        <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Buscar por ID de Jugador
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    placeholder="Ingrese ID..."
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                                />
                                <button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Search size={20} />
                                    Buscar
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-slate-600 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
                                >
                                    Limpiar
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Image & Basic Info */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Player Image */}
                            <div className="aspect-[3/4] bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden relative shadow-inner flex items-center justify-center border border-gray-200 dark:border-slate-600">
                                {formData.urlImagen ? (
                                    <img
                                        src={formData.urlImagen}
                                        alt={formData.nombre}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=No+Image';
                                        }}
                                    />
                                ) : (
                                    <div className="text-center text-gray-400 p-4">
                                        <div className="mb-2">No Image</div>
                                        <div className="text-xs">Ingrese URL de imagen</div>
                                    </div>
                                )}

                                {/* Status Badge (Read Mode) */}
                                {mode === "read" && playerDetail && (
                                    <div className="absolute top-2 right-2">
                                        {playerDetail.bloqueado ? (
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                <Lock size={12} /> Bloqueado
                                            </span>
                                        ) : (
                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                <Unlock size={12} /> Transferible
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Team Info (Read Mode) */}
                            {mode === "read" && playerDetail && (
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
                                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Equipo Actual</h4>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={playerDetail.urlEscudo}
                                            alt={playerDetail.nombreEquipo}
                                            className="w-12 h-12 object-contain"
                                            referrerPolicy="no-referrer"
                                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                        />
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white">{playerDetail.nombreEquipo}</div>
                                            {playerDetail.clausulaRecision && (
                                                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-1">
                                                    Cláusula de Rescisión Activa
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Form Fields */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* ID Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Jugador</label>
                                    <input
                                        type="number"
                                        value={formData.id || ""}
                                        onChange={(e) => setFormData({ ...formData, id: parseInt(e.target.value) || 0 })}
                                        disabled={mode === "read" && !isEditing} // ID usually shouldn't change in edit mode either, but staying flexible
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-60"
                                    />
                                </div>

                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-60"
                                    />
                                </div>

                                {/* Apodo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apodo</label>
                                    <input
                                        type="text"
                                        value={formData.apodo}
                                        onChange={(e) => setFormData({ ...formData, apodo: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-60"
                                    />
                                </div>

                                {/* Posición */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Posición</label>
                                    <input
                                        type="text"
                                        value={formData.posicion}
                                        onChange={(e) => setFormData({ ...formData, posicion: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-60"
                                    />
                                </div>

                                {/* Fecha Nacimiento */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Nacimiento</label>
                                    <input
                                        type="date"
                                        value={formData.fechaNacimiento ? new Date(formData.fechaNacimiento).toISOString().split('T')[0] : ""}
                                        onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-60"
                                    />
                                </div>

                                {/* Edad */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Edad</label>
                                    <input
                                        type="number"
                                        value={formData.edad}
                                        onChange={(e) => setFormData({ ...formData, edad: parseInt(e.target.value) || 0 })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-60"
                                    />
                                </div>

                                {/* Media */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Media (0-99)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="99"
                                        value={formData.media}
                                        onChange={(e) => setFormData({ ...formData, media: parseInt(e.target.value) || 0 })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-60"
                                    />
                                </div>

                                {/* Potencial */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Potencial (0-99)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="99"
                                        value={formData.potencial}
                                        onChange={(e) => setFormData({ ...formData, potencial: parseInt(e.target.value) || 0 })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-60"
                                    />
                                </div>

                                {/* Valor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor (€)</label>
                                    <input
                                        type="number"
                                        value={formData.precio} // Mapping precio to Valor as per DTO
                                        onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-60"
                                    />
                                </div>

                                {/* Salario */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salario (€)</label>
                                    <input
                                        type="number"
                                        value={formData.salario}
                                        onChange={(e) => setFormData({ ...formData, salario: parseFloat(e.target.value) || 0 })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-60"
                                    />
                                </div>

                                {/* URL Imagen */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Imagen</label>
                                    <input
                                        type="text"
                                        value={formData.urlImagen}
                                        onChange={(e) => setFormData({ ...formData, urlImagen: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-60"
                                    />
                                </div>

                                {/* URL Jugador (Source) */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL de Jugador</label>
                                    <input
                                        type="text"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            {/* Actions Area */}
                            <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-slate-700 mt-6">
                                {isEditing ? (
                                    <>
                                        {mode === "read" && (
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                Cancelar Edición
                                            </button>
                                        )}
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
                                        >
                                            <Save size={18} />
                                            Guardar Guardar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {isAdmin && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
                                            >
                                                <Edit2 size={18} />
                                                Editar Información
                                            </button>
                                        )}
                                        {/* Transfer button (Future functionality) */}
                                        <button
                                            disabled
                                            className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center gap-2"
                                            title="Funcionalidad próximamente"
                                        >
                                            Transferir
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
