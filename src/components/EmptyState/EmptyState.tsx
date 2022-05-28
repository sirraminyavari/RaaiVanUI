import LottieMaker from 'components/LottieMaker/LottieMaker';

interface EmptyStateType {
  loop?: boolean;
  width?: string;
  height?: string;
}
function EmptyState({
  loop = false,
  width = '5rem',
  height = 'auto',
}: EmptyStateType): JSX.Element {
  const data = require('./item.json');

  return (
    <LottieMaker
      animationJSON={data}
      loop={loop}
      autoplay={true}
      width={width}
      height={height}
    />
  );
}

EmptyState.displayName = 'LottieEmptyState';

export default EmptyState;
