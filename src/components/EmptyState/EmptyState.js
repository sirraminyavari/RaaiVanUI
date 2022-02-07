import LottieMaker from 'components/LottieMaker/LottieMaker';

const EmptyState = () => {
  const data = require('./item.json');

  return (
    <LottieMaker
      animationJSON={data}
      loop={false}
      autoplay={true}
      width="5rem"
      height="auto"
    />
  );
};

export default EmptyState;
