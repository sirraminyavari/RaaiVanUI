import type { IPlayerProps } from '@lottiefiles/react-lottie-player';
import { Player } from '@lottiefiles/react-lottie-player';

export interface ILottieMaker extends Omit<IPlayerProps, 'src'> {
  animationJSON: IPlayerProps['src'];
  height?: string | number;
  width?: string | number;
}
/**
 * @description Renders a LottieMaker component.
 * @component
 * @property {object} props.animationJSON - The JSON file for animation.
 * @property {boolean} [props.loop] - If exists, animation loop is true.
 * @property {boolean} [props.autoplay] - If exists, animation autoplay is true.
 * @property {string | number} props.height - Width of animation.
 * @property {string | number} [props.width] - Height of animation.
 */
function LottieMaker({
  animationJSON,
  height,
  width,
  autoplay,
  style = {},
  loop,
  ...rest
}: ILottieMaker) {
  return (
    <Player
      loop={!!loop}
      autoplay={!!autoplay}
      src={animationJSON}
      style={{ width: width || '5rem', height: height || 'auto', ...style }}
      {...rest}
    />
  );
}

LottieMaker.displayName = 'LottieMakerComponent';

export default LottieMaker;
