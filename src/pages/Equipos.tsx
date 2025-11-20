import { useState } from "react";
import { Search } from "lucide-react";

export default function Equipos() {
  const [searchTerm, setSearchTerm] = useState("");

  const equipos = [
    {
      id: 1,
      imagen: "https://cdn-icons-png.flaticon.com/512/905/905341.png",
      nombre: "Real Madrid",
      jugadores: 25,
      costoPlantilla: 850000000,
      dineroInicial: 100000000,
      ingresos: 45000000,
      dineroFinal: 145000000,
    },
    {
      id: 2,
      imagen: "https://cdn-icons-png.flaticon.com/512/905/905341.png",
      nombre: "Barcelona",
      jugadores: 26,
      costoPlantilla: 780000000,
      dineroInicial: 95000000,
      ingresos: 42000000,
      dineroFinal: 137000000,
    },
    {
      id: 3,
      imagen: "https://cdn-icons-png.flaticon.com/512/905/905341.png",
      nombre: "Manchester United",
      jugadores: 24,
      costoPlantilla: 650000000,
      dineroInicial: 120000000,
      ingresos: 38000000,
      dineroFinal: 158000000,
    },
  ];

  const filteredEquipos = equipos.filter((equipo) =>
    equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-400">Equipos</h2>

      {/* Filtro de búsqueda */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar equipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-slate-700 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Tabla de equipos */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Imagen
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Jugadores
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Costo Plantilla
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Dinero Inicial
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Ingresos
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Dinero Final
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEquipos.map((equipo, index) => (
                <tr
                  key={equipo.id}
                  className={`hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors ${
                    index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-700"
                  }`}
                >
                  <td className="px-4 py-3">
                    <img
                      src={equipo.imagen}
                      alt={equipo.nombre}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {equipo.nombre}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {equipo.jugadores}
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600 font-medium">
                    {formatCurrency(equipo.costoPlantilla)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {formatCurrency(equipo.dineroInicial)}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 font-medium">
                    {formatCurrency(equipo.ingresos)}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-700 font-bold">
                    {formatCurrency(equipo.dineroFinal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}