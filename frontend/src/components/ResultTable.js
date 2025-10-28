import React, { useEffect, useState } from "react";

export default function ResultTable({ refresh }) {
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    fetch("https://uefa-champions-sorteo-backend.onrender.com/api/resultados")
      .then((res) => res.json())
      .then(setResultados)
      .catch(() => setResultados([])); 
  }, [refresh]); 

  return (
    <div className="mt-8 bg-white/10 rounded-xl p-6 shadow-lg w-full max-w-3xl">
      <h2 className="text-championsGold text-xl font-bold mb-4">Resultados</h2>
      <table className="champions-table w-full table-auto text-white">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Equipo</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {resultados.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", color: "#c5a063" }}>
                No hay resultados aún.
              </td>
            </tr>
          ) : (
            resultados.map((r) => (
              <tr key={r.id}>
                <td>{r.nombre} {r.apellido}</td>
                <td>{r.equipo}</td>
                <td>{new Date(r.fecha).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <style>{`
        .champions-table {
          border-collapse: collapse;
          width: 100%;
          background: rgba(34, 46, 64, 0.3);
          font-size: 1rem;
        }
        .champions-table th,
        .champions-table td {
          border: 2px solid #c5a063;
          padding: 0.75rem 1rem;
          text-align: left;
        }
        .champions-table th {
          background: #00235e;
          color: #c5a063;
          font-weight: bold;
        }
        .champions-table tr:nth-child(even) {
          background: rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}