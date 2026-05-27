import './App.css';
import React, { useState } from "react";
import MainForm from "./components/MainForm";
import ResultTable from "./components/ResultTable";
import worldCupLogo from './assets/logos/fifa-world-cup-2026.png';

function App() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <img src={worldCupLogo} alt="FIFA World Cup 2026" className="App-logo" />
        <h1 className="App-title">Sorteo Mundial 2026</h1>
        <p className="App-subtitle">USA · Canadá · México</p>
        <MainForm onAsignacion={() => setRefresh(v => v + 1)} />
        <ResultTable refresh={refresh} />
      </header>
      <footer className="App-footer">
        Created by Camilo Betancur Hernandez
      </footer>
    </div>
  );
}
export default App;
