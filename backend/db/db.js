const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'champions.db');

let db;

const SELECCIONES = [
  { nombre: "Argentina", logo: "https://flagcdn.com/w160/ar.png" },
  { nombre: "Australia", logo: "https://flagcdn.com/w160/au.png" },
  { nombre: "Austria", logo: "https://flagcdn.com/w160/at.png" },
  { nombre: "Bélgica", logo: "https://flagcdn.com/w160/be.png" },
  { nombre: "Bosnia y Herzegovina", logo: "https://flagcdn.com/w160/ba.png" },
  { nombre: "Brasil", logo: "https://flagcdn.com/w160/br.png" },
  { nombre: "Cabo Verde", logo: "https://flagcdn.com/w160/cv.png" },
  { nombre: "Canadá", logo: "https://flagcdn.com/w160/ca.png" },
  { nombre: "Colombia", logo: "https://flagcdn.com/w160/co.png" },
  { nombre: "República Democrática del Congo", logo: "https://flagcdn.com/w160/cd.png" },
  { nombre: "Croacia", logo: "https://flagcdn.com/w160/hr.png" },
  { nombre: "República Checa", logo: "https://flagcdn.com/w160/cz.png" },
  { nombre: "Dinamarca", logo: "https://flagcdn.com/w160/dk.png" },
  { nombre: "Ecuador", logo: "https://flagcdn.com/w160/ec.png" },
  { nombre: "Inglaterra", logo: "https://flagcdn.com/w160/gb-eng.png" },
  { nombre: "Finlandia", logo: "https://flagcdn.com/w160/fi.png" },
  { nombre: "Francia", logo: "https://flagcdn.com/w160/fr.png" },
  { nombre: "Alemania", logo: "https://flagcdn.com/w160/de.png" },
  { nombre: "Ghana", logo: "https://flagcdn.com/w160/gh.png" },
  { nombre: "Haití", logo: "https://flagcdn.com/w160/ht.png" },
  { nombre: "Países Bajos", logo: "https://flagcdn.com/w160/nl.png" },
  { nombre: "Hungría", logo: "https://flagcdn.com/w160/hu.png" },
  { nombre: "Islandia", logo: "https://flagcdn.com/w160/is.png" },
  { nombre: "Indonesia", logo: "https://flagcdn.com/w160/id.png" },
  { nombre: "Italia", logo: "https://flagcdn.com/w160/it.png" },
  { nombre: "Costa de Marfil", logo: "https://flagcdn.com/w160/ci.png" },
  { nombre: "Corea del Sur", logo: "https://flagcdn.com/w160/kr.png" },
  { nombre: "México", logo: "https://flagcdn.com/w160/mx.png" },
  { nombre: "Marruecos", logo: "https://flagcdn.com/w160/ma.png" },
  { nombre: "Nueva Zelanda", logo: "https://flagcdn.com/w160/nz.png" },
  { nombre: "Irlanda del Norte", logo: "https://flagcdn.com/w160/gb-nir.png" },
  { nombre: "Noruega", logo: "https://flagcdn.com/w160/no.png" },
  { nombre: "Panamá", logo: "https://flagcdn.com/w160/pa.png" },
  { nombre: "Paraguay", logo: "https://flagcdn.com/w160/py.png" },
  { nombre: "Polonia", logo: "https://flagcdn.com/w160/pl.png" },
  { nombre: "Portugal", logo: "https://flagcdn.com/w160/pt.png" },
  { nombre: "Catar", logo: "https://flagcdn.com/w160/qa.png" },
  { nombre: "República de Irlanda", logo: "https://flagcdn.com/w160/ie.png" },
  { nombre: "Rumania", logo: "https://flagcdn.com/w160/ro.png" },
  { nombre: "Arabia Saudita", logo: "https://flagcdn.com/w160/sa.png" },
  { nombre: "Escocia", logo: "https://flagcdn.com/w160/gb-sct.png" },
  { nombre: "Senegal", logo: "https://flagcdn.com/w160/sn.png" },
  { nombre: "Sudáfrica", logo: "https://flagcdn.com/w160/za.png" },
  { nombre: "España", logo: "https://flagcdn.com/w160/es.png" },
  { nombre: "Suecia", logo: "https://flagcdn.com/w160/se.png" },
  { nombre: "Suiza", logo: "https://flagcdn.com/w160/ch.png" },
  { nombre: "Túnez", logo: "https://flagcdn.com/w160/tn.png" },
  { nombre: "Turquía", logo: "https://flagcdn.com/w160/tr.png" },
  { nombre: "Ucrania", logo: "https://flagcdn.com/w160/ua.png" },
  { nombre: "Estados Unidos", logo: "https://flagcdn.com/w160/us.png" },
  { nombre: "Uruguay", logo: "https://flagcdn.com/w160/uy.png" },
  { nombre: "Uzbekistán", logo: "https://flagcdn.com/w160/uz.png" },
  { nombre: "Gales", logo: "https://flagcdn.com/w160/gb-wls.png" },
];

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

    db.all("SELECT nombre FROM equipos", [], (err, rows) => {
      if (err) return console.error(err);
      const existentes = new Set(rows.map(r => r.nombre));
      const esperados = new Set(SELECCIONES.map(s => s.nombre));
      const mismos =
        existentes.size === esperados.size &&
        [...esperados].every(n => existentes.has(n));

      if (mismos) return;

      db.serialize(() => {
        db.run("DELETE FROM equipos");
        const stmt = db.prepare("INSERT INTO equipos (nombre, logo) VALUES (?, ?)");
        SELECCIONES.forEach(s => stmt.run(s.nombre, s.logo));
        stmt.finalize(err => {
          if (err) console.error(err);
          else console.log(`Equipos re-sembrados: ${SELECCIONES.length} selecciones del Mundial 2026.`);
        });
      });
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
