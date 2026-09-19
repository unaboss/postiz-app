import React from 'react';

export const LogoTextComponent = () => {
  return (
    <div className="flex items-center gap-[10px] text-white">
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="North Tech Africa"
      >
        <rect width="32" height="32" rx="6" fill="#f7f2e8" />
        <path
          d="M4.5 24.5 L11.6 10.8 L15.5 18.4 L19.2 13.2 L27.5 24.5 Z"
          fill="none"
          stroke="#1a1a17"
          strokeWidth="1.3"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />
        <path
          d="M9.4 15.4 L11.6 10.8 L13.6 15.2"
          fill="none"
          stroke="#34556e"
          strokeWidth="1.1"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />
      </svg>
      <span className="text-[22px] font-[600]">North Tech Africa</span>
    </div>
  );
};
