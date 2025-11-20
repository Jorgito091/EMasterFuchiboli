import {
  Calendar,
  Users,
  User,
  Repeat,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SidebarProps {
  isSidebarOpen: boolean;
  activePage: string;
  setActivePage: (page: string) => void;
  toggleSidebar: () => void;
  navItems: { id: string; label: string }[];
}

const icons: Record<string, LucideIcon> = {
  temporada: Calendar,
  equipos: Users,
  jugadores: User,
  transferencias: Repeat,
  noticias: FileText,
  configuracion: Settings,
};

export default function Sidebar({
  isSidebarOpen,
  activePage,
  setActivePage,
  toggleSidebar,
  navItems,
}: SidebarProps) {
  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-16"
      } bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
        {isSidebarOpen && (
          <span className="font-semibold text-blue-900 dark:text-blue-400 text-lg">EMaster Fuchiboli</span>
        )}

        <button onClick={toggleSidebar} className="hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded-lg text-gray-700 dark:text-gray-300">
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = icons[item.id];
          const active = item.id === activePage;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center w-full gap-3 p-2 rounded-lg transition ${
                active
                  ? "bg-blue-900 dark:bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon size={18} />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200 dark:border-slate-700">
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg w-full justify-center">
          <LogOut size={18} />
          {isSidebarOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
}