import React, { useState } from "react";

export default function MainForm() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [asignado, setAsignado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Solo permite letras y espacios en nombre
  const handleNombreChange = (e) => {
    const valor = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(valor)) {
      setNombre(valor);
      setError("");
    } else {
      setError("El nombre solo puede contener letras y espacios.");
    }
  };

  // Solo permite letras y espacios en apellido
  const handleApellidoChange = (e) => {
    const valor = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(valor)) {
      setApellido(valor);
      setError("");
    } else {
      setError("El apellido solo puede contener letras y espacios.");
    }
  };

  // Validación real contra el backend
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
      if (cantidad >= 2) {
        setError("¡Este nombre y apellido ya tiene dos equipos asignados!");
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
    // Validar antes de asignar (consulta al backend)
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
          {loading ? "Seleccionando..." : "Seleccionar Equipo"}
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
      {error && (
        <div className="mt-4 text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}
      {asignado && asignado.equipo && (
        <div className="mt-8 flex flex-col items-center animate-fade-in">
          <img
            src={`https://uefa-champions-sorteo-backend.onrender.com/api/asignar${asignado.logo}`}
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
            {asignado.nombre} {asignado.apellido} fue asignado al equipo: <b>{asignado.equipo}</b>
          </p>
        </div>
      )}
      {asignado && asignado.error && (
        <div className="mt-4 text-red-500 text-center">
          <p>{asignado.error}</p>
        </div>
      )}
      {/* Estilos específicos para el formulario */}
      <style>{`
        .champions-input {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: none;
          background: rgba(255,255,255,0.8);
          color: #00235e;
          font-size: 1rem;
          box-shadow: 0 2px 10px rgba(197,160,99,0.08);
          outline: none;
          margin-bottom: 0.5rem;
          transition: box-shadow 0.2s, border-color 0.2s;
          display: block;
        }
        .champions-input:focus {
          box-shadow: 0 0 0 2px #c5a063;
          background: #fff;
        }
        .champions-button,
        .champions-clear {
          width: 100%;
          margin-bottom: 0.5rem;
        }
        .champions-button {
          background: linear-gradient(90deg, #c5a063 60%, #00235e 100%);
          color: #fff;
          font-weight: bold;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(197,160,99,0.2);
          transition: background 0.2s, box-shadow 0.2s;
          display: block;
        }
        .champions-button:hover {
          background: linear-gradient(90deg, #00235e 60%, #c5a063 100%);
          box-shadow: 0 4px 20px rgba(197,160,99,0.25);
        }
        .champions-clear {
          background: #fff;
          color: #00235e;
          font-weight: bold;
          padding: 0.75rem 1.5rem;
          border: 2px solid #c5a063;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          display: block;
        }
        .champions-clear:hover {
          background: #c5a063;
          color: #fff;
        }
      `}</style>
    </div>
  );
}