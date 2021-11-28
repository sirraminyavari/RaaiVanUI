import Lottie from 'react-lottie';

const LoadReactangle = ({ width = '10rem', height = '10rem', style }) => {
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
        style={style}
        width={width}
        height={height}
      />
    </div>
  );
};

export default LoadReactangle;
