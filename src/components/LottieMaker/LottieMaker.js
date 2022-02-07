import { Player } from '@lottiefiles/react-lottie-player';
import PropTypes from 'prop-types';

/**
 * @typedef PropType
 * @type {Object}
 * @property {object} animationJSON - The JSON file for animation.
 * @property {boolean} [loop] - If exists, animation loop is true.
 * @property {boolean} [autoplay] - If exists, animation autoplay is true.
 * @property {string | number} height - Width of animation.
 * @property {string | number} [width] - Height of animation.
 */

/**
 * @description Renders a LottieMaker component.
 * @component
 * @param {PropType} props -Props that pass to LottieMaker.
 */
const LottieMaker = ({
  animationJSON,
  loop,
  autoplay,
  height,
  width,
  ...rest
} = {}) => {
  return (
    <Player
      loop={!!loop}
      autoplay={!!autoplay}
      src={animationJSON}
      style={{ width: width, height: height || 'auto' }}
      {...rest}
    />
  );
};

LottieMaker.propTypes = {
  animationJSON: PropTypes.object.isRequired,
  loop: PropTypes.bool,
  autoplay: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

LottieMaker.defaultProps = {
  loop: true,
  autoplay: true,
  width: '5rem',
};

LottieMaker.displayName = 'LottieMakerComponent';

export default LottieMaker;
