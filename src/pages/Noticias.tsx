import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Noticia {
  id: number;
  titulo: string;
  descripcion: string;
  contenido: string;
  bannerLg: string;
  bannerSm: string;
}

export default function Noticias() {
  const [selectedNew, setSelectedNew] = useState<Noticia | null>(null);

  const noticias = [
    {
      id: 1,
      titulo: "Mucho Texto",
      descripcion: "Mucho texto para la descripción de la noticia...",
      contenido: `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Pellentesque nec arcu non libero tristique ultricies.
        Vestibulum in fermentum erat, id malesuada neque.
        Phasellus eget arcu sem. Nulla facilisi.
        Donec lobortis justo nec lectus fermentum efficitur.
        Nulla sit amet dolor eget velit pretium posuere.
        Cras vitae turpis tellus. Vivamus in pharetra dolor.
        Sed mattis nibh sit amet mi posuere, vel facilisis ipsum pretium.

        Mauris elementum tristique orci, vitae scelerisque magna imperdiet vitae.
        Donec malesuada, sem id gravida fermentum, odio quam posuere libero,
        ut viverra neque nisl vel eros. Nullam pretium turpis libero,
        vitae suscipit ex viverra et.

        Sed elementum vestibulum posuere. Curabitur non mi a neque eleifend
        vulputate id non eros. Mauris egestas odio turpis, ut luctus arcu
        viverra ac. Aliquam erat volutpat. Aliquam eget enim sed turpis 
        rhoncus laoreet. Donec luctus tincidunt tortor eget sodales.
      `,
      bannerLg: "src/assets/login_bg.jpg",
      bannerSm: "src/assets/login_bg.jpg",
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-blue-900">Noticias</h2>

      <AnimatePresence mode="wait">
        {/* LISTA DE NOTICIAS */}
        {!selectedNew && (
          <motion.div
            key="lista"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-blue-100 shadow-sm p-4"
          >
            <ul className="space-y-4">
              {noticias.map((n) => (
                <li
                  key={n.id}
                  onClick={() => setSelectedNew(n)}
                  className="p-4 border rounded-xl cursor-pointer hover:bg-gray-100 transition flex items-center space-x-4"
                >
                  <img
                    src={n.bannerSm}
                    className="w-16 h-16 rounded-lg object-cover"
                    alt="thumb"
                  />

                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">
                      {n.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm">{n.descripcion}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* NOTICIA ABIERTA */}
        {selectedNew && (
          <motion.div
            key="detalle"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="
                bg-white rounded-xl border border-blue-100 shadow-sm p-6 relative
                min-h-[80vh] max-h-[80vh] overflow-y-auto pr-4
            "
          >
            {/* Flecha volver */}
            <button
              onClick={() => setSelectedNew(null)}
              className="mb-4 text-blue-600 text-2xl hover:text-blue-800"
            >
              ←
            </button>

            {/* BANNER GRANDE */}
            <div className="w-full mb-4 hidden md:block relative h-40 overflow-hidden rounded-xl">
              <img
                src={selectedNew.bannerLg}
                className="w-full h-full object-cover opacity-80"
                alt="banner grande"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90"></div>
            </div>

            {/* Banner lateral fijo para pantallas pequeñas */}
            <div className="fixed bottom-4 right-4 w-32 md:hidden">
              <img
                src={selectedNew.bannerSm}
                className="rounded-xl shadow-lg"
                alt="banner lateral"
              />
            </div>

            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              {selectedNew.titulo}
            </h2>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {selectedNew.contenido}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}