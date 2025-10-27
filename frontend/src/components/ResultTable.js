import React, { useState } from 'react';
import '../styles/ChampionsTheme.css';

const ResultTable = () => {
  const [matches] = useState([]);

  if (matches.length === 0) {
    return (
      <div className="empty-state" role="status" aria-live="polite">
        <div className="empty-state-content">
          <div className="champions-ball" aria-hidden="true"></div>
          <h2 className="empty-title">Sorteo Pendiente</h2>
          <p className="empty-message">Aún no se han realizado sorteos para la próxima fase.</p>
          <p className="empty-subtitle">¡Regístrate para participar en el próximo sorteo!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="result-table results-container">
      <h2 className="results-title">Próximos Encuentros</h2>
      <div className="table-container results-grid">
        <table className="champions-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Equipo Local</th>
              <th>Equipo Visitante</th>
              <th>Fecha</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match, index) => (
              <tr key={index}>
                <td>{match.team1}</td>
                <td>{match.team2}</td>
                <td>{match.date}</td>
                <td>{match.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultTable;