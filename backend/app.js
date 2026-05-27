const express = require('express');
const cors = require('cors');
const { initDB, getAvailableTeams, assignTeam, getResults } = require('./db/db');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

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
  const completo = `${nombre || ""} ${apellido || ""}`.trim().toLowerCase().replace(/\s+/g, " ");
  return PARTICIPANTES.includes(completo);
};

initDB();

// Endpoint para obtener equipos disponibles
app.get('/api/equipos', async (req, res) => {
  const equipos = await getAvailableTeams();
  res.json(equipos);
});

// Endpoint para asignar equipo aleatorio
app.post('/api/asignar', async (req, res) => {
  const { nombre, apellido } = req.body;
  if (!esParticipante(nombre, apellido)) {
    return res.status(403).json({ error: "El nombre y apellido ingresados no son participantes del torneo." });
  }
  const result = await assignTeam(nombre, apellido);
  if (!result) return res.status(400).json({ error: "No hay equipos disponibles" });
  res.json(result);
});

// Endpoint para ver resultados
app.get('/api/resultados', async (req, res) => {
  const resultados = await getResults();
  res.json(resultados);
});

// Servir logos y assets estáticos
app.use('/assets/logos', express.static(path.join(__dirname, 'assets', 'logos')));

const PORT = 4000;
app.listen(PORT, () => console.log(`Servidor backend en puerto ${PORT}`));