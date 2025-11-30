// src/components/Favoritos.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

function Favoritos() {
    const [favoritos, setFavoritos] = useState([]);
    const [cargando, setCargando] = useState(true); // 👈 NUEVO

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) {
            console.log("⏳ Esperando autenticación...");
            return;
        }

        const ref = doc(db, "usuarios", user.uid);

        const unsub = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setFavoritos(data.favoritos || []);
            }
            setCargando(false); // 👈 YA CARGÓ
        });

        return () => unsub();
    }, []);

    if (cargando) {
        return (
            <section className="card favoritos">
                <h2>⭐ Favoritos</h2>
                <p>Cargando favoritos...</p>
            </section>
        );
    }

    return (
        <section className="card favoritos">
            <h2>⭐ Favoritos</h2>

            {favoritos.length === 0 ? (
                <p>No hay ciudades guardadas aún.</p>
            ) : (
                <ul>
                    {favoritos.map((city, index) => (
                        <li key={index}>{city}</li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default Favoritos;
