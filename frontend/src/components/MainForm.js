import React, { useState } from "react";

const PARTICIPANTES = [
  "samuel cano",
  "samuel duarte",
  "samuel parra",
  "camilo betancur",
  "damaris cano",
  "jhordy cano",
  "rodolfo cano",
  "santiago castro",
  "juan pablo tabares",
];

const esParticipante = (nombre, apellido) => {
  const completo = `${nombre} ${apellido}`.trim().toLowerCase().replace(/\s+/g, " ");
  return PARTICIPANTES.includes(completo);
};

export default function MainForm({ onAsignacion }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [asignado, setAsignado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleNombreChange = (e) => {
    const valor = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(valor)) {
      setNombre(valor);
      setError("");
    } else {
      setError("El nombre solo puede contener letras y espacios.");
    }
  };

  const handleApellidoChange = (e) => {
    const valor = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(valor)) {
      setApellido(valor);
      setError("");
    } else {
      setError("El apellido solo puede contener letras y espacios.");
    }
  };

  const puedeAsignar = async (nombre, apellido) => {
    try {
      const res = await fetch("https://uefa-champions-sorteo-backend.onrender.com/api/resultados");
      const resultados = await res.json();
      const clave = `${nombre.trim().toLowerCase()}-${apellido.trim().toLowerCase()}`;
      const cantidad = resultados.filter(
        r =>
          r.nombre.trim().toLowerCase() === nombre.trim().toLowerCase() &&
          r.apellido.trim().toLowerCase() === apellido.trim().toLowerCase()
      ).length;
      if (cantidad >= 5) {
        setError("¡Este nombre y apellido ya tiene cinco selecciones asignadas!");
        return false;
      }
      return true;
    } catch {
      setError("No se pudo validar el nombre y apellido.");
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (nombre.trim() === "" || apellido.trim() === "") {
      setError("Ambos campos son obligatorios.");
      return;
    }

    if (!esParticipante(nombre, apellido)) {
      setError("El nombre y apellido ingresados no son participantes del torneo.");
      return;
    }

    const valido = await puedeAsignar(nombre, apellido);
    if (!valido) return;

    setLoading(true);
    setAsignado(null);
    try {
      const res = await fetch("https://uefa-champions-sorteo-backend.onrender.com/api/asignar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido }),
      });
      const data = await res.json();
      setAsignado(data);
    } catch (error) {
      setError("Error al asignar equipo");
    }
    setLoading(false);
  };

  const handleClear = () => {
    setNombre("");
    setApellido("");
    setAsignado(null);
    setError("");
  };

  return (
    <div className="bg-white/10 rounded-xl p-6 shadow-lg w-full max-w-md mx-auto">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="champions-input"
          placeholder="Nombre"
          value={nombre}
          onChange={handleNombreChange}
          required
        />
        <input
          className="champions-input"
          placeholder="Apellido"
          value={apellido}
          onChange={handleApellidoChange}
          required
        />
        <button
          type="submit"
          className="champions-button"
          disabled={loading}
        >
          {loading ? "Sorteando..." : "Asignar Selección"}
        </button>
        <button
          type="button"
          className="champions-clear"
          onClick={handleClear}
          disabled={loading}
        >
          Limpiar
        </button>
      </form>
      {asignado && asignado.equipo && (
        <div className="mt-8 flex flex-col items-center animate-fade-in">
          <img
            src={asignado.logo?.startsWith("http") ? asignado.logo : `https://uefa-champions-sorteo-backend.onrender.com${asignado.logo}`}
            alt={asignado.equipo}
            style={{
              maxHeight: "90px",
              maxWidth: "90px",
              width: "auto",
              height: "auto",
              display: "block",
              margin: "0 auto",
              objectFit: "contain"
            }}
          />
          <p className="text-lg mt-4 text-white text-center">
            {asignado.nombre} {asignado.apellido} fue asignado a: <b>{asignado.equipo}</b>
          </p>
        </div>
      )}
      {asignado && asignado.error && (
        <div className="mt-4 text-red-500 text-center">
          <p>{asignado.error}</p>
        </div>
      )}
      {error && (
        <div className="wc-error">
          <p>{error}</p>
        </div>
      )}
      <style>{`
        .champions-input {
          width: 100%;
          margin-bottom: 0.5rem;
          display: block;
        }
        .champions-button,
        .champions-clear {
          width: 100%;
          margin-bottom: 0.5rem;
          display: block;
        }
        .wc-error {
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          background: rgba(228, 0, 43, 0.12);
          border: 1px solid #E4002B;
          color: #E4002B;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}