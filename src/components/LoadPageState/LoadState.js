import Lottie from 'react-lottie';

const LoadState = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('./load.json'),
  };
  const defaultOptions_ = {
    loop: true,
    autoplay: true,
    animationData: require('./load_.json'),
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Lottie
        isStopped={false}
        isPaused={false}
        options={defaultOptions_}
        height={'10rem'}
        width={'10rem'}
        style={{ borderRadius: 17 }}
      />
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

export default LoadState;
