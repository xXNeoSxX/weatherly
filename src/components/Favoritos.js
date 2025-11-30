// src/components/Favoritos.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";

function Favoritos() {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, "usuarios", user.uid);

        const unsub = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setFavoritos(data.favoritos || []);
                setLoading(false);
            }
        });

        return () => unsub();
    }, []);

    const borrarFavorito = async (city) => {
        const user = auth.currentUser;
        if (!user) return;
        const ref = doc(db, "usuarios", user.uid);
        try {
            await updateDoc(ref, {
                favoritos: arrayRemove(city)
            });
        } catch (err) {
            console.error("Error borrando favorito:", err);
        }
    };

    if (loading) return <section className="card favoritos"><h2>⭐ Favoritos</h2><p>Cargando favoritos...</p></section>;

    return (
        <section className="card favoritos">
            <h2>⭐ Favoritos</h2>

            {favoritos.length === 0 ? (
                <p>No hay ciudades guardadas aún.</p>
            ) : (
                <ul>
                    {favoritos.map((city, index) => (
                        <li key={index} className="favorito-item">
                            <span>{city}</span>
                            <button className="btn-borrar" onClick={() => borrarFavorito(city)}>🗑</button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default Favoritos;
