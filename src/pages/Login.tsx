import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../services/auth";
import fuchibola from "../assets/fuchibola.png";


interface LoginProps {
  setActivePage: (page: string) => void;
}

export default function Login({ setActivePage }: LoginProps) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("Login exitoso:", data);
      if (data.datos.usuario.token) {
        localStorage.setItem("token", data.datos.usuario.token);
        localStorage.setItem("usuario", data.datos.usuario.nombreUsuario);
        localStorage.setItem("dispositivo", "postman");
        localStorage.setItem("version", data.datos.usuario.version)
      }
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

        {/* --- FORMULARIO IZQUIERDA --- */}
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

        {/* --- IMAGEN DERECHA --- */}
        <div className="flex-1 flex justify-center items-center">
          <img src={fuchibola} alt="Pelota" className="w-48 h-48 opacity-90" />
        </div>
      </div>
    </div>
  );
}