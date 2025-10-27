import React, { useState } from "react";

export default function MainForm() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [asignado, setAsignado] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/api/asignar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, apellido }),
    });
    const data = await res.json();
    setAsignado(data);
  };

  return (
    <div className="bg-white/10 rounded-xl p-6 shadow-lg">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          className="p-2 rounded bg-white/30 text-championsBlue"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          className="p-2 rounded bg-white/30 text-championsBlue"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-championsGold px-4 py-2 rounded text-championsBlue font-bold hover:bg-championsSilver transition"
        >
          Seleccionar Equipo
        </button>
      </form>
      {asignado && (
        <div className="mt-4 text-white flex flex-col items-center animate-fade-in">
          <img src={`http://localhost:4000${asignado.logo}`} alt={asignado.equipo} className="h-24" />
          <p className="text-lg mt-2">
            {asignado.nombre} {asignado.apellido} fue asignado al equipo: {asignado.equipo}
          </p>
        </div>
      )}
    </div>
  );
}