import { useState } from "react";
import type { Player } from "../types/Player";
import { Edit2, Trash2, Plus, X, Search } from "lucide-react";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [formData, setFormData] = useState<Partial<Player>>({
    nombre: "",
    posicion: "",
    edad: 0,
    nacionalidad: "",
    equipo: "",
    valor: 0,
    salario: 0,
    dorsal: 0,
  });

  const posiciones = ["Portero", "Defensa", "Centrocampista", "Delantero"];

  const filteredPlayers = players.filter(
    (player) =>
      player.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.posicion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (player?: Player) => {
    if (player) {
      setEditingPlayer(player);
      setFormData(player);
    } else {
      setEditingPlayer(null);
      setFormData({
        nombre: "",
        posicion: "",
        edad: 0,
        nacionalidad: "",
        equipo: "",
        valor: 0,
        salario: 0,
        dorsal: 0,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlayer(null);
    setFormData({
      nombre: "",
      posicion: "",
      edad: 0,
      nacionalidad: "",
      equipo: "",
      valor: 0,
      salario: 0,
      dorsal: 0,
    });
  };

  const handleSavePlayer = () => {
    if (editingPlayer) {
      // Edit existing player
      setPlayers(
        players.map((p) =>
          p.id === editingPlayer.id ? { ...formData, id: p.id } as Player : p
        )
      );
    } else {
      // Add new player
      const newPlayer: Player = {
        ...formData,
        id: Math.max(...players.map((p) => p.id), 0) + 1,
      } as Player;
      setPlayers([...players, newPlayer]);
    }
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
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus size={20} />
          Nuevo Jugador
        </button>
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
                    className={`hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors ${
                      index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-700"
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
                          onClick={() => handleOpenModal(player)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar"
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-2xl font-bold">
                {editingPlayer ? "Editar Jugador" : "Nuevo Jugador"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-blue-800 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="Ej: Lionel Messi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Posición *
                  </label>
                  <select
                    value={formData.posicion}
                    onChange={(e) =>
                      setFormData({ ...formData, posicion: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100"
                  >
                    <option value="">Seleccionar posición</option>
                    {posiciones.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Edad *
                  </label>
                  <input
                    type="number"
                    value={formData.edad}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        edad: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="Ej: 25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dorsal *
                  </label>
                  <input
                    type="number"
                    value={formData.dorsal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dorsal: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="Ej: 10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nacionalidad *
                  </label>
                  <input
                    type="text"
                    value={formData.nacionalidad}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nacionalidad: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="Ej: Argentina"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Equipo *
                  </label>
                  <input
                    type="text"
                    value={formData.equipo}
                    onChange={(e) =>
                      setFormData({ ...formData, equipo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="Ej: Barcelona"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor (€) *
                  </label>
                  <input
                    type="number"
                    value={formData.valor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        valor: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="Ej: 50000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Salario (€) *
                  </label>
                  <input
                    type="number"
                    value={formData.salario}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salario: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100"
                    placeholder="Ej: 10000000"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSavePlayer}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
                >
                  {editingPlayer ? "Guardar Cambios" : "Crear Jugador"}
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-300 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}