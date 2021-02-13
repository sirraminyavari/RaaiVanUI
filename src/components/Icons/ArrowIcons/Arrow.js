import PropTypes from 'prop-types';
import {
  BsArrowUp,
  BsArrowDown,
  BsArrowLeft,
  BsArrowRight,
} from 'react-icons/bs';

const ArrowIcon = ({ dir: direction, size, color, ...rest }) => {
  switch (direction) {
    case 'down':
      return <BsArrowDown size={size} color={color} {...rest} />;
    case 'up':
      return <BsArrowUp size={size} color={color} {...rest} />;
    case 'left':
      return <BsArrowLeft size={size} color={color} {...rest} />;
    default:
      return <BsArrowRight size={size} color={color} {...rest} />;
  }
};

ArrowIcon.propTypes = {
  dir: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default ArrowIcon;
