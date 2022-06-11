import type { ILottieMaker } from 'components/LottieMaker/LottieMaker';
import LottieMaker from 'components/LottieMaker/LottieMaker';

function CelebrateAnimation(
  props: Omit<ILottieMaker, 'animationJSON'>
): JSX.Element {
  const data = require('./celebrate.json');

  return <LottieMaker animationJSON={data} autoplay {...props} />;
}

CelebrateAnimation.displayName = 'LottieCelebrateAnimation';

export default CelebrateAnimation;
