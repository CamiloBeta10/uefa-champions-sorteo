import React from "react";

export default function ChampionsBackground() {
  // Puedes crear estrellas animadas aquí usando CSS o SVG
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* Ejemplo simple de fondo con estrellas */}
      <div className="w-full h-full bg-gradient-to-b from-championsBlue via-championsSilver to-championsBlue opacity-80" />
      {/* Agrega SVGs/CSS para estrellas animadas aquí */}
    </div>
  );
}