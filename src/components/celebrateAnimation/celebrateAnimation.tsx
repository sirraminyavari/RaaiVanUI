import LottieMaker from 'components/LottieMaker/LottieMaker';
import type { BaseHTMLAttributes } from 'react';

interface CelebrateAnimationType extends BaseHTMLAttributes<HTMLDivElement> {
  loop?: boolean;
  width?: string;
  height?: string;
}
function CelebrateAnimation({
  loop = false,
  width = '5rem',
  height = 'auto',
  ...restProps
}: CelebrateAnimationType): JSX.Element {
  const data = require('./celebrate.json');

  return (
    <LottieMaker
      animationJSON={data}
      loop={loop}
      autoplay={true}
      width={width}
      height={height}
      {...restProps}
    />
  );
}

CelebrateAnimation.displayName = 'LottieCelebrateAnimation';

export default CelebrateAnimation;
