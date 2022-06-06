import type { ILottieMaker } from 'components/LottieMaker/LottieMaker';
import LottieMaker from 'components/LottieMaker/LottieMaker';

function EmptyState(props: Omit<ILottieMaker, 'animationJSON'>): JSX.Element {
  const data = require('./item.json');

  return <LottieMaker animationJSON={data} autoplay {...props} />;
}

EmptyState.displayName = 'LottieEmptyState';

export default EmptyState;
