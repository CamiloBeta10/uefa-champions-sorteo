import './App.css';
import React, { useState } from "react";
import MainForm from "./components/MainForm";
import ResultTable from "./components/ResultTable";
import uefaLogo from './assets/logos/uefa-champions-league-seeklogo.svg';

function App() {
  const [refresh, setRefresh] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <img src={uefaLogo} alt="UEFA Champions League" className="App-logo" />
        <MainForm onAsignacion={() => setRefresh(v => v + 1)} />
        <ResultTable refresh={refresh} />
      </header>
    </div>
  );
}
export default App;