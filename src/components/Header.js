// src/components/Header.js
import React from "react";

function Header({ ciudad, setCiudad, handleSubmit, darkMode, toggleTheme }) {
    return (
        <header>
            <h1>🌤️ Weatherly</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Buscar ciudad..."
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                />
                <button type="submit">🔍</button>
            </form>
            <button id="theme-toggle" onClick={toggleTheme}>
                {darkMode ? "☀️" : "🌙"}
            </button>
        </header>
    );
}

export default Header;
