import { useState } from "react";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Temporada from "./pages/Temporada";
import Equipos from "./pages/Equipos";
import EquipoDetalle from "./pages/EquipoDetalle";
import Jugadores from "./pages/Jugadores";
import Transferencias from "./pages/Transferencias";
import Noticias from "./pages/Noticias";
import Configuracion from "./pages/Configuracion";
import type { Equipo } from "./types/auth.types";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("login");
  const [selectedSeason, setSelectedSeason] = useState(12);
  const [selectedTeam, setSelectedTeam] = useState<Equipo | null>(null);

  const navItems = [
    { id: "temporada", label: "Temporada" },
    { id: "equipos", label: "Equipos" },
    { id: "jugadores", label: "Jugadores" },
    { id: "transferencias", label: "Transferencias" },
    { id: "noticias", label: "Noticias" },
    { id: "configuracion", label: "Configuración" },
  ];

  const handleTeamSelect = (equipo: Equipo) => {
    setSelectedTeam(equipo);
    setActivePage("equipo-detalle");
  };

  const handleBackToEquipos = () => {
    setSelectedTeam(null);
    setActivePage("equipos");
  };

  const pages: Record<string, React.ReactElement> = {
    temporada: <Temporada idTemporada={selectedSeason} />,
    equipos: <Equipos idTemporada={selectedSeason} onTeamSelect={handleTeamSelect} />,
    "equipo-detalle": selectedTeam ? (
      <EquipoDetalle
        idTemporada={selectedSeason}
        idEquipo={selectedTeam.id}
        equipo={selectedTeam}
        onBack={handleBackToEquipos}
      />
    ) : (
      <Equipos idTemporada={selectedSeason} onTeamSelect={handleTeamSelect} />
    ),
    jugadores: <Jugadores />,
    transferencias: <Transferencias />,
    noticias: <Noticias />,
    configuracion: <Configuracion />,
  };

  if (activePage === "login") {
    return <Login setActivePage={setActivePage} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activePage={activePage}
        setActivePage={setActivePage}
        navItems={navItems}
        selectedSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
      />

      <main className="flex-1 p-6 bg-white dark:bg-slate-800 border-l border-gray-300 dark:border-slate-700">
        {pages[activePage]}
      </main>
    </div>
  );
}

export default App;