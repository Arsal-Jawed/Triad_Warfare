import { useState, useEffect } from 'react';
import GameBoard from '../Components/GameBoard';
import UnitSelector from '../Components/UnitSelector';
import GameControls from '../Components/GameControls';
import GameStatus from '../Components/GameStatus';
import { GiCrossedSabres, GiTank, GiSpartanHelmet } from "react-icons/gi";
import { useLocation } from 'react-router-dom';
import { UNIT_TYPES } from '../Utils/Units';

const BOARD_SIZE = 10;

function GameGrid() {
  const [gameState, setGameState] = useState('setup');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [orientation, setOrientation] = useState('horizontal');
  const [playerBoard, setPlayerBoard] = useState(initializeBoard());
  const [computerBoard, setComputerBoard] = useState(initializeBoard());
  const [playerUnits, setPlayerUnits] = useState(initializeUnits());
  const [computerUnits, setComputerUnits] = useState(initializeUnits());
  const [message, setMessage] = useState('Place your units on the board');
  const [terrainMap, setTerrainMap] = useState(generateTerrainMap());
  const [gameResult, setGameResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const username = params.get("username");

  function initializeBoard() {
    return Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
  }

  function initializeUnits() {
    const units = [];
    for (const [type, config] of Object.entries(UNIT_TYPES)) {
      for (let i = 0; i < config.count; i++) {
        units.push({
          id: `${type}-${i}`,
          type,
          size: config.size,
          placed: false,
          hits: 0,
          sunk: false,
        });
      }
    }
    return units;
  }

  function generateTerrainMap() {
    const map = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill('water'));
  
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < 6; y++) {
        map[x][y] = 'water';
      }
    }
  
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 6; y < 10; y++) {
        if (x % 3 !== 0 || y % 2 !== 0) {
          map[x][y] = 'land';
          if (Math.random() < 0.2) {
            map[x][y] = 'air';
          }
        }
      }
    }
  
    const requiredLandCells = Math.floor(BOARD_SIZE * 4 * 0.7);
    let currentLandCells = map.flat().filter(cell => cell === 'land').length;
    
    while (currentLandCells < requiredLandCells) {
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = 6 + Math.floor(Math.random() * 4);
      
      if (map[x][y] !== 'land') {
        map[x][y] = 'land';
        currentLandCells++;
      }
    }
  
    return map;
  }

  function placeUnit(board, unit, x, y) {
    const newBoard = [...board];
    const unitConfig = UNIT_TYPES[unit.type];
    
    if (orientation === 'horizontal') {
      if (y + unit.size > BOARD_SIZE) return false;
      for (let i = 0; i < unit.size; i++) {
        if (newBoard[x][y + i] !== null) return false;
        if (terrainMap[x][y + i] !== unitConfig.terrain) return false;
      }
    } else {
      if (x + unit.size > BOARD_SIZE) return false;
      for (let i = 0; i < unit.size; i++) {
        if (newBoard[x + i][y] !== null) return false;
        if (terrainMap[x + i][y] !== unitConfig.terrain) return false;
      }
    }
    
    if (orientation === 'horizontal') {
      for (let i = 0; i < unit.size; i++) {
        newBoard[x][y + i] = unit.id;
      }
    } else {
      for (let i = 0; i < unit.size; i++) {
        newBoard[x + i][y] = unit.id;
      }
    }
    
    return newBoard;
  }

  function handleCellClick(x, y) {
  if (gameState === 'setup') {
    if (playerBoard[x][y] !== null) {
      const unitId = playerBoard[x][y];
      const unitType = unitId.split('-')[0];

      const newBoard = playerBoard.map(row => row.map(cell =>
        cell === unitId ? null : cell
      ));

      setPlayerBoard(newBoard);

      setPlayerUnits(prevUnits =>
        prevUnits.map(u =>
          u.id === unitId ? { ...u, placed: false } : u
        )
      );

      setMessage(`${UNIT_TYPES[unitType].name} removed. Select it to place again.`);
      return;
    }

    if (!selectedUnit) return;

    const unit = playerUnits.find(u => u.id === selectedUnit && !u.placed);
    if (!unit) return;

    const newBoard = placeUnit(playerBoard, unit, x, y);
    if (!newBoard) {
      setMessage('Invalid placement!');
      return;
    }

    setPlayerBoard(newBoard);

    const updatedUnits = playerUnits.map(u =>
      u.id === unit.id ? { ...u, placed: true } : u
    );
    setPlayerUnits(updatedUnits);

    if (updatedUnits.every(u => u.placed)) {
      setMessage('All units placed. Ready to start!');
    } else {
      setMessage(`Place your ${unit.type} (${UNIT_TYPES[unit.type].name})`);
    }

    setSelectedUnit(null);
  }

  else if (gameState === 'player-turn') {
    if (computerBoard[x][y] === 'hit' || computerBoard[x][y] === 'miss') {
      setMessage('You already attacked this location!');
      return;
    }

    const newComputerBoard = [...computerBoard];
    let hitUnit = null;

    for (const unit of computerUnits) {
      if (newComputerBoard[x][y] === unit.id) {
        hitUnit = unit;
        newComputerBoard[x][y] = 'hit';
        break;
      }
    }

    if (!hitUnit) {
      newComputerBoard[x][y] = 'miss';
      setMessage('Miss!');
      setComputerBoard(newComputerBoard);
      setGameState('computer-turn');
      setTimeout(() => {
        computerTurn();
      }, 1000);
      return;
    }

    const updatedComputerUnits = computerUnits.map(u => {
      if (u.id === hitUnit.id) {
        const newHits = u.hits + 1;
        const sunk = newHits >= u.size;
        if (sunk) setMessage(`You sunk the computer's ${UNIT_TYPES[u.type].name}!`);
        return { ...u, hits: newHits, sunk };
      }
      return u;
    });

    setComputerUnits(updatedComputerUnits);
    setComputerBoard(newComputerBoard);

    const sunkCount = updatedComputerUnits.filter(u => u.sunk).length;

    if (sunkCount >= 10) {
      setGameState('game-over');
      setGameResult('won');
      setShowPopup(true);
      setMessage('You won! enemy force destroyed!');
    } else {
      setMessage('Hit!');
    }
  }
}


 function computerTurn() {
  let x, y;
  const maxAttempts = 100;
  let attempts = 0;

  const hitCells = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (playerBoard[i][j] === 'hit') {
        const alreadySunk = playerUnits.some(u => u.sunk && u.positions?.some(p => p.x === i && p.y === j));
        if (!alreadySunk) hitCells.push({ x: i, y: j });
      }
    }
  }

  if (hitCells.length > 0) {
    const target = hitCells[Math.floor(Math.random() * hitCells.length)];
    const directions = [
      { x: target.x - 1, y: target.y },
      { x: target.x + 1, y: target.y },
      { x: target.x, y: target.y - 1 },
      { x: target.x, y: target.y + 1 }
    ];

    const validTargets = directions.filter(pos =>
      pos.x >= 0 && pos.x < BOARD_SIZE &&
      pos.y >= 0 && pos.y < BOARD_SIZE &&
      playerBoard[pos.x][pos.y] !== 'hit' &&
      playerBoard[pos.x][pos.y] !== 'miss'
    );

    if (validTargets.length > 0) {
      const choice = validTargets[Math.floor(Math.random() * validTargets.length)];
      x = choice.x;
      y = choice.y;
    }
  }

  while (
    (x === undefined || y === undefined || playerBoard[x][y] === 'hit' || playerBoard[x][y] === 'miss') &&
    attempts < maxAttempts
  ) {
    x = Math.floor(Math.random() * BOARD_SIZE);
    y = Math.floor(Math.random() * BOARD_SIZE);
    attempts++;
  }

  const newPlayerBoard = [...playerBoard];
  let hitUnit = null;

  for (const unit of playerUnits) {
    if (typeof newPlayerBoard[x][y] === 'string' && newPlayerBoard[x][y] === unit.id) {
      hitUnit = unit;
      newPlayerBoard[x][y] = 'hit';
      break;
    }
  }

  if (!hitUnit) {
    newPlayerBoard[x][y] = 'miss';
    setMessage('Computer missed! Your turn.');
  } else {
    const updatedPlayerUnits = playerUnits.map(u => {
      if (u.id === hitUnit.id) {
        const newHits = u.hits + 1;
        const sunk = newHits >= u.size;
        if (sunk) setMessage(`Computer sunk your ${UNIT_TYPES[u.type].name}!`);
        return { ...u, hits: newHits, sunk };
      }
      return u;
    });

    setPlayerUnits(updatedPlayerUnits);

      if (updatedPlayerUnits.every(u => u.sunk)) {
        setGameState('game-over');
        setMessage('Game over! Computer won!');
        return;
      }

      if (!updatedPlayerUnits.find(u => u.id === hitUnit.id).sunk) {
        setMessage('Computer hit your unit!');
      }

  }

  setPlayerBoard(newPlayerBoard);

  if (playerUnits.every(u => u.sunk)) {
    setGameState('game-over');
    setMessage('Game over! Computer won!');
  } else if (!hitUnit) {
    setGameState('player-turn');
  } else {
    setTimeout(computerTurn, 1000);
  }
}


  function startGame() {
    let computerBoardWithUnits = initializeBoard();
    const updatedComputerUnits = [...computerUnits];
    
    const terrainSpaces = {
      water: [],
      land: [],
      air: []
    };
  
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        terrainSpaces[terrainMap[x][y]].push({x, y});
      }
    }
    const shuffleArray = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };
  
    for (const unit of updatedComputerUnits) {
      let placed = false;
      let attempts = 0;
      const unitTerrain = UNIT_TYPES[unit.type].terrain;
      const validSpaces = shuffleArray([...terrainSpaces[unitTerrain]]);
      
      while (!placed && attempts < validSpaces.length) {
        attempts++;
        const {x, y} = validSpaces[attempts - 1];
        const randomOrientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        
        const prevOrientation = orientation;
        setOrientation(randomOrientation);
        
        const newBoard = placeUnit(computerBoardWithUnits, unit, x, y);
        
        setOrientation(prevOrientation);
        
        if (newBoard) {
          computerBoardWithUnits = newBoard;
          unit.placed = true;
          placed = true;
          
          if (randomOrientation === 'horizontal') {
            for (let i = 0; i < unit.size; i++) {
              terrainSpaces[unitTerrain] = terrainSpaces[unitTerrain].filter(
                pos => !(pos.x === x && pos.y === y + i)
              );
            }
          } else {
            for (let i = 0; i < unit.size; i++) {
              terrainSpaces[unitTerrain] = terrainSpaces[unitTerrain].filter(
                pos => !(pos.x === x + i && pos.y === y)
              );
            }
          }
        }
      }
  
      if (!placed) {
        console.error(`Failed to place computer unit ${unit.id}`);
        for (let x = 0; x < BOARD_SIZE && !placed; x++) {
          for (let y = 0; y < BOARD_SIZE && !placed; y++) {
            for (const ori of ['horizontal', 'vertical']) {
              setOrientation(ori);
              const newBoard = placeUnit(computerBoardWithUnits, unit, x, y);
              if (newBoard) {
                computerBoardWithUnits = newBoard;
                unit.placed = true;
                placed = true;
                break;
              }
            }
          }
        }
      }
    }
  
    setComputerBoard(computerBoardWithUnits);
    setComputerUnits(updatedComputerUnits);
    setGameState('player-turn');
    setMessage('Game started! Attack the computer!');
    setOrientation('horizontal');
  }

  function resetGame() {
    setGameState('setup');
    setPlayerBoard(initializeBoard());
    setComputerBoard(initializeBoard());
    setPlayerUnits(initializeUnits());
    setComputerUnits(initializeUnits());
    setSelectedUnit(null);
    setOrientation('horizontal');
    setMessage('Place your units on the board');
    setTerrainMap(generateTerrainMap());
  }

  return (
    <div 
      className="min-h-screen py-8 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/images/back.jpg')" }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-black bg-opacity-80 p-6 rounded-lg mb-8 border-4 border-yellow-700 shadow-xl relative">
          <div className="absolute top-2 left-2 text-yellow-500 text-3xl">
            <GiCrossedSabres className='text-[4vw]' />
          </div>
          <div className="absolute top-2 right-2 text-yellow-500 text-3xl">
            <GiTank className='text-[4vw]'/>
          </div>
          <h1 className="text-5xl font-extrabold text-center text-yellow-400 font-military tracking-widest drop-shadow-md">
            ⚔️ TRIAD WARFARE ⚔️
          </h1>
          <p className="text-center text-gray-300 mt-3 text-lg italic">
            <GiSpartanHelmet className="inline-block text-2xl text-yellow-400 mr-2" />
            Multi-Domain Strategic Combat Simulator
          </p>
        </div>;
        
        <GameStatus 
          gameState={gameState} 
          message={message} 
          playerUnits={playerUnits} 
          computerUnits={computerUnits} 
          unitTypes={UNIT_TYPES}
        />
        
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-1 bg-black bg-opacity-70 p-4 rounded-lg border-2 border-blue-700">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-blue-500 mr-2"></div>
              <h2 className="text-xl font-semibold text-blue-300 font-military">
                {username} FLEET COMMAND
              </h2>
            </div>
            <GameBoard 
              board={playerBoard} 
              onClick={handleCellClick} 
              terrainMap={terrainMap} 
              showShips={true} 
              unitTypes={UNIT_TYPES}
            />
          </div>
          
          <div className="flex-1 bg-black bg-opacity-70 p-4 rounded-lg border-2 border-red-700">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-red-500 mr-2"></div>
              <h2 className="text-xl font-semibold text-red-300 font-military">
                ENEMY TERRITORY
              </h2>
            </div>
            <GameBoard 
              board={computerBoard} 
              onClick={handleCellClick} 
              terrainMap={terrainMap} 
              showShips={gameState === 'game-over'} 
              unitTypes={UNIT_TYPES}
              selectedUnit={selectedUnit} 
              onSelect={setSelectedUnit}
            />
          </div>
        </div>
        
        {gameState === 'setup' && (
          <div className="bg-black bg-opacity-80 p-6 rounded-lg border-2 border-yellow-600 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-yellow-400 font-military">
              UNIT DEPLOYMENT
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
              <UnitSelector 
                units={playerUnits.filter(u => !u.placed)} 
                selectedUnit={selectedUnit} 
                onSelect={setSelectedUnit} 
                unitTypes={UNIT_TYPES}
              />
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal')}
                className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-600 transition font-bold border border-yellow-500"
              >
                ROTATE: {orientation.toUpperCase()}
              </button>
              <button 
                onClick={startGame}
                disabled={!playerUnits.every(u => u.placed)}
                className={`px-4 py-2 rounded transition font-bold border ${
                  playerUnits.every(u => u.placed) 
                    ? 'bg-green-700 text-white hover:bg-green-600 border-green-500' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed border-gray-500'
                }`}
              >
                DEPLOY FLEETS
              </button>
            </div>
          </div>
        )}

          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setShowPopup(false)}
              />
              <div className={`
                relative bg-gray-900/95 border-2 border-yellow-500/80 rounded-xl p-8 max-w-md w-full mx-4
                shadow-2xl shadow-yellow-500/20
                transition-all duration-300
                ${showPopup ? 'animate-fade-in' : 'animate-fade-out'}
              `}>
                <div className="text-center">
                  <h2 className={`
                    text-3xl font-bold mb-6 
                    ${gameResult === 'won' ? 'text-green-400' : 'text-red-400'}
                    font-military tracking-wider
                  `}>
                    {gameResult === 'won' ? 'MISSION ACCOMPLISHED!' : 'MISSION FAILED!'}
                  </h2>
                  <p className="text-gray-200 mb-8 text-lg">
                    {gameResult === 'won' 
                      ? 'Your strategic dominance is unmatched!' 
                      : 'Enemy forces have prevailed this time!'}
                  </p>
                  
                  <button
                    onClick={() => {
                      resetGame();
                      setShowPopup(false);
                    }}
                    className={`
                      w-full py-3 rounded-lg font-bold text-lg 
                      transition-all duration-200 hover:scale-[1.02]
                      ${gameResult === 'won'
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white'
                        : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white'}
                      shadow-lg
                      active:scale-95
                    `}
                  >
                    {gameResult === 'won' ? 'YES! Rematch' : 'NO! Try Again'}
                  </button>
                </div>
                
                {gameResult === 'won' && (
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🏆</span>
                  </div>
                )}
                {gameResult === 'lost' && (
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl">💀</span>
                  </div>
                )}
              </div>
            </div>
          )}
        
        <GameControls 
          gameState={gameState} 
          onReset={resetGame} 
          onComputerTurn={computerTurn}
        />
      </div>
    </div>
  );
}

export default GameGrid;