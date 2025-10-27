const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'champions.db');

let db;

function initDB() {
  db = new sqlite3.Database(dbPath);
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS equipos (
      id INTEGER PRIMARY KEY,
      nombre TEXT UNIQUE,
      logo TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS asignaciones (
      id INTEGER PRIMARY KEY,
      nombre TEXT,
      apellido TEXT,
      equipo TEXT,
      fecha TEXT
    )`);
    // Inserta equipos si la tabla está vacía
    db.all("SELECT count(*) AS count FROM equipos", [], (err, rows) => {
      if (rows[0].count === 0) {
        const equipos = [
          { nombre: "Real Madrid", logo: "/assets/logos/real-madrid.png" },
          { nombre: "Barcelona", logo: "/assets/logos/Barcelona-logo.png" },
          { nombre: "Manchester City", logo: "/assets/logos/Manchester_City.png" },
          { nombre: "Liverpool", logo: "/assets/logos/liverpool.png" },
          { nombre: "AC Milan", logo: "/assets/logos/AC_Milán.png" },
          { nombre: "Bayer Munchen", logo: "/assets/logos/Bayern_München_logo.png" },
          { nombre: "Ajax", logo: "/assets/logos/Ajax-logo.png" },
          { nombre: "Arsenal", logo: "/assets/logos/Arsenal-logo.png" },
          { nombre: "As Monaco", logo: "/assets/logos/AsMonaco-logo.png" },
          { nombre: "Atletico Madric", logo: "/assets/logos/AtleticoMadrid-logo.png" },
          { nombre: "Bayer Leverkusen", logo: "/assets/logos/bayer-leverkusen-logo.png" },
          { nombre: "Benfica", logo: "/assets/logos/Benfica-logo.png" },
          { nombre: "Borussia Dortmund", logo: "/assets/logos/Borussia_Dortmund_logo.png" },
          { nombre: "Chelsea", logo: "/assets/logos/Chelsea-logo.png" },
          { nombre: "Crystal Palace", logo: "/assets/logos/Crystal_Palace_FC_logo.png" },
          { nombre: "Eintracht Frankfurt", logo: "assets/logos/Eintracht-Frankfurt-logo.png" },
          { nombre: "FC Porto", logo: "/assets/logos/FC_Porto.png" },
          { nombre: "Fenerbache", logo: "/assets/logos/Fenerbahce-Logo.png" },
          { nombre: "Galatasaray", logo: "/assets/logos/Galatasaray-logo.png" },
          { nombre: "Inter de Milan", logo: "/assets/logos/InterMilan-logo.png" },
          { nombre: "Juventus", logo: "/assets/logos/Juventus-logo.png" },
          { nombre: "Leizip", logo: "/assets/logos/Leizip-logo.png" },
          { nombre: "Olympique Lyon", logo: "/assets/logos/lyon.png" },
          { nombre: "Manchester United", logo: "/assets/logos/Manchester-United.png" },
          { nombre: "Newcastle United", logo: "/assets/logos/Newcastle_United_Logo.png" },
          { nombre: "Olympique Marseille", logo: "/assets/logos/Olympique_Marseille_logo.webp" },
          { nombre: "París Saint-Germain", logo: "/assets/logos/Psg-logo.png" },
          { nombre: "Real Betis", logo: "/assets/logos/Real_Betis.png" },
          { nombre: "Roma", logo: "/assets/logos/Roma-logo.png" },
          { nombre: "Sevilla", logo: "/assets/logos/sevilla-logo.png" },
          { nombre: "Napoles", logo: "/assets/logos/Napoli_logo.png" },
          { nombre: "Totteham", logo: "/assets/logos/Totteham-logo.png" },
          // ...otros equipos
        ];
        equipos.forEach(eq => {
          db.run("INSERT INTO equipos (nombre, logo) VALUES (?, ?)", [eq.nombre, eq.logo]);
        });
      }
    });
  });
}

function getAvailableTeams() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM equipos WHERE nombre NOT IN (SELECT equipo FROM asignaciones)`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function assignTeam(nombre, apellido) {
  return new Promise((resolve, reject) => {
    getAvailableTeams().then(teams => {
      if (teams.length === 0) return resolve(null);
      const random = teams[Math.floor(Math.random() * teams.length)];
      const fecha = new Date().toISOString();
      db.run(`INSERT INTO asignaciones (nombre, apellido, equipo, fecha) VALUES (?, ?, ?, ?)`,
        [nombre, apellido, random.nombre, fecha], function (err) {
          if (err) reject(err);
          else resolve({ nombre, apellido, equipo: random.nombre, logo: random.logo, fecha });
        });
    });
  });
}

function getResults() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM asignaciones`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = { initDB, getAvailableTeams, assignTeam, getResults };