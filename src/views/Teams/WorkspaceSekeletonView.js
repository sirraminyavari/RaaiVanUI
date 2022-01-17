import Lottie from 'react-lottie';

const WorkspaceSkeletonView = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: {}, // require('./animation.json')
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <>
      <Lottie
        isStopped={false}
        isPaused={false}
        options={defaultOptions}
        height={'auto'}
        width={'100%'}
      />
    </>
  );
};

export default WorkspaceSkeletonView;
