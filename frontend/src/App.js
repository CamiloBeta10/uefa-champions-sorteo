import './App.css';
import React from "react";
import MainForm from "./components/MainForm";
import ResultTable from "./components/ResultTable";
import uefaLogo from './assets/logos/uefa-champions-league-seeklogo.svg';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={uefaLogo} alt="UEFA Champions League" className="App-logo" />
        <MainForm />
        <ResultTable />
      </header>
    </div>
  );
}
export default App;