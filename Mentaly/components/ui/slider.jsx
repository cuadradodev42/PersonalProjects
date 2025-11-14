'use client';

import React from 'react';

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value = [0],
  onValueChange,
  disabled = false,
  className = '',
  ...rest
}) {
  const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);

  const handleChange = (e) => {
    const v = Number(e.target.value);
    if (typeof onValueChange === 'function') {
      onValueChange([v]);
    }
  };

  return (
    <div className={`w-full select-none ${className}`} {...rest}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={isNaN(numericValue) ? 0 : numericValue}
        onChange={handleChange}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={numericValue}
        role="slider"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export default Slider;


