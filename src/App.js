// src/App.js
import { useState, useEffect } from "react";
import Header from "./components/Header";
import ClimaActual from "./components/ClimaActual";
import Pronostico from "./components/Pronostico";
import Footer from "./components/Footer";
import "./App.css";

const API_KEY = "9d15fcea649875c175138c3e69398334";

function App() {
  const [ciudad, setCiudad] = useState("");
  const [clima, setClima] = useState(null);
  const [pronostico, setPronostico] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  // Actualizar clase dark-mode en <body>
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const obtenerClima = async (nombreCiudad) => {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(nombreCiudad)}&appid=${API_KEY}&units=metric&lang=es`);
    if (!res.ok) throw new Error("Ciudad no encontrada");
    return res.json();
  };

  const obtenerPronostico = async (lat, lon) => {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`);
    if (!res.ok) throw new Error("No se pudo obtener el pronóstico");
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ciudad) return;

    try {
      const dataClima = await obtenerClima(ciudad);
      setClima(dataClima);

      const { lat, lon } = dataClima.coord;
      const dataPronostico = await obtenerPronostico(lat, lon);
      const dias = dataPronostico.list.filter(item => item.dt_txt.includes("12:00:00"));
      setPronostico(dias);

      setCiudad("");
    } catch (error) {
      alert("❌ No se pudo encontrar la ciudad o hubo un error de red.");
      console.error(error);
    }
  };

  return (
    <div>
      <Header ciudad={ciudad} setCiudad={setCiudad} handleSubmit={handleSubmit} darkMode={darkMode} toggleTheme={toggleTheme} />
      <main>
        <ClimaActual clima={clima} />
        <Pronostico pronostico={pronostico} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
