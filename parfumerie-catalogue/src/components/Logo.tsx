import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'icon-only';
  customLogoUrl?: string;
  storeName?: string;
  tagline?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'compact',
  customLogoUrl,
  storeName = 'AromaBoutik',
  tagline = 'МАГАЗИН ИЗЫСКАННЫХ АРОМАТОВ'
}) => {
  // If user provided a custom uploaded/linked image URL in admin settings
  if (customLogoUrl) {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <img
          src={customLogoUrl}
          alt={storeName}
          className="h-9 w-9 sm:h-10 sm:w-10 object-contain rounded-xl"
        />
        {variant !== 'icon-only' && (
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-base sm:text-lg tracking-wide bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                {storeName}
              </span>
            </div>
            {variant === 'full' && (
              <span className="block text-[9px] uppercase tracking-widest text-zinc-400 font-medium">
                {tagline}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Vector Logo matching the user's uploaded image (IMG_0884.jpeg)
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Perfume Bottle & Atomizer Vector Icon from Logo */}
      <div className="relative shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#23242A] to-[#16171B] border border-amber-500/30 flex items-center justify-center p-1.5 shadow-md group">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-amber-400 fill-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="50%" stopColor="#FFB300" />
              <stop offset="100%" stopColor="#FF8F00" />
            </linearGradient>
          </defs>

          {/* Scent Swirl above bottle */}
          <path
            d="M 50 20 C 45 14, 55 8, 52 2 C 50 6, 42 12, 48 18"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Scent mist dots */}
          <circle cx="36" cy="38" r="2" fill="url(#goldGradient)" />
          <circle cx="82" cy="54" r="2.5" fill="url(#goldGradient)" />
          <circle cx="80" cy="62" r="1.5" fill="url(#goldGradient)" />

          {/* Bottle Cap & Sprayer */}
          <rect
            x="44"
            y="22"
            width="12"
            height="6"
            rx="1.5"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
          />
          <rect
            x="42"
            y="28"
            width="16"
            height="8"
            rx="2"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
          />
          <line
            x1="47"
            y1="30"
            x2="47"
            y2="34"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
          />
          <line
            x1="53"
            y1="30"
            x2="53"
            y2="34"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
          />

          {/* Atomizer Bulb Pump Loop */}
          <path
            d="M 58 32 C 72 32, 75 44, 72 50"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Main Glass Flask Body */}
          <path
            d="M 38 40 C 38 36, 62 36, 62 40 C 72 46, 75 60, 70 70 C 66 76, 58 80, 50 80 C 42 80, 34 76, 30 70 C 25 60, 28 46, 38 40 Z"
            stroke="url(#goldGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Internal Liquid Level Curve */}
          <path
            d="M 32 64 C 40 68, 60 68, 68 64"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            strokeDasharray="2 2"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Typography from Logo */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-[#FDE047] via-[#F59E0B] to-[#D97706] bg-clip-text text-transparent font-serif italic">
              Aroma
            </span>
            <span className="font-bold text-base sm:text-lg tracking-tight text-white font-serif">
              Boutik
            </span>
            <span className="text-[8px] uppercase px-1.5 py-0.5 rounded bg-[#FFCC00] text-black font-extrabold tracking-wider ml-0.5">
              ТОП
            </span>
          </div>

          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.14em] text-zinc-400 font-medium whitespace-nowrap leading-none mt-0.5">
            {tagline}
          </span>
        </div>
      )}
    </div>
  );
};
