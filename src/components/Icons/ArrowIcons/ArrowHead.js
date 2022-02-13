import PropTypes from 'prop-types';
import {
  IoIosArrowUp,
  IoIosArrowDown,
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosArrowDropleft,
  IoIosArrowDropright,
  IoIosArrowDropup,
  IoIosArrowDropdown,
} from 'react-icons/io';

/**
 * @typedef PropType
 * @property {('down' | 'up' | 'left')} dir - The delay of debouncing.
 * @property {Boolean} circle - The delay of debouncing.
 */

/**
 *  @description Renders an arrow icon.
 * @component
 * @param {PropType} props
 */
const ArrowHeadIcon = (props) => {
  const { dir: direction, circle, ...rest } = props;

  switch (direction) {
    case 'down':
      return circle ? (
        <IoIosArrowDropdown {...rest} />
      ) : (
        <IoIosArrowDown {...rest} />
      );
    case 'up':
      return circle ? (
        <IoIosArrowDropup {...rest} />
      ) : (
        <IoIosArrowUp {...rest} />
      );
    case 'left':
      return circle ? (
        <IoIosArrowDropleft {...rest} />
      ) : (
        <IoIosArrowBack {...rest} />
      );
    default:
      return circle ? (
        <IoIosArrowDropright {...rest} />
      ) : (
        <IoIosArrowForward {...rest} />
      );
  }
};

ArrowHeadIcon.propTypes = {
  dir: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  circle: PropTypes.bool,
};

export default ArrowHeadIcon;
