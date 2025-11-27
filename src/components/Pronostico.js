// src/components/Pronostico.js
import React from "react";

function Pronostico({ pronostico }) {
    const convertirIcono = (clima) => {
        switch (clima) {
            case "Clear": return "☀️";
            case "Clouds": return "☁️";
            case "Rain": return "🌧️";
            case "Thunderstorm": return "⛈️";
            case "Drizzle": return "🌦️";
            case "Snow": return "❄️";
            default: return "⛅";
        }
    };

    return (
        <section className="card pronostico">
            <h2>Pronóstico de la semana</h2>
            <ul className="lista-pronostico">
                {pronostico.length ? (
                    pronostico.map((dia, index) => (
                        <li key={index}>
                            <span>{new Date(dia.dt * 1000).toLocaleDateString("es-MX", { weekday: "long" })}</span>
                            <span>{convertirIcono(dia.weather[0].main)}</span>
                            <span>{Math.round(dia.main.temp)}°C</span>
                        </li>
                    ))
                ) : (
                    <>
                        <li><span>Lunes</span><span>☀️</span><span>20°C</span></li>
                        <li><span>Martes</span><span>☁️</span><span>22°C</span></li>
                        <li><span>Miércoles</span><span>🌧️</span><span>19°C</span></li>
                        <li><span>Jueves</span><span>🌤️</span><span>23°C</span></li>
                        <li><span>Viernes</span><span>🌦️</span><span>21°C</span></li>
                        <li><span>Sábado</span><span>🌧️</span><span>18°C</span></li>
                        <li><span>Domingo</span><span>⛅</span><span>22°C</span></li>
                    </>
                )}
            </ul>
        </section>
    );
}

export default Pronostico;
