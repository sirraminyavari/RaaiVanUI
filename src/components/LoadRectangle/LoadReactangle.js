import LottieMaker from 'components/LottieMaker/LottieMaker';

const LoadReactangle = ({ width = '30rem', height = '10rem', style }) => {
  const data = require('./load_.json');

  return (
    <LottieMaker
      animationJSON={data}
      loop={true}
      autoplay={true}
      width="400"
      height="500"
    />
  );
};

export default LoadReactangle;
