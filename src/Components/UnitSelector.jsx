// src/components/UnitSelector.js
export default function UnitSelector({ units, selectedUnit, onSelect, unitTypes }) {
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
      <>
          {units.map(unit => (
              <div 
                  key={unit.id}
                  onClick={() => onSelect(unit.id)}
                  className={`
                      p-3 rounded-lg cursor-pointer transition
                      ${selectedUnit === unit.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-800'}
                      ${unitTypes[unit.type].color} text-white font-semibold
                      relative overflow-hidden
                  `}
              >
                  <img 
                      src={unitImages[unit.type]} 
                      alt={unit.type}
                      className="w-[15vw] h-[15vh] object-contain mx-auto mb-2"
                  />
                  <div className="text-sm text-center">{unitTypes[unit.type].name}</div>
                  <div className="text-xs text-center opacity-80">Size: {unit.size}</div>
              </div>
          ))}
      </>
  );
}