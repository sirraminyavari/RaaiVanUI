import Lottie from 'react-lottie';

const LoadParagraph = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('./load.json'),
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Lottie
        isStopped={false}
        isPaused={false}
        options={defaultOptions}
        height={'10rem'}
        width={'10rem'}
      />
    </div>
  );
};

export default LoadParagraph;
