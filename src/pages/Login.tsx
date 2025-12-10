import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import type { UserSession } from "../types/user.types";
import emasterLogo from "../assets/emaster_logo.png";


interface LoginProps {
  setActivePage: (page: string) => void;
}

export default function Login({ setActivePage }: LoginProps) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login: authLogin } = useAuth();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login exitoso:", data);

      // Crear objeto de sesión con todos los datos requeridos
      const session: UserSession = {
        userId: data.datos.usuario.id,
        nombreUsuario: data.datos.usuario.nombreUsuario,
        administrador: data.datos.usuario.administrador,
        token: data.datos.usuario.token,
        equipo: {
          id: data.datos.usuario.equipo.id,
          nombre: data.datos.usuario.equipo.nombre,
          nombreEstadio: data.datos.usuario.equipo.nombreEstadio,
          urlEscudo: data.datos.usuario.equipo.urlEscudo,
          estatus: data.datos.usuario.equipo.estatus,
        },
        temporadaId: data.datos.temporada.id,
        version: "3.0",
      };

      // Almacenar sesión en el contexto global
      authLogin(session);
      setActivePage("temporada");
    },
    onError: (err) => {
      console.error("Login fallido:", err);
      setError("Credenciales incorrectas o error en el servidor");
    },
  });

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleLogin = async () => {
    if (!usuario || !password) {
      setError("Por favor ingrese usuario y contraseña");
      return;
    }
    setError("");

    const hashedPassword = await hashPassword(password);

    loginMutation.mutate({
      usuario,
      contraseña: hashedPassword,
      dispositivo: "postman",
    });
  };


  return (

    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-slate-900 p-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-3xl p-10 flex">

        {/* Formulario */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Iniciar Sesión
          </h1>

          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg mb-4 focus:ring focus:ring-blue-300 dark:bg-slate-700 dark:text-gray-100 dark:placeholder-gray-400"
          />


          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg mb-6 focus:ring focus:ring-blue-300 dark:bg-slate-700 dark:text-gray-100 dark:placeholder-gray-400"
          />

          {error && (
            <div className="mb-4 text-red-500 text-sm font-medium">
              {error}
            </div>
          )}

          {loginMutation.isError && (
            <div className="mb-4 text-red-500 text-sm font-medium">
              Error al conectar con el servidor
            </div>
          )}


          <button
            onClick={handleLogin}
            disabled={loginMutation.isPending}
            className={`w-full bg-blue-600 dark:bg-blue-700 text-white p-3 rounded-lg text-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition ${loginMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loginMutation.isPending ? "Cargando..." : "Entrar"}
          </button>

        </div>

        {/* Imagen */}
        <div className="flex-1 flex justify-center items-center">
          <img src={emasterLogo} alt="EMaster League" className="w-48 h-48 opacity-90" />
        </div>
      </div>
    </div>
  );
}