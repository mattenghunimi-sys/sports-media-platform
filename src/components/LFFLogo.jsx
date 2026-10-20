import React from 'react';

export default function LFFLogo({ size = 120, className = "" }) {
  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: `${size}px`, height: `${size * 1.55}px` }}
    >
      <img
        src="/lff-logo.png"
        alt="شعار الاتحاد الليبي لكرة القدم - LFF"
        className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
        loading="eager"
      />
    </div>
  );
}
