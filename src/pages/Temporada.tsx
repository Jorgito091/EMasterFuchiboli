import { Trophy, Calendar, Target, TrendingUp } from "lucide-react";

export default function Temporada() {
  const temporadaActual = {
    nombre: "Temporada 2024/2025",
    jornada: 15,
    jornadasTotales: 38,
    fechaInicio: "Agosto 2024",
    fechaFin: "Mayo 2025",
  };

  const estadisticas = [
    {
      icon: Trophy,
      label: "Partidos Jugados",
      valor: "150",
      color: "blue",
    },
    {
      icon: Target,
      label: "Goles Marcados",
      valor: "425",
      color: "green",
    },
    {
      icon: TrendingUp,
      label: "Promedio de Goles",
      valor: "2.83",
      color: "orange",
    },
    {
      icon: Calendar,
      label: "Días Restantes",
      valor: "156",
      color: "purple",
    },
  ];

  const proximosPartidos = [
    {
      id: 1,
      local: "Real Madrid",
      visitante: "Barcelona",
      fecha: "20 Dic 2024",
      hora: "21:00",
      estadio: "Santiago Bernabéu",
    },
    {
      id: 2,
      local: "Manchester United",
      visitante: "Liverpool",
      fecha: "21 Dic 2024",
      hora: "15:30",
      estadio: "Old Trafford",
    },
    {
      id: 3,
      local: "Bayern Munich",
      visitante: "Borussia Dortmund",
      fecha: "22 Dic 2024",
      hora: "18:30",
      estadio: "Allianz Arena",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      blue: { bg: "bg-blue-100", text: "text-blue-700" },
      green: { bg: "bg-green-100", text: "text-green-700" },
      orange: { bg: "bg-orange-100", text: "text-orange-700" },
      purple: { bg: "bg-purple-100", text: "text-purple-700" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-900">Temporada</h2>

      {/* Información de la temporada actual */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">
              {temporadaActual.nombre}
            </h3>
            <p className="text-blue-100">
              Jornada {temporadaActual.jornada} de{" "}
              {temporadaActual.jornadasTotales}
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">
              {temporadaActual.fechaInicio} - {temporadaActual.fechaFin}
            </p>
            <div className="mt-2 bg-white bg-opacity-20 rounded-full h-2 w-48">
              <div
                className="bg-white rounded-full h-2"
                style={{
                  width: `${
                    (temporadaActual.jornada /
                      temporadaActual.jornadasTotales) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estadisticas.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.valor}
                  </p>
                </div>
                <div className={`${colors.bg} p-3 rounded-lg`}>
                  <Icon className={colors.text} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Próximos Partidos */}
      <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
          <h3 className="text-xl font-bold">Próximos Partidos</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {proximosPartidos.map((partido) => (
            <div
              key={partido.id}
              className="p-6 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-lg font-semibold text-gray-900">
                      {partido.local}
                    </span>
                    <span className="text-gray-500 font-bold">vs</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {partido.visitante}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    📍 {partido.estadio}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {partido.fecha}
                  </p>
                  <p className="text-sm text-gray-600">{partido.hora}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}