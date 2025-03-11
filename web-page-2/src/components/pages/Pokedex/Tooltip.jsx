import React, { useState } from 'react';

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className="absolute bottom-full mb-2 w-40 max-w-xs md:max-w-md rounded-md shadow-lg bg-white border border-gray-200 p-3 text-left animate-fade-in-fast z-10">
          <div className="absolute w-3 h-3 bg-white transform rotate-45 -bottom-1.5 left-1/2 -ml-13.5 border-r border-b border-gray-200"></div>
            {content}
          </div>
      )}
    </div>
  );
};

export default Tooltip;