import type { FC, SVGProps } from "react";

interface Props {
  id: string;
  label: string;
  icon: FC<SVGProps<SVGSVGElement>>; // ← AQUÍ LA CORRECCIÓN
  isActive: boolean;
  isSidebarOpen: boolean;
  onClick: (id: string) => void;
}

export default function SidebarItem({
  id,
  label,
  icon: Icon,
  isActive,
  isSidebarOpen,
  onClick,
}: Props) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center w-full gap-3 p-2.5 rounded-lg transition-colors ${
        isActive
          ? "bg-blue-900 text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-blue-900"
      }`}
    >
      <Icon width={18} height={18} className={isActive ? "text-white" : "text-gray-500"} />
      {isSidebarOpen && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}