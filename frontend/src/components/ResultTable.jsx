import React, { useEffect, useState } from "react";

export default function ResultTable() {
  const [resultados, setResultados] = useState([]);
  useEffect(() => {
    fetch("http://localhost:4000/api/resultados")
      .then((res) => res.json())
      .then(setResultados);
  }, []);

  return (
    <div className="mt-8 bg-white/10 rounded-xl p-6 shadow-lg w-full max-w-3xl">
      <h2 className="text-championsGold text-xl font-bold mb-4">Resultados</h2>
      <table className="w-full table-auto text-white">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Equipo</th>
            <th>Escudo</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((r) => (
            <tr key={r.id}>
              <td>{r.nombre} {r.apellido}</td>
              <td>{r.equipo}</td>
              <td>
                <img src={`http://localhost:4000/assets/logos/${r.equipo.toLowerCase().replace(/\s/g, "-")}.png`} alt={r.equipo} className="h-10" />
              </td>
              <td>{new Date(r.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}