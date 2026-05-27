const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'champions.db');

let db;

const SELECCIONES = [
  { nombre: "Argentina", logo: "https://flagcdn.com/w160/ar.png" },
  { nombre: "Australia", logo: "https://flagcdn.com/w160/au.png" },
  { nombre: "Austria", logo: "https://flagcdn.com/w160/at.png" },
  { nombre: "Belgium", logo: "https://flagcdn.com/w160/be.png" },
  { nombre: "Bosnia & Herzegovina", logo: "https://flagcdn.com/w160/ba.png" },
  { nombre: "Brazil", logo: "https://flagcdn.com/w160/br.png" },
  { nombre: "Cabo Verde", logo: "https://flagcdn.com/w160/cv.png" },
  { nombre: "Canada", logo: "https://flagcdn.com/w160/ca.png" },
  { nombre: "Colombia", logo: "https://flagcdn.com/w160/co.png" },
  { nombre: "Congo DR", logo: "https://flagcdn.com/w160/cd.png" },
  { nombre: "Croatia", logo: "https://flagcdn.com/w160/hr.png" },
  { nombre: "Czech Republic", logo: "https://flagcdn.com/w160/cz.png" },
  { nombre: "Denmark", logo: "https://flagcdn.com/w160/dk.png" },
  { nombre: "Ecuador", logo: "https://flagcdn.com/w160/ec.png" },
  { nombre: "England", logo: "https://flagcdn.com/w160/gb-eng.png" },
  { nombre: "Finland", logo: "https://flagcdn.com/w160/fi.png" },
  { nombre: "France", logo: "https://flagcdn.com/w160/fr.png" },
  { nombre: "Germany", logo: "https://flagcdn.com/w160/de.png" },
  { nombre: "Ghana", logo: "https://flagcdn.com/w160/gh.png" },
  { nombre: "Haiti", logo: "https://flagcdn.com/w160/ht.png" },
  { nombre: "Holland", logo: "https://flagcdn.com/w160/nl.png" },
  { nombre: "Hungary", logo: "https://flagcdn.com/w160/hu.png" },
  { nombre: "Iceland", logo: "https://flagcdn.com/w160/is.png" },
  { nombre: "Indonesia", logo: "https://flagcdn.com/w160/id.png" },
  { nombre: "Italy", logo: "https://flagcdn.com/w160/it.png" },
  { nombre: "Ivory Coast", logo: "https://flagcdn.com/w160/ci.png" },
  { nombre: "Korea Republic", logo: "https://flagcdn.com/w160/kr.png" },
  { nombre: "Mexico", logo: "https://flagcdn.com/w160/mx.png" },
  { nombre: "Morocco", logo: "https://flagcdn.com/w160/ma.png" },
  { nombre: "New Zealand", logo: "https://flagcdn.com/w160/nz.png" },
  { nombre: "Northern Ireland", logo: "https://flagcdn.com/w160/gb-nir.png" },
  { nombre: "Norway", logo: "https://flagcdn.com/w160/no.png" },
  { nombre: "Panama", logo: "https://flagcdn.com/w160/pa.png" },
  { nombre: "Paraguay", logo: "https://flagcdn.com/w160/py.png" },
  { nombre: "Poland", logo: "https://flagcdn.com/w160/pl.png" },
  { nombre: "Portugal", logo: "https://flagcdn.com/w160/pt.png" },
  { nombre: "Qatar", logo: "https://flagcdn.com/w160/qa.png" },
  { nombre: "Republic of Ireland", logo: "https://flagcdn.com/w160/ie.png" },
  { nombre: "Romania", logo: "https://flagcdn.com/w160/ro.png" },
  { nombre: "Saudi Arabia", logo: "https://flagcdn.com/w160/sa.png" },
  { nombre: "Scotland", logo: "https://flagcdn.com/w160/gb-sct.png" },
  { nombre: "Senegal", logo: "https://flagcdn.com/w160/sn.png" },
  { nombre: "South Africa", logo: "https://flagcdn.com/w160/za.png" },
  { nombre: "Spain", logo: "https://flagcdn.com/w160/es.png" },
  { nombre: "Sweden", logo: "https://flagcdn.com/w160/se.png" },
  { nombre: "Switzerland", logo: "https://flagcdn.com/w160/ch.png" },
  { nombre: "Tunisia", logo: "https://flagcdn.com/w160/tn.png" },
  { nombre: "Turkiye", logo: "https://flagcdn.com/w160/tr.png" },
  { nombre: "Ukraine", logo: "https://flagcdn.com/w160/ua.png" },
  { nombre: "United States", logo: "https://flagcdn.com/w160/us.png" },
  { nombre: "Uruguay", logo: "https://flagcdn.com/w160/uy.png" },
  { nombre: "Uzbekistan", logo: "https://flagcdn.com/w160/uz.png" },
  { nombre: "Wales", logo: "https://flagcdn.com/w160/gb-wls.png" },
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
