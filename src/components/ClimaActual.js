import React from "react";
import { db, auth } from "../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

function ClimaActual({ clima }) {
    const agregarFavorito = async () => {
        if (!clima) return;

        const user = auth.currentUser;
        if (!user) {
            alert("Usuario no identificado aún");
            return;
        }

        const userRef = doc(db, "usuarios", user.uid);

        try {
            await updateDoc(userRef, { favoritos: arrayUnion(clima.name) });
            alert(`⭐ ${clima.name} añadido a favoritos!`);
        } catch (err) {
            console.error("Error añadiendo favorito:", err);
            alert("❌ No se pudo añadir a favoritos (revisa reglas de Firestore)");
        }
    };

    return (
        <section className="card clima-actual">
            <h2>Clima actual {clima ? `en ${clima.name}` : "en Cancún"}</h2>
            <p>
                <strong>Fecha:</strong> {new Date().toLocaleDateString("es-MX")}
            </p>
            <p>
                <strong>Temperatura:</strong> {clima ? `${clima.main.temp}°C` : "22°C"}
            </p>
            <p>
                <strong>Condición:</strong> {clima ? clima.weather[0].description : "Parcialmente nublado"}
            </p>
            <p>
                <strong>Viento:</strong> {clima ? `${Math.round(clima.wind.speed * 3.6)} km/h` : "15 km/h"}
            </p>
            <p>
                <strong>Humedad:</strong> {clima ? `${clima.main.humidity}%` : "68%"}
            </p>

            {clima && (
                <div style={{ marginTop: 12 }}>
                    <button className="btn-guardar" onClick={agregarFavorito}>
                        Añadir a favoritos
                    </button>
                </div>
            )}
        </section>
    );
}

export default ClimaActual;
