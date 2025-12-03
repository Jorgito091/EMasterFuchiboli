import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getEquipos } from "../services/equipos";
import type { Equipo } from "../types/auth.types";

export default function Equipos() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: equipos = [], isLoading, error } = useQuery<Equipo[]>({
    queryKey: ["equipos"],
    queryFn: getEquipos,
  });

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

  console.log("equipos recibido:", equipos, Array.isArray(equipos));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-400">Equipos</h2>

      {isLoading && <p className="text-gray-500">Cargando equipos...</p>}
      {error && <p className="text-red-500">Error al cargar equipos</p>}

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
                  className={`hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors ${index % 2 === 0 ? "bg-white dark:bg-slate-800" : "bg-gray-50 dark:bg-slate-700"
                    }`}
                >
                  <td className="px-4 py-3">
                    <img
                      src={equipo.urlEscudo}
                      alt={equipo.nombre}
                      className="w-12 h-12 rounded-lg object-cover shadow-sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {equipo.nombre}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {equipo.totalJugadores}
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600 font-medium">
                    {formatCurrency(equipo.totalPrecio)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {formatCurrency(equipo.presupuestoInicial)}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 font-medium">
                    {formatCurrency(equipo.ingresos)}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-700 font-bold">
                    {formatCurrency(equipo.presupuestoFinal)}
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