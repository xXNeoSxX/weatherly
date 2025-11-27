// src/components/ClimaActual.js
import React from "react";

function ClimaActual({ clima }) {
    return (
        <section className="card clima-actual">
            <h2>Clima actual {clima ? `en ${clima.name}` : "en Cancún"}</h2>
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString("es-MX")}</p>
            <p><strong>Temperatura:</strong> {clima ? `${clima.main.temp}°C` : "22°C"}</p>
            <p><strong>Condición:</strong> {clima ? clima.weather[0].description : "Parcialmente nublado"}</p>
            <p><strong>Viento:</strong> {clima ? `${Math.round(clima.wind.speed * 3.6)} km/h` : "15 km/h"}</p>
            <p><strong>Humedad:</strong> {clima ? `${clima.main.humidity}%` : "68%"}</p>
        </section>
    );
}

export default ClimaActual;
