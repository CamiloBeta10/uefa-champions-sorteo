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
    <div className="mt-8 bg-white/10 rounded-xl p-6 shadow-lg w-full max-w-3xl wc-results">
      <h2 className="wc-results-title">Resultados del Sorteo</h2>
      <table className="champions-table w-full table-auto">
        <thead>
          <tr>
            <th>Participante</th>
            <th>Selección</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {resultados.length === 0 ? (
            <tr>
              <td colSpan={3} className="wc-empty">
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
        .wc-results {
          width: 100%;
          margin-top: 2rem;
          background: linear-gradient(180deg, rgba(0, 30, 90, 0.92) 0%, rgba(0, 18, 51, 0.92) 100%);
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 199, 44, 0.35);
        }
        .wc-results-title {
          color: #FFC72C;
          font-family: Impact, 'Arial Black', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0 0 1rem;
          text-align: center;
        }
        .champions-table {
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
          font-size: 0.95rem;
          color: #fff;
          border-radius: 10px;
          overflow: hidden;
        }
        .champions-table th,
        .champions-table td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 199, 44, 0.2);
        }
        .champions-table th {
          background: linear-gradient(90deg, #E4002B 0%, #003DA5 50%, #00843D 100%);
          color: #fff;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.85rem;
        }
        .champions-table tbody tr:nth-child(even) {
          background: rgba(255, 255, 255, 0.04);
        }
        .champions-table tbody tr:hover {
          background: rgba(255, 199, 44, 0.1);
        }
        .wc-empty {
          text-align: center;
          color: #FFC72C;
          padding: 1.5rem !important;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
