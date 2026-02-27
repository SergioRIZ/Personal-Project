import React, { useState } from 'react';

interface Props {
  children: React.ReactNode;
  content: React.ReactNode;
}

const Tooltip = ({ children, content }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full mb-2 w-40 max-w-xs rounded-md shadow-lg bg-white/95 backdrop-blur-sm border border-slate-200 p-3 text-left z-10">
          <div className="absolute w-3 h-3 bg-white transform rotate-45 -bottom-1.5 left-1/2 -ml-1.5 border-r border-b border-slate-200" />
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
