import { useState } from "react";

const PokeBall = ({ size = "w-24 h-24" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`inline-flex items-center justify-center ${size} bg-white rounded-full relative cursor-pointer transform transition-all duration-300 hover:scale-110 ${isHovered ? 'shadow-lg' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Red top half - classic Pokéball */}
      <div className={`absolute top-0 left-0 w-full h-1/2 bg-red-600 rounded-t-full overflow-hidden transition-all duration-300 ${isHovered ? 'bg-red-700' : ''}`}>
        {/* Shine effect */}
        <div className={`absolute -top-1 -left-1 w-1/3 h-1/3 bg-white opacity-0 rounded-full transition-all duration-300 ${isHovered ? 'opacity-30 animate-pulse' : ''}`}></div>
      </div>

      {/* White bottom half */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white rounded-b-full">
      </div>

      {/* Horizontal center line */}
      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 h-1.5 bg-black z-5 overflow-hidden rounded-full"></div>

      {/* Center button */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full border-4 border-gray-700 z-10 transition-all duration-300 ${isHovered ? 'scale-110 bg-gray-100' : ''}`}>
      </div>

      {/* Black border */}
      <div className="absolute inset-0 border-4 border-black rounded-full pointer-events-none"></div>

      {/* Rotation effect container */}
      <div className={`absolute inset-0 transition-all duration-500 ${isHovered ? 'rotate-180' : 'rotate-0'}`}>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-transparent"></div>
      </div>

      {/* Sparkles with red tint */}
      {isHovered && (
        <>
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-red-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-red-400 rounded-full animate-ping delay-100"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-red-400 rounded-full animate-ping delay-200"></div>
          <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-red-400 rounded-full animate-ping delay-300"></div>
        </>
      )}
    </div>
  );
};

export default PokeBall;
