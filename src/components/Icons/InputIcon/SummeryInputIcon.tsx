import React from 'react';
import type { SVGProps } from 'react';

interface ISummeryInputIcon extends SVGProps<SVGSVGElement> {
  size?: string;
}

function SummeryInputIcon({ size, ...props }: ISummeryInputIcon): JSX.Element {
  return (
    <>
      <svg
        width={size || '1em'}
        height={size || '1em'}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -42 131 131"
        fill="currentColor"
        {...props}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M58.0143 0.421871C54.9136 0.421871 52.4 3.58351 52.4 7.48359C52.4 11.3837 54.9136 14.5453 58.0143 14.5453L125.386 14.5453C128.486 14.5453 131 11.3837 131 7.48358C131 3.5835 128.486 0.421863 125.386 0.421864L58.0143 0.421871ZM5.61429 33.3766C2.5136 33.3766 0 36.5382 0 40.4383C0 44.3383 2.5136 47.5 5.61428 47.5L125.386 47.5C128.486 47.5 131 44.3384 131 40.4383C131 36.5382 128.486 33.3766 125.386 33.3766L5.61429 33.3766Z"
        />
      </svg>
    </>
  );
}

export default SummeryInputIcon;
