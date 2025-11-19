import fuchibola from "../assets/fuchibola.png";

interface LoginProps {
  setActivePage: (page: string) => void;
}

export default function Login({ setActivePage }: LoginProps) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-10 flex">

        {/* --- FORMULARIO IZQUIERDA --- */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Iniciar Sesión
          </h1>

          <input
            type="text"
            placeholder="Usuario"
            className="w-full p-3 border rounded-lg mb-4 focus:ring focus:ring-blue-300"
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 border rounded-lg mb-6 focus:ring focus:ring-blue-300"
          />

          <button
            onClick={() => setActivePage("temporada")}
            className="w-full bg-blue-600 text-white p-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Entrar
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