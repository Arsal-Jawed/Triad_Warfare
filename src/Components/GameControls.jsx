// src/components/GameControls.js
export default function GameControls({ gameState, onReset, onComputerTurn }) {
    return (
      <div className="flex justify-center">
        {gameState === 'game-over' && (
          <button 
            onClick={onReset}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Play Again
          </button>
        )}
        {gameState === 'computer-turn' && (
          <button 
            onClick={onComputerTurn}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Simulate Computer Turn
          </button>
        )}
      </div>
    );
  }