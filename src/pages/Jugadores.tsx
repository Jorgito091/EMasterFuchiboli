import { useState } from "react";
import type { Player } from "../types/Player";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PlayerProfileModal from "../components/PlayerProfileModal";

export default function Jugadores() {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      nombre: "Lionel Messi",
      posicion: "Delantero",
      edad: 36,
      nacionalidad: "Argentina",
      equipo: "Inter Miami",
      valor: 35000000,
      salario: 20000000,
      dorsal: 10,
    },
    {
      id: 2,
      nombre: "Cristiano Ronaldo",
      posicion: "Delantero",
      edad: 39,
      nacionalidad: "Portugal",
      equipo: "Al-Nassr",
      valor: 15000000,
      salario: 75000000,
      dorsal: 7,
    },
    {
      id: 3,
      nombre: "Kylian Mbappé",
      posicion: "Delantero",
      edad: 25,
      nacionalidad: "Francia",
      equipo: "Real Madrid",
      valor: 180000000,
      salario: 25000000,
      dorsal: 9,
    },
  ]);

  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"capture" | "read">("read");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | undefined>(undefined);

  const filteredPlayers = players.filter(
    (player) =>
      player.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    // Refresh list logic here if/when we implement API list fetching
    handleCloseModal();
  };

  const handleDeletePlayer = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este jugador?")) {
      setPlayers(players.filter((p) => p.id !== id));
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(value);
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
            placeholder="Buscar por nombre, equipo o posición..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Players Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Dorsal
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Posición
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Edad
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Nacionalidad
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Equipo
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Valor
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Salario
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPlayers.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No se encontraron jugadores
                  </td>
                </tr>
              ) : (
                filteredPlayers.map((player, index) => (
                  <tr
                    key={player.id}
                    className={`hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors ${index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-700"
                      }`}
                  >
                    <td className="px-4 py-3 text-sm font-bold text-blue-900 dark:text-blue-400">
                      {player.dorsal}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {player.nombre}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {player.posicion}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {player.edad}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {player.nacionalidad}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {player.equipo}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-600 font-medium">
                      {formatCurrency(player.valor)}
                    </td>
                    <td className="px-4 py-3 text-sm text-orange-600 font-medium">
                      {formatCurrency(player.salario)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenRead(player.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Ver Detalles"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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