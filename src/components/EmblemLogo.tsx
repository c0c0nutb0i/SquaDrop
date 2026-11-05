import React from 'react';

interface EmblemLogoProps {
  className?: string;
  size?: number;
  inverted?: boolean;
}

export const EmblemLogo: React.FC<EmblemLogoProps> = ({
  className = '',
  size = 48,
  inverted = false,
}) => {
  const bg = inverted ? '#0D0D0D' : '#FFFFFF';
  const fg = inverted ? '#FFFFFF' : '#0D0D0D';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 select-none shadow-md ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer Circular Boundary */}
        <circle cx="50" cy="50" r="48" fill={bg} stroke={fg} strokeWidth="3" />
        <circle cx="50" cy="50" r="44" stroke={fg} strokeWidth="1.2" strokeDasharray="3 2" />

        {/* Central Dining Plate / Sharing Bowl */}
        <ellipse cx="50" cy="62" rx="24" ry="11" fill={fg} />
        <ellipse cx="50" cy="60" rx="20" ry="8" fill={bg} />

        {/* Steaming Food Aroma waves */}
        <path
          d="M44 49 C42 45, 46 43, 44 39"
          stroke={fg}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M50 48 C48 43, 52 41, 50 36"
          stroke={fg}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M56 49 C54 45, 58 43, 56 39"
          stroke={fg}
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Center Toasting Fork & Knife / Drink icons */}
        <path d="M47 59 L43 53" stroke={fg} strokeWidth="2" strokeLinecap="round" />
        <path d="M53 59 L57 53" stroke={fg} strokeWidth="2" strokeLinecap="round" />

        {/* 3 Squad Members gathering above plate */}
        {/* Left Member */}
        <circle cx="28" cy="40" r="5.5" fill={fg} />
        <path
          d="M19 55 C19 47 24 46 28 46 C32 46 37 47 37 55"
          fill={fg}
        />

        {/* Center Top Member */}
        <circle cx="50" cy="30" r="6.5" fill={fg} />
        <path
          d="M39 47 C39 39 44 38 50 38 C56 38 61 39 61 47"
          fill={fg}
        />

        {/* Right Member */}
        <circle cx="72" cy="40" r="5.5" fill={fg} />
        <path
          d="M63 55 C63 47 68 46 72 46 C76 46 81 47 81 55"
          fill={fg}
        />

        {/* Subtle base connection */}
        <path
          d="M32 73 C42 77 58 77 68 73"
          stroke={fg}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
