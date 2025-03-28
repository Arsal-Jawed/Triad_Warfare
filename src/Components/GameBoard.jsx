export default function GameBoard({ board, onClick, terrainMap, showShips, unitTypes, orientation }) {
  const unitImages = {
    BATTLESHIP: '/images/battleship.png',
    DESTROYER: '/images/destroyer.png',
    SUBMARINE: '/images/submarine.png',
    CRUISER: '/images/cruiser.png',
    CARRIER: '/images/carrier.png',
    BOMBER: '/images/bomber.png',
    ARTILLERY: '/images/artillery.png',
    INFANTRY: '/images/infantry.png',
    TANK: '/images/tank.png',
    VEHICLE: '/images/vehicle.png',
    BUNKER: '/images/bunker.png'
  };

  return (
    <div className="grid grid-cols-10 gap-1 bg-white/10 p-4 rounded-lg shadow-2xl backdrop-blur-2xl border border-white/10">
      {board.flat().map((_, index) => {
        const x = Math.floor(index / board[0].length);
        const y = index % board[0].length;
        const cell = board[x][y];
        const terrain = terrainMap[x][y];

        return (
          <div
            key={`${x}-${y}`}
            onClick={() => onClick(x, y)}
            className={`aspect-square flex items-center justify-center 
              border border-white/20 backdrop-blur-md relative transition 
              transform hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-yellow-400
              cursor-pointer overflow-hidden`}
            style={{
              backgroundImage: 
                cell === 'miss' && terrain === 'water'
                  ? "url('/images/black-water.jpg')" // Black water texture
                  : cell === 'miss' && (terrain === 'land' || terrain === 'air')
                  ? "url('/images/destroyed-land.jpg')" // Destroyed land texture
                  : terrain === 'water'
                  ? "url('/images/water.jpg')"
                  : terrain === 'land'
                  ? "url('/images/land.jpg')"
                  : terrain === 'air'
                  ? "url('/images/plains.jpg')"
                  : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {cell === 'hit' && (
              <img 
                src="/images/fire.gif" 
                alt="Explosion"
                className="absolute w-full h-full object-cover"
              />
            )}
            {showShips && typeof cell === 'string' && cell !== 'hit' && cell !== 'miss' && (
              <img 
                src={unitImages[cell.split('-')[0]]} 
                alt={unitTypes[cell.split('-')[0]].name}
                className={`absolute w-4/5 h-4/5 object-contain ${orientation === 'vertical' ? 'rotate-90' : ''}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
