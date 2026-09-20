import React, { useState } from 'react';
import { Utensils, Coffee, Pizza, Soup } from 'lucide-react';

export const FoodImage = ({ src, alt, category, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    const isDrink = category?.toLowerCase() === 'drinks';
    const isSnack = category?.toLowerCase() === 'snacks';
    const isSauce = ['sauce', 'sauces'].includes(category?.toLowerCase());

    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center text-center p-3 select-none ${
          isDrink
            ? 'bg-gradient-to-tr from-cyan-600 to-blue-500 text-white'
            : isSnack
            ? 'bg-gradient-to-tr from-amber-600 to-orange-500 text-white'
            : isSauce
            ? 'bg-gradient-to-tr from-rose-600 to-red-500 text-white'
            : 'bg-gradient-to-tr from-amber-700 via-orange-600 to-amber-500 text-white'
        } ${className}`}
      >
        {isDrink ? (
          <Coffee className="w-8 h-8 mb-1.5 opacity-90" />
        ) : isSnack ? (
          <Pizza className="w-8 h-8 mb-1.5 opacity-90" />
        ) : isSauce ? (
          <Soup className="w-8 h-8 mb-1.5 opacity-90" />
        ) : (
          <Utensils className="w-8 h-8 mb-1.5 opacity-90" />
        )}
        <span className="text-[11px] font-bold line-clamp-1 max-w-[90%] opacity-95">
          {alt}
        </span>
        <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">
          Holland Special
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};
