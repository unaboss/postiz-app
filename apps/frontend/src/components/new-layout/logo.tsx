'use client';

import { useAddProvider } from '@gitroom/frontend/components/launches/add.provider.component';

export const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="60"
      height="60"
      viewBox="0 0 32 32"
      fill="none"
      className="mt-[8px] min-w-[60px] min-h-[60px]"
      role="img"
      aria-label="North Tech Africa"
    >
      <rect width="32" height="32" rx="6" fill="#f7f2e8" />
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="5.5"
        fill="none"
        stroke="#1a1a17"
        strokeOpacity="0.25"
      />
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
  );
};

export const AddChannelLogo = () => {
  const addProvider = useAddProvider();

  return (
    <button
      type="button"
      onClick={addProvider}
      title="Add Channel"
      aria-label="Add Channel"
      className="cursor-pointer"
    >
      <Logo />
    </button>
  );
};
