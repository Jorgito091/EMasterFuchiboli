/**
 * Sidebar Component
 * Barra lateral de navegación principal de la aplicación
 * Incluye: selector de temporadas, navegación entre páginas y logout
 */

import { useState, useRef, useEffect } from "react";
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
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTotalTemporadas } from "../services/temporadas";

/**
 * Props del componente Sidebar
 */
interface SidebarProps {
  /** Estado de expansión del sidebar */
  isSidebarOpen: boolean;
  /** ID de la página actualmente activa */
  activePage: string;
  /** Callback para cambiar la página activa */
  setActivePage: (page: string) => void;
  /** Callback para expandir/colapsar el sidebar */
  toggleSidebar: () => void;
  /** Lista de items de navegación */
  navItems: { id: string; label: string }[];
  /** Temporada seleccionada actualmente */
  selectedSeason: number;
  /** Callback cuando cambia la temporada seleccionada */
  onSeasonChange: (season: number) => void;
  /** Callback para cerrar sesión */
  onLogout: () => void;
}

/**
 * Mapeo de IDs de página a iconos de Lucide
 */
const icons: Record<string, LucideIcon> = {
  temporada: Calendar,
  equipos: Users,
  jugadores: User,
  transferencias: Repeat,
  noticias: FileText,
  configuracion: Settings,
};

/**
 * Componente Sidebar
 * Renderiza la barra lateral con navegación y selector de temporadas
 * 
 * @example
 * ```tsx
 * <Sidebar
 *   isSidebarOpen={true}
 *   activePage="temporada"
 *   setActivePage={setPage}
 *   toggleSidebar={toggle}
 *   navItems={items}
 *   selectedSeason={13}
 *   onSeasonChange={setSeason}
 *   onLogout={handleLogout}
 * />
 * ```
 */
export default function Sidebar({
  isSidebarOpen,
  activePage,
  setActivePage,
  toggleSidebar,
  navItems,
  selectedSeason,
  onSeasonChange,
  onLogout,
}: SidebarProps) {
  // State for dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Query para obtener el total de temporadas desde el API
   * - Se cachea por 1 hora para evitar llamadas innecesarias
   * - Valor por defecto: 13 (fallback si el API falla)
   */
  const { data: totalTemporadas = 13 } = useQuery({
    queryKey: ["totalTemporadas"],
    queryFn: getTotalTemporadas,
    staleTime: 1000 * 60 * 60, // Cache por 1 hora
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSeasonSelect = (season: number) => {
    onSeasonChange(season);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className={`${isSidebarOpen ? "w-64" : "w-16"
        } bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          {isSidebarOpen && (
            <span className="font-semibold text-blue-900 dark:text-blue-400 text-lg">EMaster Fuchiboli</span>
          )}

          <button onClick={toggleSidebar} className="hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded-lg text-gray-700 dark:text-gray-300">
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Custom Season Dropdown */}
        {isSidebarOpen && (
          <div className="relative" ref={dropdownRef}>
            {/* Dropdown Trigger Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white rounded-full border border-blue-600/30 shadow-lg shadow-blue-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            >
              <span className="font-medium text-sm">Temporada {selectedSeason}</span>
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl shadow-black/30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {Array.from({ length: totalTemporadas }, (_, i) => totalTemporadas - i).map((num) => (
                    <button
                      key={num}
                      onClick={() => handleSeasonSelect(num)}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 ${num === selectedSeason
                          ? "bg-blue-600 text-white font-medium"
                          : "text-gray-300 hover:bg-slate-700 hover:text-white"
                        }`}
                    >
                      Temporada {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
              className={`flex items-center w-full gap-3 p-2 rounded-lg transition ${active
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
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg w-full justify-center transition-colors"
        >
          <LogOut size={18} />
          {isSidebarOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
}