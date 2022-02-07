import LottieMaker from 'components/LottieMaker/LottieMaker';

const LoadParagraph = () => {
  const data = require('./load.json');

  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <LottieMaker
        animationJSON={data}
        loop={true}
        autoplay={true}
        width="10rem"
        height="10rem"
      />
    </div>
  );
};

export default LoadParagraph;
