export default function Equipos() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-blue-900">Equipos</h2>

      {/* Filtro de búsqueda */}
      <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
        <input
          type="text"
          placeholder="Buscar equipo..."
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Tabla de equipos */}
      <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3">Imagen</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Jugadores</th>
              <th className="p-3">Costo Plantilla</th>
              <th className="p-3">Dinero Inicial</th>
              <th className="p-3">Ingresos</th>
              <th className="p-3">Dinero Final</th>
            </tr>
          </thead>
          <tbody>
            {/* Ejemplo de fila */}
            <tr className="border-b hover:bg-gray-50">
              <td className="p-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/905/905341.png"
                  alt="Equipo"
                  className="w-12 h-12 rounded-lg"
                />
              </td>
              <td className="p-3">Equipo Ejemplo</td>
              <td className="p-3">23</td>
              <td className="p-3">$150M</td>
              <td className="p-3">$50M</td>
              <td className="p-3">$20M</td>
              <td className="p-3">$70M</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}