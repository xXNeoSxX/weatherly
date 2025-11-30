// src/components/Historial.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";

function Historial() {
    const [registros, setRegistros] = useState([]);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const ref = collection(db, "usuarios", user.uid, "consultas");
        const q = query(ref, orderBy("fecha", "desc"));

        const unsub = onSnapshot(q, (snapshot) => {
            const datos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRegistros(datos);
        });

        return () => unsub();
    }, []);

    const borrarConsulta = async (id) => {
        const user = auth.currentUser;
        if (!user) return;
        const ref = doc(db, "usuarios", user.uid, "consultas", id);
        try {
            await deleteDoc(ref);
        } catch (err) {
            console.error("Error borrando consulta:", err);
        }
    };

    return (
        <section className="card historial">
            <h2>📜 Historial de consultas</h2>

            {registros.length === 0 ? (
                <p>Aún no hay consultas.</p>
            ) : (
                <ul className="historial-lista">
                    {registros.map((item) => (
                        <li key={item.id} className="historial-item">
                            <div>
                                <strong>{item.ciudad}</strong> — {item.temperatura}°C — {item.condicion} <br />
                                <small>{item.fecha?.toDate().toLocaleString("es-MX")}</small>
                            </div>
                            <button className="btn-borrar" onClick={() => borrarConsulta(item.id)}>🗑</button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default Historial;
