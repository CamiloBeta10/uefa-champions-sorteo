import React, { useState, useEffect } from "react";
import MainForm from "./components/MainForm";
import ResultTable from "./components/ResultTable";
import uefaLogo from "./assets/logos/uefa-logo.png";
import championsBg from "./assets/logos/champions-bg.jpg";

function App() {
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center relative"
      style={{
        backgroundImage: `url(${championsBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <header className="flex items-center justify-center py-4">
        <img src={uefaLogo} alt="UEFA Champions League" className="h-20" />
      </header>
      <main className="flex flex-col items-center justify-center w-full h-full">
        <MainForm />
        <ResultTable />
      </main>
    </div>
  );
}
export default App;