import Lottie from 'react-lottie';

const EmptyState = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: require('./item.json'),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Lottie
      isStopped={false}
      isPaused={false}
      options={defaultOptions}
      height={'auto'}
      width={'5rem'}
    />
  );
};

export default EmptyState;
