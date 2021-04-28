import PropTypes from 'prop-types';
import {
  IoIosArrowUp,
  IoIosArrowDown,
  IoIosArrowBack,
  IoIosArrowForward,
} from 'react-icons/io';

/**
 * @typedef PropType
 * @property {('down' | 'up' | 'left')} dir - The delay of debouncing.
 */

/**
 *  @description Renders an arrow icon.
 * @component
 * @param {PropType} props
 */
const ArrowHeadIcon = (props) => {
  const { dir: direction, ...rest } = props;

  switch (direction) {
    case 'down':
      return <IoIosArrowDown {...rest} />;
    case 'up':
      return <IoIosArrowUp {...rest} />;
    case 'left':
      return <IoIosArrowBack {...rest} />;
    default:
      return <IoIosArrowForward {...rest} />;
  }
};

ArrowHeadIcon.propTypes = {
  dir: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default ArrowHeadIcon;
