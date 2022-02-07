import LottieMaker from 'components/LottieMaker/LottieMaker';

const ErrorState = () => {
  const data = require('./error.json');

  return (
    <LottieMaker
      animationJSON={data}
      loop={true}
      autoplay={true}
      width="20rem"
      height="20rem"
    />
  );
};

export default ErrorState;
