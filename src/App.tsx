import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { useAuth } from "./context/AuthContext";

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
  const { user, logout, isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState(() =>
    isAuthenticated ? "temporada" : "login"
  );
  const [selectedSeason, setSelectedSeason] = useState(() =>
    user?.temporadaId ?? 12
  );
  const [selectedTeam, setSelectedTeam] = useState<Equipo | null>(null);

  // Actualizar temporada cuando cambie el usuario
  useEffect(() => {
    if (user?.temporadaId) {
      setSelectedSeason(user.temporadaId);
    }
  }, [user?.temporadaId]);

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!isAuthenticated && activePage !== "login") {
      setActivePage("login");
    }
  }, [isAuthenticated, activePage]);

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

  const handleLogout = () => {
    // Usar logout del contexto para limpiar toda la sesión
    logout();
    setActivePage("login");
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
    transferencias: <Transferencias idTemporada={selectedSeason} />,
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
        onLogout={handleLogout}
      />

      <main className="flex-1 p-6 bg-white dark:bg-slate-800 border-l border-gray-300 dark:border-slate-700">
        {pages[activePage]}
      </main>
    </div>
  );
}

export default App;