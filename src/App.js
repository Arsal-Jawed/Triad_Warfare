import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import GameGrid from './Pages/GameGrid';
import Home from './Pages/Home';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/battle' element={
            <GameGrid
              selectedUnit={selectedUnit}
              setSelectedUnit={setSelectedUnit}
            />
          } />
        </Routes>

        {selectedUnit && (
          <img
            src={`/images/${selectedUnit.toLowerCase()}.png`}
            alt={selectedUnit}
            className="pointer-events-none fixed w-16 h-16 opacity-80 z-50"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}
      </div>
    </DndProvider>
  );
}

export default App;
