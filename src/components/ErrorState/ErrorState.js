import Lottie from 'react-lottie';

const EmptyState = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('./error.json'),
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

export default EmptyState;
