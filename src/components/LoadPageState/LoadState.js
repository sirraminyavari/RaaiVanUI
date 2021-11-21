import Lottie from 'react-lottie';

const LoadState = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('./load.json'),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Lottie
      isStopped={false}
      isPaused={false}
      options={defaultOptions}
      height={'20rem'}
      width={'20rem'}
    />
  );
};

export default LoadState;
