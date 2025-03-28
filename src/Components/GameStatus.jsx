import { FaBroadcastTower, FaPlane, FaShip, FaShieldAlt } from "react-icons/fa";

export default function GameStatus({ gameState, message, playerUnits, computerUnits }) {
  const remainingPlayerUnits = playerUnits.filter(u => !u.sunk).length;
  const remainingComputerUnits = computerUnits.filter(u => !u.sunk).length;

  return (
    <div className="bg-gray-900 text-white p-5 rounded-lg shadow-2xl border-2 border-gray-700 w-full mb-[4vh]">
      {/* Military Message with Icon */}
      <div className="flex items-center justify-center md:justify-start gap-3 text-yellow-400 font-bold text-lg mb-4">
        <FaBroadcastTower className="text-2xl animate-pulse" />
        <span>{message}</span>
      </div>

      {/* Battle Status */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Player Units */}
        <div className="text-center flex flex-col items-center">
          <div className="text-blue-400 font-bold flex items-center gap-2">
            <FaShieldAlt className="text-2xl" /> Your Army
          </div>
          <div className="text-xl font-semibold">{remainingPlayerUnits} / {playerUnits.length} remaining</div>
        </div>

        {/* Enemy Units */}
        <div className="text-center flex flex-col items-center">
          <div className="text-red-400 font-bold flex items-center gap-2">
            <FaPlane className="text-2xl" /> Enemy Forces
          </div>
          <div className="text-xl font-semibold">{remainingComputerUnits} / {computerUnits.length} remaining</div>
        </div>
      </div>
    </div>
  );
}
