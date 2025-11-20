import { useState } from "react";
import { User, Bell, Shield, Palette, Globe, Save } from "lucide-react";

export default function Configuracion() {
  const [formData, setFormData] = useState({
    nombre: "Administrador",
    email: "admin@fuchiboli.com",
    idioma: "es",
    tema: "claro",
    notificaciones: true,
    notificacionesEmail: false,
    autenticacion2FA: false,
  });

  const handleSave = () => {
    alert("Configuración guardada exitosamente");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-900">Configuración</h2>

      {/* Perfil de Usuario */}
      <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center gap-3">
          <User size={24} />
          <h3 className="text-xl font-bold">Perfil de Usuario</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center gap-3">
          <Bell size={24} />
          <h3 className="text-xl font-bold">Notificaciones</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                Notificaciones en la aplicación
              </p>
              <p className="text-sm text-gray-600">
                Recibe alertas dentro de la aplicación
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notificaciones}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notificaciones: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                Notificaciones por email
              </p>
              <p className="text-sm text-gray-600">
                Recibe actualizaciones por correo electrónico
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notificacionesEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notificacionesEmail: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Seguridad */}
      <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center gap-3">
          <Shield size={24} />
          <h3 className="text-xl font-bold">Seguridad</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">
                Autenticación de dos factores
              </p>
              <p className="text-sm text-gray-600">
                Agrega una capa extra de seguridad
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autenticacion2FA}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    autenticacion2FA: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Apariencia */}
      <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center gap-3">
          <Palette size={24} />
          <h3 className="text-xl font-bold">Apariencia</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <select
              value={formData.tema}
              onChange={(e) =>
                setFormData({ ...formData, tema: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="claro">Claro</option>
              <option value="oscuro">Oscuro</option>
              <option value="auto">Automático</option>
            </select>
          </div>
        </div>
      </div>

      {/* Idioma */}
      <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center gap-3">
          <Globe size={24} />
          <h3 className="text-xl font-bold">Idioma y Región</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <select
              value={formData.idioma}
              onChange={(e) =>
                setFormData({ ...formData, idioma: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
        >
          <Save size={20} />
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}