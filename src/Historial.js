// src/components/Historial.js
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, auth } from "../firebase"; // asegúrate de que exportas db y auth en firebase.js

function Historial() {
    const [registros, setRegistros] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Esperar a que FirebaseAuth detecte el usuario anónimo
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (!user) return;

            const ref = collection(db, "usuarios", user.uid, "consultas");
            const q = query(ref, orderBy("fecha", "desc"));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const datos = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setRegistros(datos);
                setCargando(false);
            });

            // Cleanup
            return () => unsubscribe();
        });

        return () => unsubscribeAuth();
    }, []);

    if (cargando) {
        return <p>Cargando historial...</p>;
    }

    return (
        <section className="card historial">
            <h2>Historial de consultas</h2>

            {registros.length === 0 ? (
                <p>No tienes consultas aún.</p>
            ) : (
                <ul>
                    {registros.map((item) => (
                        <li key={item.id} className="historial-item">
                            <strong>{item.ciudad}</strong> — {item.temperatura}°C
                            <br />
                            <small>{new Date(item.fecha?.toDate()).toLocaleString("es-MX")}</small>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default Historial;
