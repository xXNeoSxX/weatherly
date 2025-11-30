import { useState, useEffect } from "react";
import Header from "./components/Header";
import ClimaActual from "./components/ClimaActual";
import Pronostico from "./components/Pronostico";
import Favoritos from "./components/Favoritos";
import Historial from "./components/Historial";
import Footer from "./components/Footer";
import "./App.css";

// Firebase
import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc, updateDoc, increment, getDoc } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

const API_KEY = "9d15fcea649875c175138c3e69398334";

function App() {
  const [ciudad, setCiudad] = useState("");
  const [clima, setClima] = useState(null);
  const [pronostico, setPronostico] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [user, setUser] = useState(null);

  useEffect(() => {
    signInAnonymously(auth).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const userRef = doc(db, "usuarios", u.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            createdAt: serverTimestamp(),
            favoritos: [],
            consultasHoy: 0,
            limiteUso: 1000
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const guardarConsultaCompleta = async (dataClima) => {
    try {
      // Guardado global
      await addDoc(collection(db, "consultas"), {
        ciudad: dataClima.name,
        temperatura: dataClima.main.temp,
        condicion: dataClima.weather[0].description,
        viento: dataClima.wind.speed,
        humedad: dataClima.main.humidity,
        fecha: serverTimestamp()
      });

      // Guardado por usuario
      if (user) {
        await addDoc(collection(db, `usuarios/${user.uid}/consultas`), {
          ciudad: dataClima.name,
          temperatura: dataClima.main.temp,
          condicion: dataClima.weather[0].description,
          fecha: serverTimestamp()
        });
        const userRef = doc(db, "usuarios", user.uid);
        await updateDoc(userRef, { consultasHoy: increment(1) });
      }

      // Estadísticas globales
      const statsRef = doc(db, "estadisticas", "global");
      await setDoc(statsRef, { totalConsultas: increment(1) }, { merge: true });

      // Cache por ciudad
      const cacheRef = doc(db, "cache", dataClima.name.toLowerCase());
      await setDoc(cacheRef, { data: dataClima, guardadoEn: serverTimestamp() });

      console.log("Consulta guardada correctamente");
    } catch (err) {
      console.error("Error guardando consulta:", err);
    }
  };

  const obtenerClima = async (nombreCiudad) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(nombreCiudad)}&appid=${API_KEY}&units=metric&lang=es`
    );
    if (!res.ok) throw new Error("Ciudad no encontrada");
    return res.json();
  };

  const obtenerPronostico = async (lat, lon) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
    );
    if (!res.ok) throw new Error("No se pudo obtener el pronóstico");
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ciudad) return;

    try {
      const dataClima = await obtenerClima(ciudad);
      setClima(dataClima);

      await guardarConsultaCompleta(dataClima);

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
        {user && <Favoritos />}
        {user && <Historial />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
