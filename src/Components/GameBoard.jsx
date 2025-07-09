import { useDrop } from 'react-dnd';
import {
  Ship,
  Swords,
  Waves,
  Sailboat,
  Anchor,
  Plane,
  Landmark,
  Shield,
  Flame,
  Car,
  ShieldCheck
} from 'lucide-react';

export default function GameBoard({ board, onClick, terrainMap, showShips, unitTypes, orientation }) {
  const unitIcons = {
    BATTLESHIP: <Ship size={28} />,
    DESTROYER: <Swords size={28} />,
    SUBMARINE: <Waves size={28} />,
    CRUISER: <Sailboat size={28} />,
    CARRIER: <Anchor size={28} />,
    BOMBER: <Plane size={28} />,
    ARTILLERY: <Landmark size={28} />,
    INFANTRY: <Shield size={28} />,
    TANK: <Flame size={28} />,
    VEHICLE: <Car size={28} />,
    BUNKER: <ShieldCheck size={28} />
  };

  const [, drop] = useDrop({
    accept: 'unit', // Accept units from UnitSelector
    drop: (item, monitor) => {
      // Item contains unit data (unitImages, unitTypes)
      const { unitImages, unitTypes } = item;
      // Handle drop logic here, e.g., set the dropped icon on the board
      console.log('Item dropped:', unitImages, unitTypes);
    },
  });

  return (
    <div ref={drop} className="grid grid-cols-10 gap-1 bg-white/10 p-4 rounded-lg shadow-2xl backdrop-blur-2xl border border-white/10">
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
                  ? "url('/images/black-water.jpg')"
                  : cell === 'miss' && (terrain === 'land' || terrain === 'air')
                  ? "url('/images/destroyed-land.jpg')"
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
              <div className="absolute text-white drop-shadow-lg">
                {unitIcons[cell.split('-')[0]]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
