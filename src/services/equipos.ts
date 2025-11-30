import type { Equipo } from "./auth";

export const getEquipos = async (): Promise<Equipo[]> => {
    let token = localStorage.getItem("token");
    let usuario = localStorage.getItem("usuario") ?? "";
    let dispositivo = localStorage.getItem("dispositivo") ?? "postman";

    console.log("Token retrieved:", token);

    if (!token) {
        console.error("No token found");
        throw new Error("No authenticated user");
    }

    token = token.replace(/"/g, "");

    const response = await fetch("/api/equipos/obtener", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": token || "",
            "usuario": usuario || "",
            "dispositivo": dispositivo,
            "version": "3.0",
            "tipo-app": "app"
        }
    });

    if (!response.ok) {
        console.error(await response.text());
        throw new Error("Error al obtener los equipos");
    }

    const data = await response.json();
    return data.datos || data;


};
