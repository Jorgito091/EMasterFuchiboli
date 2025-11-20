import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

export default function Transferencias() {
  const transferencias = [
    {
      id: 1,
      jugador: "Jude Bellingham",
      equipoOrigen: "Borussia Dortmund",
      equipoDestino: "Real Madrid",
      monto: 103000000,
      fecha: "14 Jun 2023",
      tipo: "Compra",
    },
    {
      id: 2,
      jugador: "Harry Kane",
      equipoOrigen: "Tottenham",
      equipoDestino: "Bayern Munich",
      monto: 95000000,
      fecha: "12 Ago 2023",
      tipo: "Compra",
    },
    {
      id: 3,
      jugador: "Declan Rice",
      equipoOrigen: "West Ham",
      equipoDestino: "Arsenal",
      monto: 116000000,
      fecha: "15 Jul 2023",
      tipo: "Compra",
    },
    {
      id: 4,
      jugador: "Ousmane Dembélé",
      equipoOrigen: "Barcelona",
      equipoDestino: "PSG",
      monto: 50000000,
      fecha: "11 Ago 2023",
      tipo: "Venta",
    },
    {
      id: 5,
      jugador: "Moisés Caicedo",
      equipoOrigen: "Brighton",
      equipoDestino: "Chelsea",
      monto: 116000000,
      fecha: "14 Ago 2023",
      tipo: "Compra",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalCompras = transferencias
    .filter((t) => t.tipo === "Compra")
    .reduce((sum, t) => sum + t.monto, 0);
  
  const totalVentas = transferencias
    .filter((t) => t.tipo === "Venta")
    .reduce((sum, t) => sum + t.monto, 0);
  
  const balance = totalVentas - totalCompras;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-400">Transferencias</h2>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-red-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Compras</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(totalCompras)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Ventas</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalVentas)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs(balance))}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de transferencias */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
          <h3 className="text-xl font-bold">Historial de Transferencias</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {transferencias.map((transferencia) => (
            <div
              key={transferencia.id}
              className="p-6 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {transferencia.jugador}
                  </h4>
                  <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span className="font-medium">
                      {transferencia.equipoOrigen}
                    </span>
                    <ArrowRight size={18} className="text-blue-600" />
                    <span className="font-medium">
                      {transferencia.equipoDestino}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xl font-bold mb-1 ${
                      transferencia.tipo === "Compra"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {transferencia.tipo === "Compra" ? "-" : "+"}
                    {formatCurrency(transferencia.monto)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{transferencia.fecha}</p>
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      transferencia.tipo === "Compra"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {transferencia.tipo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}