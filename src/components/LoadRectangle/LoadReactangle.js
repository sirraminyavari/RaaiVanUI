import Lottie from 'react-lottie';

const LoadReactangle = ({ width = '30rem', height = '10rem', style }) => {
  const defaultOptions_ = {
    loop: true,
    autoplay: true,
    animationData: require('./load_.json'),
  };

  return (
    <Lottie
      isStopped={false}
      isPaused={false}
      options={defaultOptions_}
      style={style}
      width={400}
      height={500}
    />
  );
};

export default LoadReactangle;
