import { DotWrapper, Dot } from './LoadingDots.styles';

const LoadingDots = () => {
  return (
    <DotWrapper>
      <Dot delay="-0.32s" />
      <Dot delay="-0.16s" />
      <Dot delay="0s" />
    </DotWrapper>
  );
};
export default LoadingDots;
