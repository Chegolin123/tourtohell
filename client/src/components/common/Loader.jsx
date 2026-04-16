import React from 'react';

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🔥</div>
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    </div>
  );
};

export default Loader;