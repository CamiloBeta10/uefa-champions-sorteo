const express = require('express');
const cors = require('cors');
const { initDB, getAvailableTeams, assignTeam, getResults } = require('./db/db');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa la base de datos
initDB();

// Endpoint para obtener equipos disponibles
app.get('/api/equipos', async (req, res) => {
  const equipos = await getAvailableTeams();
  res.json(equipos);
});

// Endpoint para asignar equipo aleatorio
app.post('/api/asignar', async (req, res) => {
  const { nombre, apellido } = req.body;
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