import React from 'react';
import './PaletBlock.css';

const PaletBlock = ({ hex = "#978468", label = "Деталь" }) => {
  return (
    <div className="palet-block" style={{ backgroundColor: hex }}>
      <div className="palet-content">
        <span className="palet-hex-code">{hex.toUpperCase()}</span>
        <p className="palet-label">{label}</p>
      </div>
    </div>
  );
};

export default PaletBlock;