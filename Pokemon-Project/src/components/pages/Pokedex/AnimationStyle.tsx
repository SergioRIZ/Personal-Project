import React from 'react';

const AnimationsStyle = () => (
  <style>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    .animate-float { animation: float 3s ease-in-out infinite; }
  `}</style>
);

export default AnimationsStyle;
