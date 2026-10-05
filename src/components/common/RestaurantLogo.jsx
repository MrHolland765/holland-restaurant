import React from 'react';

export const RestaurantLogo = ({ className = '' }) => (
  <img
    src="/holland-logo.jpg"
    alt="Holland Restaurant"
    className={`object-contain rounded-full bg-white ${className}`}
  />
);
