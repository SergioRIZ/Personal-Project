import React from 'react';

const AnimationsStyle = () => {
  return (
    <style jsx>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  );
};

export default AnimationsStyle;